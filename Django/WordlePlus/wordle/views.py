import random
from numpy import double

from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from .models import Account, Word, Score
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone

from .allWords import getAllWords, getWordsOfLen


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


def accountSettings(request):
    if request.user.is_authenticated:
        return render(request, 'wordle/accountSettings.html')
    return HttpResponseRedirect("/wordle")

def changePassword(request):
    if request.user.is_authenticated:
        return render(request, 'wordle/changePassword.html')
    return HttpResponseRedirect("/wordle")

def checkChangePassword(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    try:
        password = request.POST['password']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
    except:
        return HttpResponseRedirect("/wordle")
    
    failContext = {
        'error_message': "Error",
        "a": password,
        "b": password1,
        "c": password2
    }

    if password == "" or password1 == "" or password2 == "":
        failContext['error_message'] = "All fields must be filled in"
        return render(request, 'wordle/changePassword.html', failContext)

    username = request.user.username
    user = authenticate(username=username, password=password)
    if user is None:
        failContext['error_message'] = "Incorrect password"
        return render(request, 'wordle/changePassword.html', failContext)
    if password1 != password2:
        failContext['error_message'] = "Passwords do not match"
        return render(request, 'wordle/changePassword.html', failContext)

    person = User.objects.get(username=username)
    person.set_password(password1)
    person.save()
    login(request, person)

    context = {
        'sucess': "Password changed"
    }
    return render(request, 'wordle/accountSettings.html', context)
    
def changeUsername(request):
    if request.user.is_authenticated:
        return render(request, 'wordle/changeUsername.html')
    return HttpResponseRedirect("/wordle")

def checkChangeUsername(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    try:
        password = request.POST['password']
        username1 = request.POST['username1']
        username2 = request.POST['username2']
    except:
        return HttpResponseRedirect("/wordle")
    
    failContext = {
        'error_message': "Error",
        "a": password,
        "b": username1,
        "c": username2
    }

    if password == "" or username1 == "" or username2 == "":
        failContext['error_message'] = "All fields must be filled in"
        return render(request, 'wordle/changeUsername.html', failContext)

    username = request.user.username
    user = authenticate(username=username, password=password)
    if user is None:
        failContext['error_message'] = "Incorrect login info"
        return render(request, 'wordle/changeUsername.html', failContext)
    if username1 != username2:
        failContext['error_message'] = "Usernames do not match"
        return render(request, 'wordle/changeUsername.html', failContext)
    if User.objects.filter(username=username1).exists():
        failContext['error_message'] = "Username already in use"
        return render(request, 'wordle/changeUsername.html', failContext)
    person = User.objects.get(username=username)
    person.username = username1
    person.save()
    login(request, person)

    context = {
        'sucess': "Username changed"
    }
    return render(request, 'wordle/accountSettings.html', context)

def changeDisplayName(request):
    if request.user.is_authenticated:
        return render(request, 'wordle/changeDisplayName.html')
    return HttpResponseRedirect("/wordle")

def checkChangeDisplayName(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    try:
        password = request.POST['password']
        name1 = request.POST['name1']
        name2 = request.POST['name2']
    except:
        return HttpResponseRedirect("/wordle")
    
    failContext = {
        'error_message': "Error",
        "a": password,
        "b": name1,
        "c": name2
    }

    if password == "" or name1 == "" or name2 == "":
        failContext['error_message'] = "All fields must be filled in"
        return render(request, 'wordle/changeUsername.html', failContext)

    username = request.user.username
    user = authenticate(username=username, password=password)
    if user is None:
        failContext['error_message'] = "Incorrect login info"
        return render(request, 'wordle/changeDisplayName.html', failContext)
    if name1 != name2:
        failContext['error_message'] = "Display names do not match"
        return render(request, 'wordle/changeDisplayName.html', failContext)
    if Account.objects.filter(display_name=name1).exists():
        failContext['error_message'] = "Display name already in use"
        return render(request, 'wordle/changeDisplayName.html', failContext)
    person = Account.objects.get(user=User.objects.get(username=username))
    person.display_name = name1
    person.save()
    login(request, User.objects.get(username=username))

    context = {
        'sucess': "Display name changed"
    }
    return render(request, 'wordle/accountSettings.html', context)

def backToIndex(request):
    return HttpResponseRedirect("/wordle")


def SPLauncher(request):
    return render(request, 'wordle/generateWord.html')

def displayGame(request, mode):
    try:
        wordLen = request.POST['wordLenSub']
        tries = request.POST['triesSub']
        doubleLetters = True if request.POST['doubleLettersSub'] == 'true' else False
        cup = request.POST['cupSub'].strip()
    except:
        if mode == "SP":
            return redirect('wordle:SPLauncher')
        return redirect('wordle:MPHub')

    word = getWord(wordLen, doubleLetters)
    context = {
        'word': word,
        'tries': tries,
        'availableWords': getWordsOfLen(wordLen),
        'mode': mode == "SP",
        'cup': cup
    }
    print(context['word'])
    return render(request, 'wordle/game.html', context)

def rankings(request):
    try:
        wordLen = request.POST['wordLenSub']
        tries = request.POST['triesSub']
        doubleLetters = True if request.POST['doubleLettersSub'] == 'true' else False
        cup = request.POST['cupSub'].strip()
    except:
        return redirect('wordle:MPHub')

    scores = list(Score.objects.filter(name=cup).order_by('guesses', 'time'))
    if "daily" in cup.lower():
        newScores = []
        tMidNight = (int(timezone.now().timestamp() // 86400)) * 86400
        for score in scores:
            if tMidNight <= int(score.sub_date.timestamp()):
                newScores.append(score)
        scores = newScores
    context = {
        'wordLen': wordLen,
        'tries': tries,
        'doubleLetters': doubleLetters,
        'cup': cup,
        'scores': scores
    }
    return render(request, 'wordle/rankings.html', context)

def MPHub(request):
    if request.user.is_authenticated:
        return render(request, 'wordle/MPHub.html')
    return HttpResponseRedirect("/wordle")

def MPReceiveScore(request):
    try:
        cupName = request.POST['cupName'].strip()
        word = request.POST['word'].strip()
        guesses = int(request.POST['guesses'])
        time = int(request.POST['time'])
    except:
        return redirect('wordle:MPHub')

    wordObj = Word.objects.get(txt=word)
    acc = Account.objects.get(user=request.user)
    score = Score(name=cupName, account=acc, guesses=guesses, time=time, sub_date=timezone.now())
    score.save()
    score.word.add(wordObj)
    return redirect('wordle:MPHub')


def getWord(wordLen, doubleLetters):
    if (not doubleLetters):
        words = Word.objects.filter(length=wordLen, doubleLetters=False)
    else:
        words = Word.objects.filter(length=wordLen)
    return random.choice(words)
    

# def createDictionary(resetDB):
#     if resetDB:
#         Word.objects.all().delete()
#     words = getAllWords()
#     i = 0
#     for word in words:
#         if not len(Word.objects.filter(txt=word)) > 0:
#             doubleLetters = False
#             letters = []
#             for letter in word:
#                 if letter in letters:
#                     doubleLetters = True
#                     break
#                 else:
#                     letters.append(letter)
#             w = Word(txt=word.strip(), length=len(word), doubleLetters=doubleLetters)
#             w.save()
#             print("%i = %i/%i)  %s" % ((i/len(words) * 100), i, len(words), w))
#             i = i + 1