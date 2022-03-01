from django.contrib import admin
from .models import Account, Word, Score

# Register your models here.
admin.site.register(Account)
admin.site.register(Word)
admin.site.register(Score)