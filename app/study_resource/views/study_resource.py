from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.conf import settings
from django.urls import reverse_lazy
from django.contrib.auth.decorators import login_required

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from study_resource.scrape.main import scrape_tutorial
from study_resource import filters
from study_resource.models import StudyResource, StudyResourceImage
from study_resource import serializers


def search(request):
    queryset = StudyResource.objects.order_by_rating_then_publishing_date()
    filtered = filters.StudyResourceFilterMatches(request.GET, queryset=queryset)
    user_query_term = filtered.data["contains"] if "contains" in filtered.data else "your query"
    message = f'Found {filtered.qs.count()} results matching "{user_query_term}"'
    if filtered.qs.count() == 0:
        filtered = filters.StudyResourceFilterSimilar(request.GET, queryset=queryset)
        if filtered.qs.count() > 0:
            message = f'Found {filtered.qs.count()} results similar to "{user_query_term}"'
        else:
            message = f'Count not find any results matching or similar to "{user_query_term}"'
    paginator = Paginator(filtered.qs, 10)
    try:
        results = paginator.page(request.GET.get('page', 1))
    except PageNotAnInteger:
        results = paginator.page(1)
    except EmptyPage:
        results = paginator.page(paginator.num_pages)
    data = {
        'message': message,
        'filter': filtered,
        'paginator': paginator,
        'results': results,
    }
    return render(request, 'study_resource/search_page.html', data)


def detail(request, id, slug):
    queryset = StudyResource.objects
    resource = queryset.get(pk=id)
    related = queryset.filter(
        Q(tags__in=resource.tags.all()),
        Q(technologies__in=resource.technologies.all()),
        ~Q(id=resource.id)
    ).order_by_rating_then_publishing_date()[:5]
    data = {
        'result': resource,
        'related': related,
        'MAX_RATING': settings.MAX_RATING
    }
    return render(request, 'study_resource/detail_page.html', data)


@login_required
def create(request):
    return render(request, 'study_resource/create_page.html')


class StudyResourceViewset(ModelViewSet):
    serializer_class = serializers.StudyResourceSerializer
    queryset = serializers.StudyResourceSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    filterset_class = filters.StudyResourceFilterRest
    search_fields = ['name', 'summary', 'published_by', 'tags__name', 'technologies__name']

    @action(methods=['GET'], detail=True)
    def reviews(self, request, *args, **kwargs):
        queryset = serializers.ReviewSerializer.queryset.filter(
            study_resource=self.kwargs['pk']
        ).order_by('-created_at')
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = serializers.ReviewSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = serializers.ReviewSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def validate_url(self, request, *args, **kwargs):
        queryset = self.queryset
        if 'pk' in request.data:
            queryset = queryset.only('pk').exclude(pk=request.data['pk'])
        try:
            queryset.get(url=request.data['url'])
            return Response({
                'error': True,
                'message': 'Resource with the same url already exists.'
            })
        except StudyResource.DoesNotExist:
            try:
                result = scrape_tutorial(request.data['url'])
                return Response(result)
            except Exception as e:
                return Response({
                    'error': True,
                    'message': str(e)
                })

    @action(methods=['GET'], detail=False)
    def options(self, request, *args, **kwargs):
        return Response({
            'type': StudyResource.Price.choices,
            'media': StudyResource.Media.choices,
            'experience_level': StudyResource.ExperienceLevel.choices
        })

    def perform_create(self, serializer):
        study_resource = serializer.save(
            author=self.request.user,
        )
        for img_data in self.request.data['images']:
            image = StudyResourceImage(study_resource=study_resource, image_url=img_data['url'])
            image.save()

    def get_success_headers(self, data):
        return {'Location': reverse_lazy('detail', kwargs={'id': data['pk'], 'slug': data['slug']})}

    def perform_destroy(self, instance):
        if self.request.user == instance.author or self.request.user.is_superuser:
            instance.delete()
        else:
            raise PermissionDenied('Only owner or admin can delete.')