# Todo for Wordle<sup>+</sup>

Prepare for full release
- Firewall server away from wifi
- Secret key
    - Change to special key on server
        - python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
    - https://dev.to/joshwizzy/how-to-keep-secrets-out-of-django-settings-41c4
    - https://django-environ.readthedocs.io/en/latest/