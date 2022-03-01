import random
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from numpy import double
from .models import Account, Word, Score
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from .allWords import getAllWords


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
    
    return render(request, 'wordle/index.html', context)

def signup(request):
    return render(request, 'wordle/signup.html')

def loginPage(request):
    return render(request, 'wordle/login.html')

def createAccount(request):
    try:
        display_name = request.POST['display']
        username = request.POST['username']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
    except:
        return redirect('wordle:signup')

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
        return render(request, 'wordle/signup.html', failContext)
    elif password1 != password2:
        failContext['error_message'] = "Passwords do not match"
        return render(request, 'wordle/signup.html', failContext)

    accs = Account.objects.all()
    for acc in accs:
        if acc.user.username == username:
            failContext['error_message'] = "That username is already in use"
            return render(request, 'wordle/signup.html', failContext)
        elif acc.display_name == display_name:
            failContext['error_message'] = "That display name is already in use"
            return render(request, 'wordle/signup.html', failContext)

    print(isinstance(password1, str))
    user = User.objects.create_user(username=username, password=password1)
    user.save()

    acc = Account(display_name=display_name, user=user)
    acc.save()

    person = authenticate(username=username, password=password1)
    if person is not None:
        login(request, person)
    return HttpResponseRedirect("/wordle")

def checkLogin(request):
    try:
        username = request.POST['username']
        password = request.POST['password']
    except:
        return redirect('wordle:loginPage')

    failContext = {
        'error_message': "Error",
        'a': username,
        'b': password
    }

    if username == "" or password == "":
        failContext['error_message'] = "All fields must be filled in"
        return render(request, 'wordle/login.html', failContext)

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponseRedirect("/wordle")

    failContext['error_message'] = "Login not found"
    return render(request, 'wordle/login.html', failContext)

def logoutUser(request):
    logout(request)
    return HttpResponseRedirect("/wordle")  

def backToIndex(request):
    return HttpResponseRedirect("/wordle")


def SPLauncher(request):
    return render(request, 'wordle/generateWord.html')

def Game(request, mode):
    try:
        wordLen = request.POST['wordLenSub']
        tries = request.POST['triesSub']
        doubleLetters = True if request.POST['doubleLettersSub'] == 'true' else False
    except:
        if mode == "SP":
            return redirect('wordle:SPLauncher')
        return redirect('wordle:MPHub')

    word = getWord(wordLen, doubleLetters)
    context = {
        'word': word,
        'tries': tries,
        'availableWords': getAllWords(),
        'mode': mode == "SP"
    }
    print(context['word'])
    return render(request, 'wordle/game.html', context)

def rankings(request, name):
    scores = Score.objects.filter(name=name).order_by('-guesses')

    context = {
        'scores': scores
    }
    return render(request, 'wordle/rankings.html', context)

def MPHub(request):
    if request.user.is_authenticated:
        return render(request, 'wordle/MPHub.html')
    return HttpResponseRedirect("/wordle")

def MPReceiveScore(request):
    try:
        cupName = request.POST['cupName']
        word = request.POST['word']
        guesses = request.POST['guesses']
        time = request.POST['time']
    except:
        return redirect('wordle:MPHub')

    acc = Account.objects.get(user=request.user)
    score = Score(name=cupName, word=word, account=acc, guesses=guesses, time=time)
    score.save()
    return redirect('wordle:MPHub')

    



def getWord(wordLen, doubleLetters):
    if (not doubleLetters):
        words = Word.objects.filter(length=wordLen, doubleLetters=False)
    else:
        words = Word.objects.filter(length=wordLen)
    return random.choice(words)
    

# def createDictionary():
#     Word.objects.all().delete()
#     words = getAllWords()
#     i = 0
#     for word in words:
#         doubleLetters = False
#         letters = []
#         for letter in word:
#             if letter in letters:
#                 doubleLetters = True
#                 break
#             else:
#                 letters.append(letter)
#         w = Word(txt=word, length=len(word), doubleLetters=doubleLetters)
#         w.save()
#         print("%i = %i/%i)  %s" % ((i/len(words) * 100), i, len(words), w))
#         i = i + 1