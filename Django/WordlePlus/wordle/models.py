from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class Account(models.Model):
    # 1 User to 1 Account
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    display_name = models.CharField("Display Name", max_length=200)

    def __str__(self):
        return self.display_name

class Word(models.Model):
    txt = models.CharField("Word", max_length=200)
    length = models.IntegerField("Length")
    double_letters = models.BooleanField("Does the word have double letters?", default=False)
    common = models.BooleanField("Is it a (sort of) common word?", default=False)

    def __str__(self):
        return "%i: %s (dl: %s, common: %s)" % (self.length, self.txt, self.double_letters, self.common)

class Score(models.Model):
    cup = models.CharField("Cup Name", max_length=200)
    # 1 Word to many Scores - a Word can be used in multiple Scores
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    # 1 Account to many Scores - an Account can have many Scores
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    guesses = models.IntegerField("Guesses taken to solve")
    time = models.IntegerField("Time in seconds taken to solve")
    sub_date = models.DateTimeField("Date Submitted")

    def get_secs_and_mins(self):
        secs = self.time
        mins = 0
        while secs > 60:
            mins += 1
            secs -= 60
        return "%02i:%02i" % (mins, secs)

    def get_guesses_str(self):
        string = "guess"
        if self.guesses != 1:
            string += "es"
        return "%i %s" % (self.guesses, string)

    def __str__(self):
        return "%s) %s - %s) '%s' in %s and %s" % (self.cup, self.sub_date, self.account.display_name, self.word, self.get_guesses_str(), self.get_secs_and_mins())

    def get_rankings_str(self):
        return "%s) '%s' in %s and %s" % (self.account.display_name, self.word.txt, self.get_guesses_str(), self.get_secs_and_mins())

    def get_personal_score_str(self):
        return "%s) '%s' in %s and %s" % (self.cup, self.word.txt, self.get_guesses_str(), self.get_secs_and_mins())

    def check_in_time_frame(self):
        if "daily" in self.cup.lower():
            last_midnight = (int(timezone.now().timestamp() // 86400)) * 86400
            return last_midnight <= int(self.sub_date.timestamp())
        return True