import datetime
from newspaper import Article, fulltext
from gensim.summarization import summarize, keywords
from requests import request
from core import utils
from django.conf import settings
import requests
import logging
from core import constants

logger = logging.getLogger('django')

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
        response = request('GET', url)
        if response.status_code != 200:
            logger.error(f'Could not parse URL {url}')
            raise Exception('Could not parse the URL. Please recheck it and try again.')
        return {'name': '', 'tags': [], 'top_img': '', 'publishing_date': '', 'created_by': []}
    result['name'] = article.title
    result['tags'] = list(article.tags | set(article.keywords))
    result['top_img'] = article.top_img.split('?')[0]
    if len(result['tags']) < 2:
        result['tags'] = keywords(article.text, ratio=0.03, split=True, lemmatize=True)
    if len(result['tags']) > 7:
        result['tags'] = list(result['tags'])[:7]
    result['publishing_date'] = article.publish_date.strftime(constants.DATE_FORMAT) if type(article.publish_date) == datetime.datetime else datetime.date.today().strftime(constants.DATE_FORMAT)
    result['created_by'] = article.authors
    result['summary'] = '\n\n----\n\n'.join([s for s in [article.summary, article.meta_description] if s])
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
    screenshot_response = requests.get(api_url)
    # from screenshotapi we get a json response:
    '''
    {
        "screenshot": "https://screenshotapi-dot-net.storage.googleapis.com/hakibenita_com_all_you_need_to_know_about_prefetching_in_django_9c2641e664d7.png",
        "url": "https://hakibenita.com/all-you-need-to-know-about-prefetching-in-django",
        "created_at": "2021-12-01T10:10:21.318Z",
        "is_fresh": true,
        "token": "ENHIQIZICQ1RRZN1JLF0Y2DHNABB3KP8",
        "ttl": "2021-12-31T10:10:15.643Z"
    }
    '''
    if screenshot_response.status_code == 200:
        if screenshot_response.headers['Content-Type'] == 'image/png':
            temp_file = utils.write_temp_file_from_request(screenshot_response)
        else:
            response_data = screenshot_response.json()
            temp_file = utils.get_temp_image_file_from_url(response_data['screenshot'])
        return temp_file
    else:
        logger.error(f'Could not do screenshot for {url} with https://shot.screenshotapi.net/screenshot')
        raise Exception('Could not process web screenshot through https://shot.screenshotapi.net/screenshot')