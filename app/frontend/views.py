from django.shortcuts import render
from study_resource.models import StudyResource
from study_resource import filters
from django.db.models import Avg, Q


def homepage(request):
    queryset = StudyResource.objects.annotate_with_rating().order_by('-publication_date')
    latest = queryset[:5]
    most_appreciated = queryset.filter(~Q(reviews=None)).order_by('-rating')[:5]
    data = {
        'filter': filters.StudyResourceFilter,
        'latest': latest,
        'most_appreciated': most_appreciated,
    }
    return render(request, 'frontend/homepage.html', data)

