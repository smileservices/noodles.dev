from rest_framework.routers import DefaultRouter
from django.urls import path, include
import problem_solution.views as views

router = DefaultRouter()
router.register('problems', views.ProblemViewset, basename='problem-viewset')
router.register('solutions', views.SolutionViewset, basename='solution-viewset')
router.register('problem-edit-suggestion', views.ProblemEditSuggestionViewset, basename='problem-edit-suggestion-viewset')
router.register('solutions-edit-suggestion', views.SolutionEditSuggestionViewset, basename='solution-edit-suggestion-viewset')

urlpatterns = [
    path('api/', include(router.urls)),
    path('problem/<int:id>/edit-suggestions/', views.problem_edit_suggestions, name='problem-edit-suggestions'),
    path('problem/<int:id>/<slug:slug>', views.problem_detail, name='problem-detail'),
    path('solution/<int:id>/<slug:slug>', views.solution_detail, name='solution-detail'),
    path('create/problem/', views.problem_create, name='problem-create'),
]