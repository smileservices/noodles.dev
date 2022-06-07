from bs4 import BeautifulSoup
import requests


class Youtube:
    def __init__(self, url) -> None:
        self.url = url

    def _get_data(self):
        youtube_page = requests.get(self.url)
        return youtube_page.content

    def process_data(self) -> dict:
        result = {}
        youtube_page_data = self._get_data()
        soup = BeautifulSoup(youtube_page_data, "html.parser")
        result["name"] = soup.find("meta", {"itemprop": "name"})["content"]
        result["summary"] = soup.find("meta", {"itemprop": "description"})["content"]
        result["publishing_date"] = soup.find("meta", {"itemprop": "datePublished"})[
            "content"
        ]
        result["created_by"] = soup.find("span", {"itemprop": "author"}).find(
            "link", {"itemprop": "name"}
        )["content"]
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
