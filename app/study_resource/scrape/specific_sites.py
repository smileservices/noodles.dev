import requests

from bs4 import BeautifulSoup
from selenium import webdriver

DRIVER_PATH = "/web_driver/chromedriver.exe"
DRIVER = webdriver.Chrome(executable_path=DRIVER_PATH)


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
        result = {}
        free_code_camp_page_data = self._get_data()
        soup = BeautifulSoup(free_code_camp_page_data, "html.parser")
        result["name"] = soup.find("title").get_text()
        result["top_img"] = soup.find("meta", {"property": "og:image"})["content"]
        result["publishing_date"] = ""
        result["created_by"] = ["Freecodecamp"]
        result["summary"] = self._get_summary()

        return result

    def _get_summary(self) -> str:
        summary = ""
        DRIVER.get(self.url)
        soup = BeautifulSoup(DRIVER.page_source, "lxml")
        DRIVER.quit()
        paragraphs = soup.find_all("p")[:3]
        for paragraph in paragraphs:
            summary += paragraph.get_text()
        return summary
