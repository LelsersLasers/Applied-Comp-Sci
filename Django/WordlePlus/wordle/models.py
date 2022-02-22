from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    display_name = models.CharField("Display Name", max_length=200)

    def __str__(self):
        return self.display_name


class Word(models.Model):
    txt = models.CharField("Word", max_length=200)
    length = models.IntegerField("Length")
    doubleLetters = models.BooleanField("DoubleLetters", default=False)

    def __str__(self):
        return "%i: %s (%s)" % (self.length, self.txt, self.doubleLetters)