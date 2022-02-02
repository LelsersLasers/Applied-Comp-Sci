from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse


def index(request):
    return HttpResponse("Greetings Traveler")

def signup(request, question_id):
    return HttpResponse("You're looking at question %s." % question_id)

def login(request, question_id):
    response = "You're looking at the results of question %s."
    return HttpResponse(response % question_id)

def game(request, question_id):
    return HttpResponse("Play NEOCROSSER")