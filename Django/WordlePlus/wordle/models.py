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
    word = models.ManyToManyField(Word)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    guesses = models.IntegerField("Guesses")
    time = models.IntegerField("Time in seconds")
    sub_date = models.DateTimeField("Date Submitted")

    def __str__(self):
        sec = self.time
        minutes = 0
        while sec > 60:
            minutes += 1
            sec -= 60
        words = self.word.all()
        wordsTxt = ""
        for word in words:
            wordsTxt += word.txt + " "
        wordsTxt = wordsTxt[:-1]
        return "%s) %s - %s) '%s' in %i guesses and %02i:%02i" % (self.name, self.sub_date, self.account.display_name, wordsTxt, self.guesses, minutes, sec)


    def checkInTimeFrame(self):
        if "daily" in self.name.lower():
            tMidNight = (int(timezone.now().timestamp() // 86400)) * 86400
            return tMidNight <= int(self.sub_date.timestamp())
        return True