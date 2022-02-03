from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from .models import TopScore, Account


def index(request):
    return render(request, 'NeoCrosser/index.html')

def signup(request):
    return render(request, 'NeoCrosser/signup.html')

def login(request):
    return render(request, 'NeoCrosser/login.html')

def scores(request):
    context = {'scores_list': TopScore.objects.order_by('-score')}
    return render(request, 'NeoCrosser/scores.html', context)

def createAccount(request):
    fullname = request.POST['fullname']
    username = request.POST['username']
    password1 = request.POST['password1']
    password2 = request.POST['password2']

    if fullname == "" or username == "" or password1 == "" or password2 == "":
        context = {
            'error_message': "All fields must be filled in",
            'a': fullname,
            'b': username,
            'c': password1,
            'd': password2
            }
        return render(request, 'NeoCrosser/signup.html', context)
    elif password1 != password2:
        context = {
            'error_message': "Passwords do not match",
            'a': fullname,
            'b': username,
            'c': password1,
            'd': password2
            }
        return render(request, 'NeoCrosser/signup.html', context)
    acc = Account(username=username, password=password1, display_name=fullname)
    acc.save()
    return HttpResponseRedirect("/neocrosser") # not hardcode?

def game(request):
    return HttpResponse("Play NEOCROSSER")