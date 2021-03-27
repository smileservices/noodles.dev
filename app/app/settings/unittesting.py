from . import *

INTERNAL_IPS = [
    '127.0.0.1',
]

INSTALLED_APPS.append('problem_solution')

GOOGLE_APPLICATION_CREDENTIALS = env.str('GOOGLE_APPLICATION_CREDENTIALS')
AUTOTRANSLATE_TRANSLATOR_SERVICE = 'autotranslate.services.GoogleAPITranslatorService'
VERSATILEIMAGEFIELD_SETTINGS = {
    'create_images_on_demand': False,
    'jpeg_resize_quality': 80,
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

MODERATOR_USER_SCORE = 5