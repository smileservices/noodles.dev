from ..serializers import StudyResourceAutomatedSerializer
from django.conf import settings
from django.http import HttpResponseForbidden, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
import base64
from copy import deepcopy
from users.models import CustomUser
from core.logging.logger import log_activity, log_resource_error

@csrf_exempt
def auto_add_tutorial(request):
    # creates a tutorial by using an automated system (crawled)
    # check the provided key
    if request.method != 'POST':
        return HttpResponseForbidden()
    if settings.AUTO_ADD_KEY != request.POST['AUTO_ADD_KEY']:
        return HttpResponseForbidden('Forbidden Access')
    request_data = deepcopy(request.POST)
    request_data['image_file'] = request.FILES['image']
    request_data['author'] = CustomUser.objects.get(username='vladimir')

    serialized = StudyResourceAutomatedSerializer(data=request_data)
    # if valid, return 201, else validation error 400
    try:
        if serialized.is_valid(raise_exception=True):
            serialized.save()
            log_activity(f'Autocreated resource {request_data["name"]}')
            return HttpResponse(status=201)
    except Exception as e:
        log_activity(f'ERROR while autocreating resource {request_data["name"]}')
        return HttpResponseBadRequest(reason=str(e))