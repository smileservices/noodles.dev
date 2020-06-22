from django.shortcuts import render
from django.contrib.auth.decorators import login_required
import json


@login_required
def dashboard(request):
    data = {
        'user_full_name': request.user.get_full_name()
    }
    return render(request, 'dashboard/main.html', data)

def accountSettings(request):
    data = {
        'user_full_name': request.user.get_full_name()
    }
    return render(request, 'dashboard/settings.html', data)