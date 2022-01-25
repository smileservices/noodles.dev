from django.shortcuts import render
from django.views.generic import FormView
from rest_framework.permissions import IsAdminUser
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import UserSerializer
from study_resource.models import StudyResource, Review
from study_resource import filters
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Avg
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from .forms import ProfileForm
from django.urls import reverse_lazy
from users.models import CustomUser
from users.serializers import UserSerializerMinimal
from technology.models import Technology
from search.helpers import _search_study_resources, _search_technologies, _search_collections
from django.http.response import JsonResponse
from django.http.response import HttpResponseForbidden, HttpResponseBadRequest
import json
from notifications.models import Subscribers, Notifications
from notifications.serializers import NotificationSerializer, SubscribtionSerializer
from core.utils import rest_paginate_queryset


class UsersViewset(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    queryset = CustomUser.objects
    filterset_fields = ['is_active', 'date_joined']
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'date_joined']
    ordering_fields = ['first_name', 'last_name', 'email', 'is_active', 'date_joined']

    @action(methods=['GET'], detail=False)
    def subscriptions(self, request, *args, **kwargs):
        # get subscriptions per user in paginated form
        subs = Subscribers.objects.filter(users__contains=[request.user.pk])
        return rest_paginate_queryset(self, subs, SubscribtionSerializer)

    @action(methods=['GET'], detail=False)
    def notifications(self, request, *args, **kwargs):
        notifications = Notifications.objects.filter(user_id=request.user.pk).order_by('-datetime')
        return rest_paginate_queryset(self, notifications, NotificationSerializer)


def user_data(request, *args, **kwargs):
    if not request.method == 'GET':
        return HttpResponseBadRequest('Can only make GET requests to this endpoint')
    if not request.user.is_authenticated:
        return HttpResponseForbidden()
    return JsonResponse(UserSerializer(request.user).data, safe=False)


def user_profile(request, username):
    user = CustomUser.objects.get(username=username)
    data = {
        'profile': user,
        'reviews': user.review_set.filter(visible=True),
        'collections': user.collection_set.filter(status=StudyResource.StatusOptions.APPROVED),
        'resources': user.studyresource_set.filter(status=StudyResource.StatusOptions.APPROVED),
        'technologies': user.technology_set.filter(status=StudyResource.StatusOptions.APPROVED),
        'concepts_technology': user.technologyconcept_set.filter(status=StudyResource.StatusOptions.APPROVED),
        'concepts_category': user.categoryconcept_set.filter(status=StudyResource.StatusOptions.APPROVED),
    }
    return render(request, 'users/profile.html', data)


@login_required
def my_profile(request):
    user = request.user
    data = {
        'active': 'profile',
        'profile': user,
        'reviews': user.review_set.filter(visible=True),
        'collections': user.collection_set.filter(status=StudyResource.StatusOptions.APPROVED),
        'resources': user.studyresource_set.filter(status=StudyResource.StatusOptions.APPROVED),
        'technologies': user.technology_set.filter(status=StudyResource.StatusOptions.APPROVED),
        'concepts_technology': user.technologyconcept_set.filter(status=StudyResource.StatusOptions.APPROVED),
        'concepts_category': user.categoryconcept_set.filter(status=StudyResource.StatusOptions.APPROVED),
    }
    return render(request, 'users/my_profile.html', data)

@login_required
def my_subscriptions(request):
    data = {
        'active': 'subscriptions',
        'subscriptions': Subscribers.objects.filter(users__contains=[request.user.pk]).prefetch_related('content_object', 'content_type')
    }
    return render(request, 'users/my_subscriptions.html', data)


@login_required
def my_settings(request):
    data = {
        'active': 'settings'
    }
    return render(request, 'users/my_settings.html', data)


class EditProfile(FormView, LoginRequiredMixin):
    template_name = 'users/my_profile_edit.html'
    form_class = ProfileForm
    success_url = reverse_lazy('my-profile')

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)
        # data['form'] = self.form_class({
        #     'first_name': self.request.user.first_name,
        #     'last_name': self.request.user.last_name,
        # })
        data['form'] = self.form_class(instance=self.request.user)
        return data

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return self.form_valid(form)
        else:
            return self.form_invalid(form)


@login_required
def my_resources(request):
    queryset = StudyResource.objects.filter(author=request.user)
    filtered = filters.StudyResourceFilter(request.GET, queryset=queryset)
    paginator = Paginator(filtered.qs.order_by('-publication_date'), 5)
    try:
        results = paginator.page(request.GET.get('page', 1))
    except PageNotAnInteger:
        results = paginator.page(1)
    except EmptyPage:
        results = paginator.page(paginator.num_pages)
    data = {
        'active': 'resources',
        'filter': filtered,
        'paginator': paginator,
        'results': results,
    }
    return render(request, 'users/my_resources.html', data)


@login_required
def my_reviews(request):
    queryset = Review.objects.filter(author=request.user).order_by('-created_at')
    paginator = Paginator(queryset, 10)
    try:
        results = paginator.page(request.GET.get('page', 1))
    except PageNotAnInteger:
        results = paginator.page(1)
    except EmptyPage:
        results = paginator.page(paginator.num_pages)
    data = {
        'active': 'reviews',
        'paginator': paginator,
        'results': results,
    }
    return render(request, 'users/my_reviews.html', data)


@login_required
def my_collections(request):
    data = {
        'active': 'collections',
        'urls': {
            'study_resource_options': reverse_lazy('study-resource-viewset-options'),
            'tag_options_api': reverse_lazy('tags-options-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            'collections_api': reverse_lazy('collection-viewset-list'),
            'user_collections_list': reverse_lazy('collection-viewset-owned'),
            'update_collection_items': reverse_lazy('collection-viewset-update-collection-items'),

        }
    }
    return render(request, 'users/my_collections.html', data)


@login_required
def my_technologies(request):
    queryset = Technology.objects.filter(author=request.user)
    paginator = Paginator(queryset, 10)
    try:
        results = paginator.page(request.GET.get('page', 1))
    except PageNotAnInteger:
        results = paginator.page(1)
    except EmptyPage:
        results = paginator.page(paginator.num_pages)
    data = {
        'active': 'technologies',
        'paginator': paginator,
        'results': results,
    }
    return render(request, 'users/my_technologies.html', data)


def user_content(request, pk, index):
    term = request.GET.get('search', '')
    index = index
    page_size = int(request.GET.get('resultsPerPage', 10))
    offset_results = int(request.GET.get('offset', 0))
    page = 0 if not offset_results else offset_results / page_size;
    filter = [{
        "nested": {"path": "author",
                   "query": {
                       "bool": {
                           "must": {
                               "match": {
                                   "author.pk": pk
                               }
                           },
                           "filter": []
                       }
                   }
                   }
    }, ]
    if index == 'resources':
        results = _search_study_resources(term, filter, page, page_size)
    elif index == 'collections':
        results = _search_collections(term, filter, page, page_size)
    elif index == 'technologies':
        results = _search_technologies(term, filter, page, page_size)
    else:
        results = f'{index} does not exist'
    return JsonResponse(results, safe=False)
