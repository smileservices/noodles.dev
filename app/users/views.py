from django.shortcuts import render
from rest_framework.permissions import IsAdminUser
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import UserSerializer
from study_resource.models import StudyResource, Review
from study_resource import filters
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Avg

class UsersViewset(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['is_active', 'date_joined']
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'date_joined']
    ordering_fields = ['first_name', 'last_name', 'email', 'is_active', 'date_joined']


def my_profile(request):
    data = {
        'statistics': Review.objects.filter(author=request.user).only('rating__avg').aggregate(Avg('rating'))
    }
    return render(request, 'users/my_profile.html', data)


def my_resources(request):
    queryset = StudyResource.objects.annotate_with_rating().filter(author=request.user)
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
    return render(request, 'users/my_resources.html', data)


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
        'paginator': paginator,
        'results': results,
    }
    return render(request, 'users/my_reviews.html', data)

