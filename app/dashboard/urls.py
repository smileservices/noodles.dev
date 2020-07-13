from django.urls import include, path
from dashboard import views
from django.views.i18n import JavaScriptCatalog, JSONCatalog

urlpatterns = [
    path('jsi18n/', JavaScriptCatalog.as_view(packages=['dashboard']), name='javascript-catalog'),
    path('account/settings/', views.account_settings, name='account_settings'),
    path('simplecrud/', include('simplecrud.urls')),
    path('merchant/', include('merchant.urls')),
    path('', views.dashboard, name='dashboard')
]
