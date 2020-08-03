import random

EMAIL_PROVIDERS = [
    'gmail.com', 'yahoo.com', 'hotmail.com'
]


def email(firstName, lastName, provider=False):
    separator = random.choice(['_', '', '-', '.'])
    firstpart = f'{firstName}{separator}{lastName}'.lower()
    email_provider = provider if provider else random.choice(EMAIL_PROVIDERS)
    return f'{firstpart}@{email_provider}'
