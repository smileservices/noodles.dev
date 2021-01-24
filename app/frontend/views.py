from django.shortcuts import render
from study_resource.models import StudyResource
from study_resource import filters
from django.db.models import Avg, Q
from problem_solution.models import Problem, Solution
from study_collection.models import Collection

def homepage(request):
    queryset = StudyResource.objects.order_by('-publication_date')
    latest = queryset[:5]
    collections = Collection.objects.filter(is_public=True).all()[:5]
    most_appreciated = queryset.filter(~Q(reviews=None)).order_by('-rating')[:5]
    data = {
        'hide_navbar_search': True,
        'filter': filters.StudyResourceFilter,
        'latest': latest,
        'collections': collections,
        'most_appreciated': most_appreciated,
        'problems': Problem.objects.order_by('-created_at')[:5],
        'solutions': Solution.objects.order_by('-created_at')[:5],
    }
    return render(request, 'frontend/homepage.html', data)

