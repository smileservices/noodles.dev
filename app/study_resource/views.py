import requests
from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Avg, Q
from django.db import IntegrityError
from django.conf import settings
from django.urls import reverse_lazy
from django.contrib.auth.decorators import login_required
from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from . import serializers
from . import filters
from .models import StudyResource


def search(request):
    queryset = StudyResource.objects.annotate(rating=Avg('reviews__rating'))
    filtered = filters.StudyResourceFilter(request.GET, queryset=queryset)
    paginator = Paginator(filtered.qs.order_by('-publication_date'), 10)
    try:
        results = paginator.page(request.GET.get('page', 1))
    except PageNotAnInteger:
        results = paginator.page(1)
    except EmptyPage:
        results = paginator.page(paginator.num_pages)
    data = {
        'filter': filtered,
        'paginator': paginator,
        'results': results,
    }
    return render(request, 'study_resource/search_page.html', data)


def detail(request, id):
    queryset = StudyResource.objects.annotate(rating=Avg('reviews__rating'))
    resource = queryset.get(pk=id)
    related = queryset.filter(
        Q(tags__in=resource.tags.all()),
        Q(technologies__in=resource.technologies.all()),
        ~Q(id=resource.id)
    ).order_by('-publication_date')[:5]
    data = {
        'result': resource,
        'related': related,
        'reviews': resource.reviews.order_by('created_at').all(),
        'MAX_RATING': settings.MAX_RATING
    }
    return render(request, 'study_resource/detail_page.html', data)


@login_required
def create(request):
    return render(request, 'study_resource/create_page.html')


class StudyResourceViewset(ModelViewSet):
    serializer_class = serializers.StudyResourceSerializer
    queryset = serializers.StudyResourceSerializer.queryset.annotate(rating=Avg('reviews__rating'))
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
        try:
            self.queryset.only('pk').get(url=request.data['url'])
            return Response({
                'error': True,
                'message': 'Resource with the same url already exists.'
            })
        except StudyResource.DoesNotExist:
            try:
                url_request = requests.get(request.data['url'])
                if url_request.status_code != 200:
                    return Response({
                        'error': True,
                        'message': 'The url is not giving a valid response. Please check it again.'
                    })
            except Exception as e:
                return Response({
                    'error': True,
                    'message': str(e)
                })
            return Response({
                'error': False
            })

    @action(methods=['GET'], detail=False)
    def options(self, request, *args, **kwargs):
        return Response({
            'type': StudyResource.Price.choices,
            'media': StudyResource.Media.choices,
            'experience_level': StudyResource.ExperienceLevel.choices
        })

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user,
        )

    def get_success_headers(self, data):
        return {'Location': reverse_lazy('detail', kwargs={'id': data['pk']})}



class TagViewset(ModelViewSet):
    serializer_class = serializers.TagSerializer
    queryset = serializers.TagSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None


class TechViewset(ModelViewSet):
    serializer_class = serializers.TechnologySerializer
    queryset = serializers.TechnologySerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None

    @action(methods=['POST'], detail=False)
    def validate_url(self, request, *args, **kwargs):
        try:
            url_request = requests.get(request.data['url'])
            if url_request.status_code != 200:
                return Response({
                    'error': True,
                    'message': 'The url is not giving a valid response. Please check it again.'
                })
        except Exception as e:
            return Response({
                'error': True,
                'message': str(e)
            })
        return Response({
            'error': False
        })


class ReviewVieset(ModelViewSet):
    serializer_class = serializers.ReviewSerializer
    queryset = serializers.ReviewSerializer.queryset.order_by('-created_at')
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        raise PermissionDenied(detail='Not allowed to list all reviews')

    def perform_create(self, serializer):
        try:
            serializer.save(author=self.request.user)
        except IntegrityError:
            raise PermissionDenied(
                detail='You already reviewed this. Only one review per resource is allowed for any user')

    @action(methods=['POST'], detail=True)
    def vote(self, request, *args, **kwargs):
        review = self.queryset.get(id=kwargs['pk'])
        try:
            if request.data['vote'] > 0:
                review.vote_up(request.user)
            else:
                review.vote_down(request.user)
            return Response({
                'thumbs': {
                    'up': review.thumbs_up_array,
                    'down': review.thumbs_down_array,
                },
                'vote': request.data['vote'],
                'result': 'Thank you for voting'
            })
        except Exception as e:
            return Response(
                status=403,
                data={
                    'error': e
                })
