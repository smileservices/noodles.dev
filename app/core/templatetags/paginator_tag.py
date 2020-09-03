from django import template

register = template.Library()


@register.inclusion_tag('paginator_tag.html')
def paginator_tag(results, visible_pages):
    return {
        'visible_pages': visible_pages,
        'results': results,
        'before_pages': results.number - visible_pages,
        'after_pages': results.number + visible_pages
    }
