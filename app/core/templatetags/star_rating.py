from django import template
from django.conf import settings

register = template.Library()


@register.inclusion_tag('star_rating.html')
def star_rating(rating):
    if not rating:
        return 'not rated'
    stars = int(round(rating))
    empty_stars = settings.MAX_RATING - stars
    return {'full_stars': range(stars), 'empty_stars': range(empty_stars)}
