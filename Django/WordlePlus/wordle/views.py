import random
from numpy import double

from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from .models import Account, Word, Score
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone

from .allWords import get_all_words, get_words_of_len



def display_welcome(request):
    display_name = ""
    if request.user.is_authenticated:
        try:
            display_name = Account.objects.get(user=request.user).display_name
        except: # incase it is my admin account which is User not Account
            display_name = request.user.username
    context = {
        "is_login": request.user.is_authenticated,
        "display_name": display_name
    }
    return render(request, 'wordle/index.html', context)

def redirect_to_welcome(request):
    return redirect("wordle:display_welcome")

def back_to_welcome(request):
    return HttpResponseRedirect("/wordle")


def display_signup_page(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    return render(request, 'wordle/signup.html')

def create_account(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    try:
        display_name = request.POST['display']
        username = request.POST['username']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
    except:
        return redirect('wordle:display_signup_page')

    fail_context = {
        'error_message': "Error",
        'a': display_name,
        'b': username,
        'c': password1,
        'd': password2
    }

    if display_name == "" or username == "" or password1 == "" or password2 == "":
        fail_context['error_message'] = "All fields must be filled in"
        return render(request, 'wordle/signup.html', fail_context)
    elif password1 != password2:
        fail_context['error_message'] = "Passwords do not match"
        return render(request, 'wordle/signup.html', fail_context)

    accounts = Account.objects.all()
    for account in accounts:
        if account.user.username == username:
            fail_context['error_message'] = "That username is already in use"
            return render(request, 'wordle/signup.html', fail_context)
        elif account.display_name == display_name:
            fail_context['error_message'] = "That display name is already in use"
            return render(request, 'wordle/signup.html', fail_context)

    user = User.objects.create_user(username=username, password=password1)
    user.save()

    account = Account(display_name=display_name, user=user)
    account.save()

    person = authenticate(username=username, password=password1)
    if person is not None:
        login(request, person)
    return HttpResponseRedirect("/wordle")


def display_login_page(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    return render(request, 'wordle/login.html')

def check_login(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    try:
        username = request.POST['username']
        password = request.POST['password']
    except:
        return redirect('wordle:display_login_page')

    fail_context = {
        'error_message': "Error",
        'a': username,
        'b': password
    }

    if username == "" or password == "":
        fail_context['error_message'] = "All fields must be filled in"
        return render(request, 'wordle/login.html', fail_context)

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponseRedirect("/wordle")

    fail_context['error_message'] = "Login not found"
    return render(request, 'wordle/login.html', fail_context)


def logout_user(request):
    logout(request)
    return HttpResponseRedirect("/wordle")  


def account_settings(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    return render(request, 'wordle/accountSettings.html')

def display_change_password(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    return render(request, 'wordle/changePassword.html')

def change_password(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    try:
        password = request.POST['password']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
    except:
        return HttpResponseRedirect("/wordle")
    
    fail_context = {
        'error_message': "Error",
        "a": password,
        "b": password1,
        "c": password2
    }

    if password == "" or password1 == "" or password2 == "":
        fail_context['error_message'] = "All fields must be filled in"
        return render(request, 'wordle/changePassword.html', fail_context)

    username = request.user.username
    user = authenticate(username=username, password=password)
    if user is None:
        fail_context['error_message'] = "Incorrect old password"
        return render(request, 'wordle/changePassword.html', fail_context)
    if password1 != password2:
        fail_context['error_message'] = "New passwords do not match"
        return render(request, 'wordle/changePassword.html', fail_context)

    person = User.objects.get(username=username)
    person.set_password(password1)
    person.save()
    login(request, person)

    context = {
        'sucess': "Password changed"
    }
    return render(request, 'wordle/accountSettings.html', context)
    
def display_change_username(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    return render(request, 'wordle/changeUsername.html')

def change_username(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    try:
        password = request.POST['password']
        username1 = request.POST['username1']
        username2 = request.POST['username2']
    except:
        return HttpResponseRedirect("/wordle")
    
    fail_context = {
        'error_message': "Error",
        "a": password,
        "b": username1,
        "c": username2
    }

    if password == "" or username1 == "" or username2 == "":
        fail_context['error_message'] = "All fields must be filled in"
        return render(request, 'wordle/changeUsername.html', fail_context)

    username = request.user.username
    user = authenticate(username=username, password=password)
    if user is None:
        fail_context['error_message'] = "Incorrect password"
        return render(request, 'wordle/changeUsername.html', fail_context)
    if username1 != username2:
        fail_context['error_message'] = "Usernames do not match"
        return render(request, 'wordle/changeUsername.html', fail_context)
    if User.objects.filter(username=username1).exists():
        fail_context['error_message'] = "Username already in use"
        return render(request, 'wordle/changeUsername.html', fail_context)

    person = User.objects.get(username=username)
    person.username = username1
    person.save()
    login(request, person)

    context = {
        'sucess': "Username changed"
    }
    return render(request, 'wordle/accountSettings.html', context)

def display_change_display_name(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    return render(request, 'wordle/changeDisplayName.html')

def change_display_name(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    try:
        password = request.POST['password']
        display_name1 = request.POST['name1']
        display_name2 = request.POST['name2']
    except:
        return HttpResponseRedirect("/wordle")
    
    fail_context = {
        'error_message': "Error",
        "a": password,
        "b": display_name1,
        "c": display_name2
    }

    if password == "" or display_name1 == "" or display_name2 == "":
        fail_context['error_message'] = "All fields must be filled in"
        return render(request, 'wordle/changeUsername.html', fail_context)

    username = request.user.username
    user = authenticate(username=username, password=password)
    if user is None:
        fail_context['error_message'] = "Incorrect password"
        return render(request, 'wordle/changeDisplayName.html', fail_context)
    if display_name1 != display_name2:
        fail_context['error_message'] = "Display names do not match"
        return render(request, 'wordle/changeDisplayName.html', fail_context)
    if Account.objects.filter(display_name=display_name1).exists():
        fail_context['error_message'] = "Display name already in use"
        return render(request, 'wordle/changeDisplayName.html', fail_context)

    person = Account.objects.get(user=User.objects.get(username=username))
    person.display_name = display_name1
    person.save()
    login(request, User.objects.get(username=username))

    context = {
        'sucess': "Display name changed"
    }
    return render(request, 'wordle/accountSettings.html', context)


def display_SP_launcher(request):
    return render(request, 'wordle/generateWord.html')

def display_game(request, mode):
    try:
        word_length = request.POST['wordLenSub']
        tries = request.POST['triesSub']
        double_letters = True if request.POST['doubleLettersSub'] == 'true' else False
        cup = request.POST['cupSub'].strip()
    except:
        if mode == "SP":
            return redirect('wordle:display_SP_launcher')
        return redirect('wordle:display_MP_Hub')

    word = get_word(word_length, double_letters)
    context = {
        'word': word,
        'tries': tries,
        'availableWords': get_words_of_len(word_length),
        'mode': mode == "SP",
        'cup': cup
    }
    print(context['word'])
    return render(request, 'wordle/game.html', context)


def display_MP_Hub(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    return render(request, 'wordle/MPHub.html')

def display_rankings(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    try:
        word_length = request.POST['wordLenSub']
        tries = request.POST['triesSub']
        double_letters = True if request.POST['doubleLettersSub'] == 'true' else False
        cup = request.POST['cupSub'].strip()
    except:
        return redirect('wordle:display_MP_Hub')

    scores = []
    for score in list(Score.objects.filter(cup=cup).order_by('guesses', 'time')):
        if score.check_in_time_frame():
            scores.append(score)

    context = {
        'wordLen': word_length,
        'tries': tries,
        'doubleLetters': double_letters,
        'cup': cup,
        'scores': scores
    }
    return render(request, 'wordle/rankings.html', context)
    
def MP_receive_score(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    try:
        cup = request.POST['cupName'].strip()
        word = request.POST['word'].strip()
        guesses = int(request.POST['guesses'])
        time = int(request.POST['time'])
    except:
        return redirect('wordle:display_MP_Hub')

    wordObj = Word.objects.get(txt=word)
    acc = Account.objects.get(user=request.user)
    score = Score(cup=cup, account=acc, guesses=guesses, time=time, sub_date=timezone.now())
    score.save()
    score.word.add(wordObj)
    return redirect('wordle:display_MP_Hub')


def display_personal_scores(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    scores = []
    for score in list(Score.objects.filter(account=Account.objects.get(user=request.user)).order_by('cup')):
        if score.check_in_time_frame():
            scores.append(score)
    context = {
        'scores': scores
    }
    return render(request, 'wordle/scores.html', context)


def get_word(wordLen, doubleLetters):
    if (not doubleLetters):
        words = Word.objects.filter(length=wordLen, double_letters=False)
    else:
        words = Word.objects.filter(length=wordLen)
    return random.choice(words)
    

# def createDictionary(resetDB):
#     if resetDB:
#         Word.objects.all().delete()
#     words = get_all_words()
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
#             w = Word(txt=word.strip(), length=len(word), double_letters=doubleLetters)
#             w.save()
#             print("%i = %i/%i)  %s" % ((i/len(words) * 100), i, len(words), w))
#             i = i + 1