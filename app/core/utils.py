from tempfile import NamedTemporaryFile
from django.core.files import File
from uuid import uuid4
import requests
from django.core.files.uploadedfile import InMemoryUploadedFile
import re

def save_file_to_field(field, file_name, raw_content):
    img_temp = NamedTemporaryFile(delete=True)
    img_temp.write(raw_content)
    field.save(
        file_name,
        File(img_temp)
    )
    img_temp.flush()


def get_temp_image_file_from_url(url):
    req = requests.get(url)
    if req.headers['Content-Type'].split('/')[0] != 'image':
        raise ValueError(f'URL {url} is not image or is invalid!')
    img_temp = NamedTemporaryFile(delete=True)
    img_temp.write(req.content)
    fname = ''
    if "Content-Disposition" in req.headers.keys():
        fname = re.findall("filename=(.+)", req.headers["Content-Disposition"])[0]
    else:
        fname = url.split("/")[-1]
    result = InMemoryUploadedFile(
        img_temp,
        'image_file',
        fname,
        req.headers['Content-Type'],
        req.headers['Content-Length'],
        'unicode'
    )
    return result
