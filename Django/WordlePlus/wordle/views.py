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
    return render(request, 'wordle/welcome.html', context)

def back_to_welcome(request):
    return HttpResponseRedirect("/wordle")


def display_signup_page(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    return render(request, 'wordle/signup_page.html')

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
        return render(request, 'wordle/signup_page.html', fail_context)
    elif password1 != password2:
        fail_context['error_message'] = "Passwords do not match"
        return render(request, 'wordle/signup_page.html', fail_context)

    accounts = Account.objects.all()
    for account in accounts:
        if account.user.username == username:
            fail_context['error_message'] = "That username is already in use"
            return render(request, 'wordle/signup_page.html', fail_context)
        elif account.display_name == display_name:
            fail_context['error_message'] = "That display name is already in use"
            return render(request, 'wordle/signup_page.html', fail_context)

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
    return render(request, 'wordle/login_page.html')

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
        return render(request, 'wordle/login_page.html', fail_context)

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponseRedirect("/wordle")

    fail_context['error_message'] = "Login not found"
    return render(request, 'wordle/login_page.html', fail_context)


def logout_user(request):
    logout(request)
    return HttpResponseRedirect("/wordle")  


def display_account_settings(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    return render(request, 'wordle/account_settings.html')

def display_change_password(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    context = {
        'setting': "Password",
        'type': "password"
    }
    return render(request, 'wordle/change_account_setting.html', context)

def display_change_username(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    context = {
        'setting': "Username",
        'type': "text"
    }
    return render(request, 'wordle/change_account_setting.html', context)

def display_change_display_name(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    context = {
        'setting': "Display Name",
        'type': "text"
    }
    return render(request, 'wordle/change_account_setting.html', context)

def change_setting(request, setting):
    if not request.user.is_authenticated:
        return HttpResponseRedirect("/wordle")
    try:
        password = request.POST['password']
        value1 = request.POST[setting + '1']
        value2 = request.POST[setting + '2']
    except:
        return HttpResponseRedirect("/wordle")

    fail_context = {
        'error_message': "Error",
        "a": password,
        "b": value1,
        "c": value2,
        "setting": setting,
        "type": "password" if setting == "Password" else "text"
    }

    if password == "" or value1 == "" or value2 == "":
        fail_context['error_message'] = "All fields must be filled in"
        return render(request, 'wordle/change_account_setting.html', fail_context)

    username = request.user.username
    user = authenticate(username=username, password=password)
    if user is None:
        fail_context['error_message'] = "Incorrect password"
        return render(request, 'wordle/change_account_setting.html', fail_context)
    if value1 != value2:
        fail_context['error_message'] = "New values do not match"
        return render(request, 'wordle/change_account_setting.html', fail_context)

    
    if setting == "Display Name":
        if Account.objects.filter(display_name=value1).exists():
            fail_context['error_message'] = "Display name already in use"
            return render(request, 'wordle/change_account_setting.html', fail_context)
        person = Account.objects.get(user=User.objects.get(username=username))
        person.display_name = value1
        person.save()
    else:
        person = User.objects.get(username=username)
        if setting == "Password":
            person.set_password(value1)
            person.save()
            login(request, person)
        else:
            if User.objects.filter(usernamename=value1).exists():
                fail_context['error_message'] = "Username already in use"
                return render(request, 'wordle/change_account_setting.html', fail_context)
            person.username = value1
            person.save()
            login(request, person)
    
    context = {
        'sucess': setting + " changed"
    }
    return render(request, 'wordle/account_settings.html', context)

def display_SP_launcher(request):
    return render(request, 'wordle/generate_word.html')

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
    return render(request, 'wordle/MP_Hub.html')

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
    score = Score(cup=cup, account=acc, word=wordObj, guesses=guesses, time=time, sub_date=timezone.now())
    score.save()
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
    

# def create_dictionary(resetDB):
#     if resetDB:
#         Word.objects.all().delete()
#     words = get_all_words()
# #     i = 0
# #     for word in words:
#         if not len(Word.objects.filter(txt=word)) > 0:
#             double_letters = False
#             letters = []
#             for letter in word:
#                 if letter in letters:
#                     double_letters = True
#                     break
#                 else:
#                     letters.append(letter)
#             w = Word(txt=word.strip(), length=len(word), double_letters=double_letters)
#             w.save()
#             print("%i = %i/%i)  %s" % ((i/len(words) * 100), i, len(words), w))
#             i = i + 1