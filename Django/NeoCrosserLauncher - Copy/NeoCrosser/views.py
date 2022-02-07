from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from .models import TopScore, Account
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout


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
    dislpay_name = request.POST['display']
    username = request.POST['username']
    password1 = request.POST['password1']
    password2 = request.POST['password2']

    # TODO: replace the a/b/c/d with a function or something better

    if dislpay_name == "" or username == "" or password1 == "" or password2 == "":
        context = {
            'error_message': "All fields must be filled in",
            'a': dislpay_name,
            'b': username,
            'c': password1,
            'd': password2
        }
        return render(request, 'NeoCrosser/signup.html', context)
    elif password1 != password2:
        context = {
            'error_message': "Passwords do not match",
            'a': dislpay_name,
            'b': username,
            'c': password1,
            'd': password2
        }
        return render(request, 'NeoCrosser/signup.html', context)

    users = Account.objects.all()
    for user in users:
        if user.username == username:
            context = {
                'error_message': "That username is already in use",
                'a': dislpay_name,
                'b': username,
                'c': password1,
                'd': password2
            }
            return render(request, 'NeoCrosser/signup.html', context)
        elif user.display_name == dislpay_name:
            context = {
                'error_message': "That display name is already in use",
                'a': dislpay_name,
                'b': username,
                'c': password1,
                'd': password2
            }
            return render(request, 'NeoCrosser/signup.html', context)

    acc = Account(username=username, password=password1, display_name=dislpay_name)
    acc.save()
    return HttpResponseRedirect("/neocrosser") # not hardcode?

def checkLogin(request):
    username = request.POST['username']
    password = request.POST['password']

    if username == "" or password == "":
        context = {
            'error_message': "All fields must be filled in",
            'a': username,
            'b': password
        }
        return render(request, 'NeoCrosser/login.html', context)
    
    users = Account.objects.all()
    for user in users:
        if user.username == username and user.password == password:
            LOGIN
            return HttpResponseRedirect("/neocrosser") # not hardcode?

    context = {
        'error_message': "Login not found!",
        'a': username,
        'b': password
    }
    return render(request, 'NeoCrosser/login.html', context)

def game(request):
    return HttpResponse("Play NEOCROSSER")