from tempfile import NamedTemporaryFile
from django.core.files import File
from uuid import uuid4
import requests
from django.core.files.uploadedfile import InMemoryUploadedFile
import mimetypes
import os


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
    content_type = req.headers['Content-Type']
    if content_type.split('/')[0] != 'image':
        raise ValueError(f'URL {url} is not image or is invalid!')
    try:
        img_temp = NamedTemporaryFile(delete=True)
        img_temp.write(req.content)
        # if the Content-Length header is not present,
        # we get the size of the generated temp file
        size = req.headers.get('Content-Length', os.stat(img_temp.name).st_size)
        fname = f"{uuid4()}.{mimetypes.guess_extension(content_type)}"
        result = InMemoryUploadedFile(
            img_temp,
            'image_file',
            fname,
            req.headers['Content-Type'],
            size,
            'unicode'
        )
        return result
    except Exception as e:
        raise Exception('Encountered error while retrieving image from URL. Please try again or use another address')
