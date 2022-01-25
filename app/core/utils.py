from tempfile import NamedTemporaryFile
from django.core.files import File
from uuid import uuid4
import requests
from django.core.files.uploadedfile import InMemoryUploadedFile
import mimetypes
import os
import diff_match_patch as dmp_module
from collections import OrderedDict
from rest_framework.response import Response


def save_file_to_field(field, file_name, raw_content):
    img_temp = NamedTemporaryFile(delete=True)
    img_temp.write(raw_content)
    field.save(
        file_name,
        File(img_temp)
    )
    img_temp.flush()


def write_temp_file_from_request(response):
    try:
        img_temp = NamedTemporaryFile(delete=True)
        img_temp.write(response.content)
        # if the Content-Length header is not present,
        # we get the size of the generated temp file
        size = response.headers.get('Content-Length', os.stat(img_temp.name).st_size)
        fname = f"{uuid4()}.{response.headers['Content-Type']}"
        result = InMemoryUploadedFile(
            img_temp,
            'image_file',
            fname,
            response.headers['Content-Type'],
            size,
            'unicode'
        )
        return result
    except Exception as e:
        raise Exception('Encountered error while retrieving image from URL. Please try again or use another address')


def get_temp_image_file_from_url(url):
    response = requests.get(url)
    content_type = response.headers['Content-Type']
    if content_type.split('/')[0] != 'image':
        raise ValueError(f'URL {url} is not image or is invalid!')
    result = write_temp_file_from_request(response)
    return result


def get_serialized_models_diff(old, new, fields):
    # receives two dicts and compares them, storing the diff
    # returns a dict with tracked fields and their calculated diff
    changes = {}
    dmp = dmp_module.diff_match_patch()
    for field in fields:
        old_value = old[field]
        new_value = new[field]
        if field == 'updated_at':
            continue
        if field == 'image_file':
            # we get the first key like "medium" or "small" to check if it's the same
            # the new value has the website root added to the url
            if len(old_value.keys()) == 0:
                continue
            first_key = list(old_value.keys())[0]
            if old_value[first_key] not in new_value[first_key]:
                changes[field] = {
                    'old': old_value,
                    'new': new_value
                }
            continue
        if old_value != new_value:
            if type(old_value) in [list, dict, OrderedDict]:
                # handle nested fields like m2m; we assume that the serialized fields have 'label' key
                try:
                    if type(old_value) == list:
                        old_value = ', '.join([v['label'] for v in old_value])
                        new_value = ', '.join([v['label'] for v in new_value])
                    else:
                        old_value = old_value['label']
                        new_value = new_value['label']
                    diff = dmp.diff_main(str(old_value), str(new_value))
                    dmp.diff_cleanupSemantic(diff)
                    changes[field] = dmp.diff_prettyHtml(diff)
                except KeyError:
                    raise Exception(
                        f'Calculate Changes Error: Could not find \'label\' key when parsing changes on field {field}')
            else:
                old_value = '' if old_value == 'None' else old_value
                new_value = '' if new_value == 'None' else new_value
                diff = dmp.diff_main(str(old_value), str(new_value))
                dmp.diff_cleanupSemantic(diff)
                changes[field] = dmp.diff_prettyHtml(diff)
    return changes


def rest_paginate_queryset(viewset_instance, queryset, serializer=None):
    page = viewset_instance.paginate_queryset(queryset)
    serializer = serializer if serializer else viewset_instance.serializer_class
    if page is not None:
        serialized = serializer(page, many=True)
        return viewset_instance.get_paginated_response(serialized.data)
    serialized = serializer(queryset, many=True)
    return Response(serialized.data)
