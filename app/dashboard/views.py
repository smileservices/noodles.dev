from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from rest_framework.viewsets import ReadOnlyModelViewSet
# from .serializers import ActivitySerializer
from users.models import CustomUser
from django.contrib.contenttypes.models import ContentType


@staff_member_required
def dashboard(request):
    return render(request, 'dashboard/main_page.html')


@staff_member_required
def account_settings(request):
    return render(request, 'dashboard/settings.html')


@staff_member_required
def latest_edit_suggestions(request):
    return render(request, 'dashboard/edit_suggestions.html')


@staff_member_required
def latest_users(request):
    return render(request, 'dashboard/latest_users.html')


# class LatestActivityViewset(ReadOnlyModelViewSet):
#     serializer_class = ActivitySerializer
#     queryset = ActivitySerializer.queryset.exclude(content_type__model='customuser')
