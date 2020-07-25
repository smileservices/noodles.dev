from . import *

INSTALLED_APPS.append('django_extensions')
INSTALLED_APPS.append('autotranslate')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'app_file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': os.path.join(os.path.abspath('/home/vldmr/dev/play/social_auth_implem'), 'app.log'),
        },
        'autotranslate_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(os.path.abspath('/home/vldmr/dev/play/social_auth_implem'), 'autotranslate.log'),
        },
    },
    'loggers': {
        'django': {
            'handlers': ['app_file'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'autotranslate': {
            'handlers': ['autotranslate_file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

LANGUAGES = [
    ('en', 'English'),
    ('vn', 'Tiếng việt'),
    ('de', 'Deutsch'),
    ('fr', 'Française'),
]

AUTOTRANSLATE_TRANSLATOR_SERVICE = 'autotranslate.services.GoogleAPITranslatorService'
