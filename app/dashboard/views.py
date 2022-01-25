from django.shortcuts import render
from django.http.response import JsonResponse, HttpResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.conf import settings
import json

class EndOfLOG(Exception):
    pass


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


@staff_member_required
def latest_activity_raw(request, page=1):
    line_buffer_size = 2500
    page_size = int(request.GET.get('limit', 10)) * line_buffer_size
    offset = (int(request.GET.get('offset', 1)) or 1) * line_buffer_size * -1
    line_ending = '\n'
    try:
        with open(settings.ACTIVITY_LOG_PATH, 'rb') as activity_file:
            activity_file.seek(0, 2)
            log_size = activity_file.tell()
            if log_size < abs(offset):
                if page > 1:
                    raise EndOfLOG('END OF ACTIVITY LOG')
                activity_file.seek(0)
                offset = None
            else:
                activity_file.seek(offset, 2)
            last_lines = activity_file.read(page_size).decode('utf-8')
            # truncate until the first line
            nrl = last_lines.find(line_ending)
            begin = nrl if nrl > -1 and offset else 0
            end = last_lines.rfind(line_ending)
            response = {
                'total': int(log_size/line_buffer_size),
                'items': last_lines[begin:end],
            }
    except EndOfLOG as e:
        response = {
            'total': int(log_size/line_buffer_size),
            'error': str(e),
        }
    except Exception as e:
        response = {
            "error": str(e)
        }
    return HttpResponse(content_type='json/application', content=json.dumps(response))
