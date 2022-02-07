from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from .models import TopScore, Account
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout


def index(request):
    display_name = ""
    # if request.user.is_authenticated:
    #     display_name = request.user.display_name  
    context = {
        "is_login": request.user.is_authenticated,
        "display_name": display_name
    }
    return render(request, 'NeoCrosser/index.html', context)

def signup(request):
    return render(request, 'NeoCrosser/signup.html')

def login(request):
    return render(request, 'NeoCrosser/login.html')

def scores(request):
    context = {'scores_list': TopScore.objects.order_by('-score')}
    return render(request, 'NeoCrosser/scores.html', context)

def createAccount(request):
    display_name = request.POST['display']
    username = request.POST['username']
    password1 = request.POST['password1']
    password2 = request.POST['password2']

    # TODO: replace the a/b/c/d with a function or something better

    if display_name == "" or username == "" or password1 == "" or password2 == "":
        context = {
            'error_message': "All fields must be filled in",
            'a': display_name,
            'b': username,
            'c': password1,
            'd': password2
        }
        return render(request, 'NeoCrosser/signup.html', context)
    elif password1 != password2:
        context = {
            'error_message': "Passwords do not match",
            'a': display_name,
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
                'a': display_name,
                'b': username,
                'c': password1,
                'd': password2
            }
            return render(request, 'NeoCrosser/signup.html', context)
        elif user.display_name == display_name:
            context = {
                'error_message': "That display name is already in use",
                'a': display_name,
                'b': username,
                'c': password1,
                'd': password2
            }
            return render(request, 'NeoCrosser/signup.html', context)

    user = User(username=username, password=password1)
    user.save()
    acc = Account(display_name=display_name, user=user)
    acc.save()

    person = authenticate(username=username, password=password1)
    if person is not None:
        # IF success, then use the login function so the session persists.
        login(request)
    return HttpResponseRedirect("/neocrosser")


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

    user = authenticate(username=username, password=password)
    if user is not None:
        # IF success, then use the login function so the session persists.
        login(request)
        print(user.__dict__)
        return HttpResponseRedirect("/neocrosser")

    context = {
        'error_message': "Login not found!",
        'a': username,
        'b': password
    }
    return render(request, 'NeoCrosser/login.html', context)

def logoutUser(request):
    logout(request)
    return HttpResponseRedirect("/neocrosser")  

def game(request):
    return render(request, 'NeoCrosser/game.html')