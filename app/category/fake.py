from .models import Category


def clean_categories():
    Category.objects.all().delete()


def create_categories():
    for c in ['frontend', 'backend', 'programming languages', 'databases', 'alghorithms', 'data structures', 'dev ops']:
        cobj = Category(name=c)
        cobj.save()
