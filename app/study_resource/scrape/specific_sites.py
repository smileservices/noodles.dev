import requests

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from gensim.summarization import summarize, keywords


class Scrape:
    def __init__(self, url) -> None:
        self.url = url

    def _get_data(self):
        page = requests.get(self.url)
        return page.content


class Youtube(Scrape):
    def process_data(self) -> dict:
        result = {}
        youtube_page_data = self._get_data()
        soup = BeautifulSoup(youtube_page_data, "lxml")
        result["name"] = soup.find("meta", {"itemprop": "name"})["content"]
        result["summary"] = soup.find("meta", {"itemprop": "description"})["content"]
        result["publishing_date"] = soup.find("meta", {"itemprop": "datePublished"})[
            "content"
        ]
        result["created_by"] = [
            soup.find("span", {"itemprop": "author"}).find(
                "link", {"itemprop": "name"}
            )["content"]
        ]
        result["top_image"] = soup.find("link", {"itemprop": "thumbnailUrl"})["href"]
        result["tags"] = self._get_tags(
            soup.find_all("meta", {"property": "og:video:tag"})
        )

        return result

    def _get_tags(self, tags) -> list:
        tags_list = []
        for tag in tags:
            tags_list.append(tag["content"])
        return tags_list


class FreeCodeCamp(Scrape):
    def process_data(self) -> dict:
        """Some of the Tutorials on the site are from the news section and they have all
            all the information needed like author, and date created while others are from the 
            organization itself tutorial so they do not have authors"""
        if "news" in self.url:
            return self.process_tutorial_from_news_section()
        return self.process_default_tutorial()
        
    def process_tutorial_from_news_section(self):
        result = {}
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto(self.url)
            result["title"] = page.title()
            result["top_img"] = page.query_selector("picture").query_selector("img").get_attribute("src")
            result["publishing_date"] = page.query_selector("time").inner_text()
            result["created_by"] = page.query_selector(".author-card-name").query_selector("a").inner_text()
            result["summary"] = page.query_selector_all("p")
            paragraphs = page.query_selector_all("p")
            paragraphs_list = [paragraph.inner_text() for paragraph in paragraphs]
            result["summary"] = summarize(" ".join(paragraphs_list)).replace("\n", "")
            result["tags"] = keywords(result["summary"], ratio=0.03, split=True, lemmatize=True)

        return result

    
    def process_default_tutorial(self):
        result = {}
        free_code_camp_page_data = self._get_data()
        soup = BeautifulSoup(free_code_camp_page_data, "html.parser")
        result["name"] = soup.find("title").get_text()
        result["top_img"] = soup.find("meta", {"property": "og:image"})["content"]
        result["publishing_date"] = ""
        result["created_by"] = ["Freecodecamp"]
        result["summary"] = self._get_summary().replace("\n","")
        result["tags"] = keywords(result["summary"], ratio=0.03, split=True, lemmatize=True)

        return result   

    def _get_summary(self) -> str:
        with sync_playwright() as p:
            summary = ""
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto(self.url)
            paragraphs = page.query_selector_all("p")
            paragraphs_list = [paragraph.inner_text() for paragraph in paragraphs]

            summary = summarize(" ".join(paragraphs_list))
            return summary

a = FreeCodeCamp("https://www.freecodecamp.org/news/python-enumerate-what-is-the-enumerate-function-in-python/").process_data()
print(a)