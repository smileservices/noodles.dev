from django.urls import include, path
from dashboard import views
from django.views.i18n import JavaScriptCatalog, JSONCatalog

urlpatterns = [
    path('jsi18n/', JavaScriptCatalog.as_view(packages=['dashboard']), name='javascript-catalog'),
    path('account/settings/', views.account_settings, name='account_settings'),
    path('edit-suggestions', views.latest_edit_suggestions, name='latest-edit-suggestions'),
    path('users', views.latest_users, name='latest-registered-users'),
    path('', views.dashboard, name='dashboard')
]
