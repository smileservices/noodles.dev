from django.shortcuts import render
from django.views.generic import FormView
from rest_framework.permissions import IsAdminUser
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter
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
import json
from django.http.response import JsonResponse
from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface
from users.models import CustomUser
from users.serializers import UserSerializerMinimal
from technology.models import Technology


class UsersViewset(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['is_active', 'date_joined']
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'date_joined']
    ordering_fields = ['first_name', 'last_name', 'email', 'is_active', 'date_joined']

    # todo show latest users


def user_profile(request, username):
    data = {
        'is_owner': json.dumps(request.user.username == username),
        'profile': json.dumps(UserSerializerMinimal(CustomUser.objects.get(username=username)).data)
    }
    return render(request, 'users/profile.html', data)


@login_required
def my_profile(request):
    data = {
        'active': 'profile',
        'statistics': {
            'average_given_rating': Review.objects.filter(author=request.user).only('rating__avg').aggregate(
                Avg('rating'))
        }
    }
    return render(request, 'users/my_profile.html', data)


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
    paginator = Paginator(filtered.qs.order_by('-publication_date'), 10)
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


def _search_study_resources(term, filter, page, page_size):
    es_res = ElasticSearchInterface(['study_resources'])
    resources_fields = ['name', 'summary', 'category', 'technologies', 'tags']
    rating_sort = [{"rating": {"order": "desc", "missing": "_last", "unmapped_type": "long"}},
                   {"reviews": {"order": "desc", "missing": "_last", "unmapped_type": "long"}}]
    results = es_res.search(
        fields=resources_fields,
        term=term,
        filter=filter,
        sort=rating_sort,
        aggregates={},
        page=page,
        page_size=page_size
    )
    return results


def _search_collections(term, filter, page, page_size):
    es_res = ElasticSearchInterface(['collections'])
    collections_fields = ['name', 'description', 'technologies', 'tags']
    filter.append({"term": {"is_public": True}})
    votes_sort = [{"thumbs_up": {"order": "desc", "missing": "_last", "unmapped_type": "long"}}, ]
    results = es_res.search(
        fields=collections_fields,
        term=term,
        filter=filter,
        sort=votes_sort,
        aggregates={},
        page=page,
        page_size=page_size
    )
    return results


def _search_technologies(term, filter, page, page_size):
    es_res = ElasticSearchInterface(['technologies'])
    technologies_fields = ['name', 'description', 'ecosystem', 'tags']
    votes_sort = [{"thumbs_up": {"order": "desc", "missing": "_last", "unmapped_type": "long"}}, ]
    results = es_res.search(
        fields=technologies_fields,
        term=term,
        filter=filter,
        sort=votes_sort,
        aggregates={},
        page=page,
        page_size=page_size
    )
    return results


def user_content(request, user_pk, index):
    term = False
    page_size = int(request.GET.get('resultsPerPage', 10))
    offset_results = int(request.GET.get('offset', 0))
    page = 0 if not offset_results else offset_results / page_size
    filter = [{"nested": {"path": "author",
                          "query": {
                              "bool": {
                                  "must": {
                                      "match": {
                                          "author.pk": user_pk
                                      }
                                  }
                              }
                          }
                          }}, ]
    if index == 'resources':
        results = _search_study_resources(term, filter, page, page_size)
    elif index == 'collections':
        results = _search_collections(term, filter, page, page_size)
    elif index == 'technologies':
        results = _search_technologies(term, filter, page, page_size)
    else:
        results = f'{index} does not exist'
    return JsonResponse(results, safe=False)
