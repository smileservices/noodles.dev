from rest_framework.permissions import BasePermission, SAFE_METHODS


class EditSuggestionAuthorOrAdminOrReadOnly(BasePermission):
    # anyone can read
    # only registered user can create
    # only admin or edit author can update or delete

    def has_permission(self, request, view):
        if bool(
                request.method in SAFE_METHODS or
                request.user and request.method == 'POST' or
                request.user and request.user.is_staff
        ):
            return True
        edit_suggestion = view.get_object()
        return bool(
            request.user and request.user == edit_suggestion.edit_suggestion_author
        )


class AuthorOrAdminOrReadOnly(BasePermission):
    # anyone can read
    # only registered user can create
    # only admin or edit author can update or delete

    def has_permission(self, request, view):
        if bool(
                request.method in SAFE_METHODS or
                request.user and request.method == 'POST' or
                request.user and request.user.is_staff
        ):
            return True
        obj = view.get_object()
        return bool(
            request.user and request.user == obj.author
        )
