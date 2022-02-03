from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from .models import TopScore


def index(request):
    return render(request, 'NeoCrosser/index.html')

def signup(request):
    return render(request, 'NeoCrosser/signup.html')

def login(request):
    return render(request, 'NeoCrosser/login.html')

def scores(request):
    s = TopScore.objects.order_by('-score')
    context = {'scores_list': s}
    return render(request, 'NeoCrosser/scores.html', context)

def game(request):
    return HttpResponse("Play NEOCROSSER")