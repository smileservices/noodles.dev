from . import *

INTERNAL_IPS = [
    '127.0.0.1',
]

INSTALLED_APPS.append('debug_toolbar')
INSTALLED_APPS.append('django_extensions')

# MIDDLEWARE.insert(9, 'debug_toolbar.middleware.DebugToolbarMiddleware')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'app_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(os.path.abspath('/home/vldmr/dev/play/social_auth_implem'), 'app.log'),
        },
        'autotranslate_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(os.path.abspath('/home/vldmr/dev/play/social_auth_implem'), 'autotranslate.log'),
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

MODERATOR_USER_SCORE = 5
