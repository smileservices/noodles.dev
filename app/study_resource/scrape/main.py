from newspaper import Article, fulltext
from gensim.summarization import summarize, keywords
from requests import request
from core import utils
from django.conf import settings


def scrape_tutorial(url):
    '''
    processes a tutorial url and returns a dict
    name, summary, publishing_date, created_by, tags
    '''
    result = {}
    # todo this is for testing with rest-api. must find a way to mock this properly
    if url == 'www.test-url.test':
        return {'scraped': True}
    try:
        article = Article(url)
        article.download()
        article.parse()
    except Exception as e:
        try:
            response = request('GET', url)
            if response.status_code == 200:
                return {'name': '', 'tags': [], 'top_img': '', 'publishing_date': '', 'created_by': []}
            raise Exception('something went wrong')
        except Exception as e:
            raise Exception('Could not access or parse the URL. Please recheck it and try again.')
    result['name'] = article.title
    result['tags'] = article.tags | set(article.keywords)
    result['top_img'] = article.top_img.split('?')[0]
    if len(result['tags']) < 2:
        result['tags'] = keywords(article.text, ratio=0.03, split=True, lemmatize=True)
    if len(result['tags']) > 7:
        result['tags'] = list(result['tags'])[:7]
    result['publishing_date'] = article.publish_date
    result['created_by'] = article.authors
    try:
        auto_summarized = summarize(article.text, word_count=110)
    except ValueError as e:
        print(e)
        auto_summarized = ''
    combined_summary_arr = [article.summary, article.meta_description, auto_summarized]
    result['summary'] = '\n\n----\n\n'.join(filter(lambda e: e, combined_summary_arr))
    return result


def get_website_screenshot(url):
    '''
    Use an API to get screenshot from url
    return temp image file
    '''
    api_url = f'https://shot.screenshotapi.net/screenshot' \
              f'?token={settings.WEBSITE_SCREENSHOT_TOKEN}' \
              f'&url={url}' \
              f'&width=1044' \
              f'&height=744' \
              f'&output=image' \
              f'&file_type=png' \
              f'&wait_for_event=load'
    temp_file = utils.get_temp_image_file_from_url(api_url)
    return temp_file
