from django.utils.deprecation import MiddlewareMixin

from .models import EditableSuggestion


class HistoryRequestMiddleware(MiddlewareMixin):
    """Expose request to EditableSuggestion.

    This middleware sets request as a local thread variable, making it
    available to the model-level utilities to allow tracking of the
    authenticated user making a change.
    """

    def process_request(self, request):
        EditableSuggestion.thread.request = request

    def process_response(self, request, response):
        if hasattr(EditableSuggestion.thread, "request"):
            del EditableSuggestion.thread.request
        return response
