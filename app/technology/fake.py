from .models import Technology


def create_edit_suggestions():
    technologies = Technology.objects.all()
    for tech in technologies:
        serializer = tech.edit_suggestion_serializer()