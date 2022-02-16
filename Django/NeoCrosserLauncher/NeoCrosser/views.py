from django.shortcuts import render

from django.http import HttpResponse, HttpResponseRedirect
from .models import TopScore, Account, GameSave
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout



def getDisplayName(request):
    if request.user.is_authenticated:
        try:
            return Account.objects.get(user=request.user).display_name
        except: # incase it is my admin account
            return request.user.username
    return ""

def index(request):
    context = {
        "is_login": request.user.is_authenticated,
        "display_name": getDisplayName(request)
    }
    return render(request, 'NeoCrosser/index.html', context)

def signup(request):
    return render(request, 'NeoCrosser/signup.html')

def loginPage(request):
    return render(request, 'NeoCrosser/login.html')

def scores(request):
    context = {'scores_list': TopScore.objects.order_by('-score')}
    return render(request, 'NeoCrosser/scores.html', context)

def createAccount(request):
    display_name = request.POST['display']
    username = request.POST['username']
    password1 = request.POST['password1']
    password2 = request.POST['password2']

    failContext = {
        'error_message': "Error",
        'a': display_name,
        'b': username,
        'c': password1,
        'd': password2
    }

    # TODO: replace the a/b/c/d with a function or something better

    if display_name == "" or username == "" or password1 == "" or password2 == "":
        failContext['error_message'] = "All fields must be filled in"
        return render(request, 'NeoCrosser/signup.html', failContext)
    elif password1 != password2:
        failContext['error_message'] = "Passwords do not match"
        return render(request, 'NeoCrosser/signup.html', failContext)

    accs = Account.objects.all()
    for acc in accs:
        if acc.user.username == username:
            failContext['error_message'] = "That username is already in use"
            return render(request, 'NeoCrosser/signup.html', failContext)
        elif acc.display_name == display_name:
            failContext['error_message'] = "That display name is already in use"
            return render(request, 'NeoCrosser/signup.html', failContext)

    print(isinstance(password1, str))
    user = User.objects.create_user(username=username, password=password1)
    user.save()

    acc = Account(display_name=display_name, user=user)
    acc.save()

    person = authenticate(username=username, password=password1)
    if person is not None:
        login(request, person)
    return HttpResponseRedirect("/neocrosser")

def checkLogin(request):
    username = request.POST['username']
    password = request.POST['password']

    failContext = {
        'error_message': "Error",
        'a': username,
        'b': password
    }

    if username == "" or password == "":
        failContext['error_message'] = "All fields must be filled in"
        return render(request, 'NeoCrosser/login.html', failContext)

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponseRedirect("/neocrosser")

    failContext['error_message'] = "Login not found"
    return render(request, 'NeoCrosser/login.html', failContext)

def logoutUser(request):
    logout(request)
    return HttpResponseRedirect("/neocrosser")  

def game(request):
    if request.user.is_authenticated:
        return render(request, 'NeoCrosser/game.html')
    return HttpResponseRedirect("/neocrosser")

def createScore(request):
    score = int(request.POST['score'])
    ts = TopScore(score=score, account=Account.objects.get(user=request.user))
    ts.save()
    return HttpResponseRedirect("/neocrosser")

def directions(request):
    return render(request, 'NeoCrosser/directions.html')

def restore(request):
    if request.user.is_authenticated:
        acc = Account.objects.get(user=request.user)
        context = {"saves_list": GameSave.objects.filter(account=acc)}
        return render(request, 'NeoCrosser/restore.html', context)
    return HttpResponseRedirect("/neocrosser")

def backToIndex(request):
    return HttpResponseRedirect("/neocrosser")