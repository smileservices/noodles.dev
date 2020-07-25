from . import *

if DEBUG:
    raise ValueError('Running production settings with DEBUG set to True')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
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
