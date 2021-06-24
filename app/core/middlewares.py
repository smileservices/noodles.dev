class IsAuthenticatedCookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response.set_cookie('authenticated', 1 if request.user.is_authenticated else 0)
        return response
