from . import *
import pathlib
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn=env.str('SENTRY_DSN'),
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,

    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True
)

if DEBUG:
    raise ValueError('Running production settings with DEBUG set to True')

ACCOUNT_DEFAULT_HTTP_PROTOCOL = 'https'

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
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
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
            'handlers': ['console', 'mail_admins'],
            'level': 'INFO',
            'propagate': False,
        },
        'activity': {
            'handlers': ['activity_file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

VERSATILEIMAGEFIELD_SETTINGS = {
    'create_images_on_demand': False,
    'jpeg_resize_quality': 80,
}

EMAIL_HOST = env.str('EMAIL_HOST')
EMAIL_PORT = env.str('EMAIL_PORT')
EMAIL_HOST_USER = env.str('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env.str('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = env.str('EMAIL_USE_TLS', False)
EMAIL_USE_SSL = env.str('EMAIL_USE_SSL', False)
SERVER_EMAIL = env.str('EMAIL_HOST_USER')
