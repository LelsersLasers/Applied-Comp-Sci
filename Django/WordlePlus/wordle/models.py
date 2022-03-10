from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

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

class Score(models.Model):
    name = models.CharField("Compition Name", max_length=200)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    guesses = models.IntegerField("Guesses")
    time = models.IntegerField("Time in seconds")
    sub_date = models.DateField("Date Submitted")

    def __str__(self):
        sec = self.time
        minutes = 0
        while sec > 60:
            minutes += 1
            sec -= 60
        return "%s - %s) '%s' in %i guesses and %02i:%02i" % (self.sub_date, self.account.display_name, self.word.txt, self.guesses, minutes, sec)