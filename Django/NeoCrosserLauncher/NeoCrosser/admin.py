from django.contrib import admin

from .models import Account, TopScore, GameSave

admin.site.register(Account)
admin.site.register(TopScore)
admin.site.register(GameSave)