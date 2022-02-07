from django.db import models
from django.contrib.auth.models import User


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField("Display Name", max_length=200)
    play_music = models.BooleanField("Play Music?", default=True)

    def __str__(self):
        return self.username


class TopScore(models.Model):
    score = models.IntegerField("Score")
    account = models.ForeignKey(Account, on_delete=models.DO_NOTHING)

    def __str__(self):
        return "%i" % self.score

    def getRank(self):
        allScores = TopScore.objects.order_by('-score')
        for i in range(len(allScores)):
            if self.score == allScores[i].score:
                return i + 1
        return len(allScores)


class GameSave(models.Model):
    json = models.TextField("JSON Save")
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    is_live = models.BooleanField("Can Join?", default=False)

    def __str__(self):
        return self.json