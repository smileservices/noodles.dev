from .models import Tag


def clean_tags():
    Tag.objects.all().delete()


def create_tags():
    tags = []
    for t in ['frontend', 'reactJs', 'python', 'django', 'vscode', 'stuff']:
        tobj = Tag(name=t)
        tobj.save()
        tags.append(tobj)
    return tags