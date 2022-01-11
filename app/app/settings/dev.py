from . import *

INTERNAL_IPS = [
    '127.0.0.1',
]

# INSTALLED_APPS.append('debug_toolbar')
# INSTALLED_APPS.append('django_extensions')
# INSTALLED_APPS.append('silk')

# MIDDLEWARE.insert(9, 'debug_toolbar.middleware.DebugToolbarMiddleware')
# MIDDLEWARE.insert(0, 'silk.middleware.SilkyMiddleware')

# DEBUG_TOOLBAR_PANELS = ['cachalot.panels.CachalotPanel',]

ACTIVITY_LOG_PATH = os.path.join(os.getcwd(), '..', 'LOGS', 'activity.log')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'activity': {
            'format': '{asctime}--{levelname}--{message}',
            'style': '{',
        }
    },
    'handlers': {
        'app_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(os.path.abspath('/home/vldmr/dev/noodles'), 'app.log'),
        },
        'autotranslate_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(os.getcwd(), '../', 'autotranslate.log'),
        },
        'activity_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': ACTIVITY_LOG_PATH,
            'formatter': 'activity'
        },
    },
    'loggers': {
        'django': {
            'handlers': ['app_file'],
            'level': 'INFO',
            'propagate': True,
        },
        'autotranslate': {
            'handlers': ['autotranslate_file'],
            'level': 'INFO',
            'propagate': True,
        },
        'activity': {
            'handlers': ['activity_file'],
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
