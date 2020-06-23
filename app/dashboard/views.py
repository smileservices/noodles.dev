from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def dashboard(request):
    return render(request, 'dashboard/main.html')


@login_required
def account_settings(request):
    return render(request, 'dashboard/settings.html')
