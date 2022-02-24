from django.urls import path
from . import views

app_name = 'wordle'
urlpatterns = [
    # ex: /wordle/
    path('', views.index, name='index'),
    # ex: /wordle/signup/
    path('signup/', views.signup, name='signup'),
    # ex: /wordle/loginPage/
    path('loginPage/', views.loginPage, name='loginPage'),
    # creates the account, shoud redirect back to index
    path('createAccount/', views.createAccount, name='createAccount'),
    # checks and validates the login, shoud redirect back to index
    path('checkLogin/', views.checkLogin, name='checkLogin'),
    # logs the user out, shoud redirect back to index
    path('logoutUser/', views.logoutUser, name='logoutUser'),
    # back button
    path('backToIndex/', views.backToIndex, name='backToIndex'),

    # generate word screen
    path('SPLauncher/', views.SPLauncher, name='SPLauncher'),
    # single player game
    path('SPGame/', views.SPGame, name='SPGame'),

    # 'hub' screen for multiplayer/online options
    path('MPHub/', views.MPHub, name='MPHub'),
]