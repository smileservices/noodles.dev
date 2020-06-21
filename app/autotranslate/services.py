import collections, six, json, requests
import logging
from django.conf import settings
from google.cloud import translate_v2 as translate

logger = logging.getLogger('autotranslate')


class BaseTranslatorService:
    """
    Defines the base methods that should be implemented
    """

    def translate_string(self, text, target_language, source_language='en'):
        """
        Returns a single translated string literal for the target language.
        """
        raise NotImplementedError('.translate_string() must be overridden.')

    def translate_strings(self, strings, target_language, source_language='en', optimized=True):
        """
        Returns a iterator containing translated strings for the target language
        in the same order as in the strings.
        :return:    if `optimized` is True returns a generator else an array
        """
        raise NotImplementedError('.translate_strings() must be overridden.')


class GoogleAPITranslatorService(BaseTranslatorService):
    """
    Uses the paid Google API for translating.
    https://github.com/google/google-api-python-client
    """

    def __init__(self, max_segments=128):
        self.translate_key = getattr(settings, 'GOOGLE_TRANSLATE_KEY', False)
        self.service_account_key = getattr(settings, 'GOOGLE_APPLICATION_CREDENTIALS', False)
        if not self.service_account_key:
            assert self.translate_key, 'To use GoogleAPI translation you need to add GOOGLE_TRANSLATE_KEY or GOOGLE_APPLICATION_CREDENTIALS in settings.py'
            self.request_type = 'api_key_request'
        else:
            self.request_type = 'service_account_key_request'
        logger.info(f'Using {self.request_type} ...')
        # the google translation API has a limit of max
        # 128 translations in a single request
        # and throws `Too many text segments Error`
        self.max_segments = max_segments
        self.translated_strings = []

    def map_language_code(self, code):
        codes = {
            'vn': 'vi'
        }
        if code in codes:
            return codes[code]
        else:
            return code

    def api_key_request(self, text, source, target):
        url = f'https://translation.googleapis.com/language/translate/v2?key={self.translate_key}'
        data = {
            'source': source,
            'target': target,
            'q': text
        }
        res = requests.post(url, data)
        logger.info(f'Posted to {url} data: {data} --- status {res.status_code}')
        if res.status_code == 200:
            return res
        else:
            logger.error(f'Got error from google api {res.status_code} with response {res.text}')
            raise Exception('Received a bad status code from google api')

    def service_account_key_request(self, text, source, target):
        service = translate.Client()
        translations = service.translate(text, target_language=target, source_language=source)
        return [t['translatedText'] for t in translations]

    def send_request(self, text, source, target):
        target = self.map_language_code(target)
        translation = False
        logger.info(f'{30*"="}')
        logger.info(f'Sending google api request for {len(text)} items for translation')
        logger.info(f'From {source} to {target}')
        logger.info(text)
        if self.request_type == 'api_key_request':
            response = self.api_key_request(text, source, target)
            translation = self.get_list_from_response(response)
        if self.request_type == 'service_account_key_request':
            translation = self.service_account_key_request(text, source, target)
        logger.info(f'{10*"-"} Received translation {10*"-"}')
        logger.info(translation)
        logger.info(f'{30*"="}')
        return translation

    def translate_string(self, text, target_language, source_language='en'):
        assert isinstance(text, six.string_types), '`text` should a string literal'
        response_arr = self.send_request(text=text, source=source_language, target=target_language)
        return response_arr[0]

    def get_list_from_response(self, response):
        return [t['translatedText'] for t in json.loads(response.text)['data']['translations']]

    def translate_strings(self, strings, target_language, source_language='en', optimized=True):
        assert isinstance(strings, collections.MutableSequence), \
            '`strings` should be a sequence containing string_types'
        if len(strings) == 0:
            return []
        elif len(strings) <= self.max_segments:
            setattr(self, 'translated_strings', getattr(self, 'translated_strings', []))
            translations = self.send_request(text=strings, source=source_language, target=target_language)
            self.translated_strings.extend(translations)
            return self.translated_strings
        else:
            self.translate_strings(strings[0:self.max_segments], target_language=target_language,
                                   source_language=source_language)
            _translated_strings = self.translate_strings(strings[self.max_segments:], target_language, source_language)

            # reset the property or it will grow with subsequent calls
            self.translated_strings = []
            return _translated_strings


class AzureAPITranslatorService(BaseTranslatorService):
    """
    Use Azure Translator Text
    https://docs.microsoft.com/en-us/azure/cognitive-services/translator/reference/v3-0-reference
    """

    def __init__(self, max_segments=256):
        self.azure_translator_secret_key = getattr(settings, 'AZURE_TRANSLATOR_SECRET_KEY', None)
        assert self.azure_translator_secret_key, ('`AZURE_TRANSLATOR_SECRET_KEY` is not configured, it is required by `Azure Translator`')

        self.max_segments = max_segments

    def azure_translate(self, strings, target_language, source_language='en'):
        from urllib.parse import quote
        import requests, re

        translated_strings = []
        headers = {'Ocp-Apim-Subscription-Key': self.azure_translator_secret_key,
                   'Content-type': 'application/json'}
        for string in strings:
            base_url = 'https://api.cognitive.microsofttranslator.com/'
            path = 'translate?api-version=3.0&'
            params = 'from={}&to={}'.format(source_language, target_language)
            url = '{}{}{}'.format(base_url, path, params)
            data = [{'Text': string}]
            response = requests.post(url, headers=headers, json=data)
            response = response.json()
            if response[0]['translations']:
                translated_strings.append(response[0]['translations'][0]['text'])
                logger.info('Translate "{}" to "{}"'.format(string, response[0]['translations'][0]['text']))
            else:
                logger.info('Didn\'t get translate for "{}" from Azure.'.format(string))
        return translated_strings

    def translate_string(self, text, target_language, source_language='en'):
        assert isinstance(text, six.string_types), '`text` should a string literal'
        response = self.azure_translate(strings=[text], target=target_language, source=source_language)
        return response

    def translate_strings(self, strings, target_language, source_language='en', optimized=True):
        assert isinstance(strings,
                          collections.MutableSequence), '`strings` should be a sequence containing string_types'

        if len(strings) == 0:
            logger.info('There are no strings request to translate for "{}".'.format(target_language))
            return []
        elif len(strings) <= self.max_segments:
            setattr(self, 'translated_strings', getattr(self, 'translated_strings', []))
            response = self.azure_translate(strings=strings, target_language=target_language,
                                            source_language=source_language)
            if response:
                return response
            else:
                return []
        else:
            # reset the property or it will grow with subsequent calls
            return []
