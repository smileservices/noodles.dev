from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required


@staff_member_required
def dashboard(request):
    return render(request, 'dashboard/main.html')


@staff_member_required
def account_settings(request):
    return render(request, 'dashboard/settings.html')
