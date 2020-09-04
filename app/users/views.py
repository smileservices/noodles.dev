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


class UsersViewset(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['is_active', 'date_joined']
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'date_joined']
    ordering_fields = ['first_name', 'last_name', 'email', 'is_active', 'date_joined']


@login_required
def my_profile(request):
    data = {
        'statistics': {
            'average_given_rating': Review.objects.filter(author=request.user).only('rating__avg').aggregate(
                Avg('rating'))
        }
    }
    return render(request, 'users/my_profile.html', data)


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
        'paginator': paginator,
        'results': results,
    }
    return render(request, 'users/my_reviews.html', data)


@login_required
def my_collections(request):
    return render(request, 'users/my_collections.html')
