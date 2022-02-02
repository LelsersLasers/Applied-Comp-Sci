from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from .models import TopScore


def index(request):
    return HttpResponse("Greetings Traveler")

def signup(request):
    return HttpResponse("SIGNUP")

def login(request):
    return HttpResponse("LOGIN")

def scores(request):
    response = "<ul>"
    s = TopScore.objects.all()
    for score in s:
        response += "<li>RANK %i) %i</li>" % (score.getRank(), score.score)
    response += "</ul>"
    return HttpResponse(response)

def game(request):
    return HttpResponse("Play NEOCROSSER")