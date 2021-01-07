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
    path('problem/<int:id>/edit/', views.problem_edit, name='problem-edit'),
    path('solution/<int:id>/edit/', views.solution_edit, name='solution-edit'),
    path('problem/<int:id>/<slug:slug>', views.problem_detail, name='problem-detail'),
    path('solution/<int:id>/<slug:slug>', views.solution_detail, name='solution-detail'),
    path('create/problem/', views.problem_create, name='problem-create'),
]