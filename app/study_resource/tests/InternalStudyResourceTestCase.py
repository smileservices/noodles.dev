import json

from django.test import TestCase
from users.fake import create_user
from study_resource.fake import new_study_resource, new_internal_study_resource, new_study_resource_review
from ..models import Review
from django.core.exceptions import ValidationError
from users.models import CustomUser
from tag.fake import create_tags
from technology.fake import create_technologies
from category.fake import create_categories
from rest_framework.test import force_authenticate
from rest_framework.test import APIClient
from http import HTTPStatus


"""
An internal study resource is a study resource that has content hosted here
"""


class InternalStudyResourceTestCase(TestCase):

    def setUp(self):
        CustomUser.objects.bulk_create([create_user() for _ in range(0, 5)])
        self.users = CustomUser.objects.all()
        create_categories()
        create_tags()
        create_technologies()

    def test_api_can_create_through_api(self):
        """test creating an internal study resource through the api"""
        # todo in this if resource can be created through API not direct
        # todo check for the resource content and flag
        # todo check if the images have been handled correctly
        internal_resource = new_internal_study_resource(self.users[0])
        internal_resource.save()
        client = APIClient()
        client.force_authenticate(user=self.users[0])
        response = client.get(f'{internal_resource.absolute_url}')
        self.assertEqual(response.status_code, HTTPStatus.OK._value_)

    def test_api_can_have_discussion(self):
        """test creating a discussion for the internal resource through the api"""
        #todo implement this. we want to test the API functionality
        raise NotImplementedError
