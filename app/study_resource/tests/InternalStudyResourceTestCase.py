import json

from django.test import TestCase
from django.urls import reverse
from technology.models import Technology
from users.fake import create_user
from study_resource.fake import new_study_resource, temporary_image, new_internal_study_resource, new_study_resource_review
from .. import models
from django.core.exceptions import ValidationError
from users.models import CustomUser
from tag.fake import create_tags
from technology.fake import create_technologies
from category.fake import create_categories
from rest_framework.test import force_authenticate
from rest_framework.test import APIClient
from http import HTTPStatus
from faker import Faker
from django.template.defaultfilters import slugify
from random import randint, choice, choices, random
from category.models import Category
from datetime import date

"""
An internal study resource is a study resource that has content hosted here
"""

f = Faker()

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
        name = f.text().split('.')[0]
        categories = Category.objects.all()
        technology = Technology.objects.first()
        data = {
        "name": name,
        "status": 1,
        "slug": slugify(name),
        "publication_date": f.date_between(date(2000, 1, 1), date.today()),
        "published_by": f.name(),
        "url" : f'{f.url()}{randint(1000, 9999999)}/{randint(1000, 9999999)}',
        "technologies": json.dumps([{"technology_id": technology.pk, "version": 1.2}]),
        'summary':f.text(),
        "content": f.text(),
        "is_internal": True,
        "price" : choice(models.StudyResource.Price.choices)[0],
        "media" :choice(models.StudyResource.Media.choices)[0],
        "experience_level" :choice(models.StudyResource.ExperienceLevel.choices)[0],
        "author": self.users[0].username,
        "category": choice(categories).pk,
        "tags": json.dumps(['javascript']),
        "category_concepts": json.dumps([]),
        "technology_concepts": json.dumps([]),
        "image_file": temporary_image("test1"),
        }
        client = APIClient()
        client.force_authenticate(user=self.users[0])
        response = client.post(reverse('study-resource-viewset-list'), data, format='multipart')

        self.assertEqual(response.status_code, 201)  
        self.assertEqual(response.data["is_internal"], True)
        self.assertEqual(response.data["content"], data["content"])
        self.assertEqual(set(list(response.data["image_file"].keys())), set(["small", "large", "medium"]) )

    def test_resource_images(self):
        resource = new_internal_study_resource(self.users[0])
        """Test to see if we can add images to a resource"""
        images = {
            "image_file": temporary_image("test2"),
            "line": 5,
            "study_resource": resource.pk
        }
        client = APIClient()
        client.force_authenticate(user=self.users[0])
        response = client.post(reverse('resource-image-viewset-list'), images, format='multipart')

        self.assertEqual(set(list(response.data["image_file"].keys())), set(["small", "large", "medium"]) )
        self.assertEqual(response.status_code, 201)

    def test_api_can_have_discussion(self):
        """test creating a discussion for the internal resource through the api"""
        #todo implement this. we want to test the API functionality
        raise NotImplementedError