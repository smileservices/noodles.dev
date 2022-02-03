"""
Django settings for app project.

Generated by 'django-admin startproject' using Django 3.0.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
import environ
from django.urls import reverse_lazy

env = environ.Env(
    DEBUG=(bool, False),
    ALLOWED_HOSTS=(list, ["*"])
)
environ.Env.read_env("../.env")

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG")

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.postgres',
    # authentication
    'django.contrib.sites',  # make sure sites is included
    'crispy_forms',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.google',
    # 3rd party apps
    'mptt',
    'captcha',
    'django_edit_suggestion',
    'versatileimagefield',
    # 'easyaudit',
    'huey.contrib.djhuey',
    'mailer',
    'django_user_agents',
    'django.contrib.sitemaps',
    'markdownify.apps.MarkdownifyConfig',
    'cachalot',
    # our app
    'core',
    'history',
    'rest_framework',
    'django_filters',
    'dashboard',
    'frontend',
    'search',
    # models
    'users',
    'tag',
    'technology',
    'category',
    'concepts',
    'study_resource',
    'study_collection',
    'discussions',
    # model dependant
    'notifications',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'compression_middleware.middleware.CompressionMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'easyaudit.middleware.easyaudit.EasyAuditMiddleware',
    'django_user_agents.middleware.UserAgentMiddleware',
    'core.middlewares.IsAuthenticatedCookieMiddleware'
]

SESSION_ENGINE = 'django.contrib.sessions.backends.cached_db'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ],
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 10
}

ROOT_URLCONF = 'app.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['allauth/templates/allauth/', 'core/templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.media',
                'django.template.context_processors.i18n',
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'app.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env('DB_PORT'),
    },
}

HUEY = {
    'name': 'huey-noodles',
    'immediate': False,
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

LOCALE_PATHS = [os.path.join(BASE_DIR, "locale"), os.path.join(BASE_DIR, "dashboard")]

LANGUAGES = [
    ('en', 'English'),
    ('vn', 'Tiếng việt'),
    ('de', 'Deutsch'),
    ('fr', 'Française'),
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = env('STATIC_ROOT')
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static"), ]
MEDIA_ROOT = env('MEDIA_ROOT')
MEDIA_URL = env('MEDIA_URL')

CRISPY_TEMPLATE_PACK = 'bootstrap4'

## Social auth config
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',  # existing backend
    'allauth.account.auth_backends.AuthenticationBackend',
)

SOCIALACCOUNT_PROVIDERS = {
    'facebook': {
        # For each OAuth based provider, either add a ``SocialApp``
        # (``socialaccount`` app) containing the required client
        # credentials, or list them here:
        'APP': {
            'client_id': env.str('FACEBOOK_ID'),
            'secret': env.str('FACEBOOK_SECRET'),
            'key': ''
        }
    },
    'google': {
        'APP': {
            'client_id': env.str('GOOG_ID'),
            'secret': env.str('GOOG_SECRET'),
            'key': ''
        }
    }
}

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": env('REDIS'),
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient"
        },
        "KEY_PREFIX": "noodles"
    }
}

# allauth - main config
AUTH_USER_MODEL = 'users.CustomUser'
ACCOUNT_FORMS = {
    'signup': 'users.forms.SignupForm'
}
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'username_email'
ACCOUNT_EMAIL_VERIFICATION = "mandatory"

# allauth - email confirmation
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = False
ACCOUNT_EMAIL_CONFIRMATION_ANONYMOUS_REDIRECT_URL = reverse_lazy('account_login')
ACCOUNT_EMAIL_CONFIRMATION_AUTHENTICATED_REDIRECT_URL = reverse_lazy('homepage')

# django recaptcha
RECAPTCHA_PUBLIC_KEY = env.str('GOOGLE_RECAPTCHA_PUBLIC_KEY')
RECAPTCHA_PRIVATE_KEY = env.str('GOOGLE_RECAPTCHA_SECRET_KEY')
NOCAPTCHA = True

ADMINS = [tuple(adm.split(':')) for adm in env.list('ADMINS')]
EMAIL_REPLY_TO = env.str('EMAIL_REPLY_TO')
DEFAULT_FROM_EMAIL = env.str('EMAIL_SYSTEM_ADDRESS', 'admin@noodles.dev')

SITE_ID = 1

LOGIN_REDIRECT_URL = reverse_lazy('homepage')
LOGOUT_REDIRECT_URL = reverse_lazy('account_login')

MAX_RATING = 5

# VERSATILE IMAGEFIELD
VERSATILEIMAGEFIELD_RENDITION_KEY_SETS = {
    'resource_image': [
        ('small', 'thumbnail__270x270'),
        ('medium', 'thumbnail__470x470'),
        ('large', 'thumbnail__1230x700'),
    ],
    'technology_logo': [
        ('small', 'thumbnail__45x45'),
        ('medium', 'thumbnail__75x75'),
    ],
}

MARKDOWNIFY = {
    "default": {
        "WHITELIST_TAGS": [
            'h1',
            'h2',
            'h3',
            'p',
            'hr',
            'blockquote',
            'ul', 'ol', 'li',
            'strong', 'b', 'i', 'em',
            'img', 'a',
            # for code highlighting
            'code',
            'pre',
            'span',
            'div',
            # for tables
            'table', 'thead', 'tbody', 'th', 'tr', 'td',
        ],
        "WHITELIST_ATTRS": [
            'class', 'src', 'alt', 'href'
        ],
        "MARKDOWN_EXTENSIONS": [
            'markdown.extensions.extra',
            'markdown.extensions.codehilite',
            'markdown.extensions.sane_lists',
        ],
        "MARKDOWNIFY_WHITELIST_PROTOCOLS": [
            'http',
            'https',
        ]
    }
}

MODERATOR_USER_SCORE = 300

ELASTICSEARCH_PREFIX = env.str('ELASTICSEARCH_PREFIX')
ELASTICSEARCH_HOST = env.list('ELASTICSEARCH_HOST')
ELASTICSEARCH_AUTH = env.tuple('ELASTICSEARCH_AUTH')
ELASTICSEARCH_SCHEMA = env.str('ELASTICSEARCH_SCHEMA')
ELASTICSEARCH_PORT = env.int('ELASTICSEARCH_PORT')

EMAIL_BACKEND = "mailer.backend.DbBackend"

EMAIL_HOST = env.str('EMAIL_HOST')
EMAIL_PORT = env.str('EMAIL_PORT')
EMAIL_HOST_USER = env.str('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env.str('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = env.str('EMAIL_USE_TLS', False)
EMAIL_USE_SSL = env.str('EMAIL_USE_SSL', False)
SERVER_EMAIL = env.str('EMAIL_HOST_USER')

WEBSITE_SCREENSHOT_TOKEN = env.str('WEBSITE_SCREENSHOT_TOKEN')


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
        'activity_file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': ACTIVITY_LOG_PATH,
            'formatter': 'activity'
        },
    },
    'loggers': {
        'activity': {
            'handlers': ['activity_file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}