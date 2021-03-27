from . import *

INTERNAL_IPS = [
    '127.0.0.1',
]

INSTALLED_APPS.append('debug_toolbar')
INSTALLED_APPS.append('django_extensions')
INSTALLED_APPS.append('silk')

# MIDDLEWARE.insert(9, 'debug_toolbar.middleware.DebugToolbarMiddleware')
# MIDDLEWARE.insert(0, 'silk.middleware.SilkyMiddleware')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'app_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(os.path.abspath('/home/vldmr/dev/noodles'), 'app.log'),
        },
        'autotranslate_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(os.path.abspath('/home/vldmr/dev/noodles'), 'autotranslate.log'),
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
        }
    },
    'loggers': {
        'django': {
            'handlers': ['app_file', 'mail_admins'],
            'level': 'INFO',
            'propagate': True,
        },
        'autotranslate': {
            'handlers': ['autotranslate_file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

GOOGLE_APPLICATION_CREDENTIALS = env.str('GOOGLE_APPLICATION_CREDENTIALS')
AUTOTRANSLATE_TRANSLATOR_SERVICE = 'autotranslate.services.GoogleAPITranslatorService'
VERSATILEIMAGEFIELD_SETTINGS = {
    'create_images_on_demand': False,
    'jpeg_resize_quality': 80,
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# EMAIL_HOST = env.str('EMAIL_HOST')
# EMAIL_PORT = env.str('EMAIL_PORT')
# EMAIL_HOST_USER = env.str('EMAIL_HOST_USER')
# EMAIL_HOST_PASSWORD = env.str('EMAIL_HOST_PASSWORD')
# EMAIL_USE_TLS = env.str('EMAIL_USE_TLS', False)
# EMAIL_USE_SSL = env.str('EMAIL_USE_SSL', False)
# SERVER_EMAIL = env.str('EMAIL_HOST_USER')

MODERATOR_USER_SCORE = 5
