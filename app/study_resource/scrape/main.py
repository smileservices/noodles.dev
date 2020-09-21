from newspaper import Article, fulltext
from gensim.summarization import summarize, keywords


def scrape_tutorial(url):
    '''
    processes a tutorial url and returns a dict
    name, summary, publishing_date, created_by, tags
    '''
    result = {}
    article = Article(url)
    article.download()
    article.parse()
    result['name'] = article.title
    result['tags'] = article.tags | set(article.keywords)
    result['top_img'] = article.top_img.split('?')[0]
    if not result['tags']:
        result['tags'] = keywords(article.text, ratio=0.03, split=True, lemmatize=True)
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
