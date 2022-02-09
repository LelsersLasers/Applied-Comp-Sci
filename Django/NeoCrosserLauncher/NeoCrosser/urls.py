from django.urls import path

from . import views

app_name = "NeoCrosser"
urlpatterns = [
    # ex: /neocrosser/
    path('', views.index, name='index'),
    # ex: /neocrosser/signup/
    path('signup/', views.signup, name='signup'),
    # ex: /neocrosser/loginPage/
    path('loginPage/', views.loginPage, name='loginPage'),
    # ex: /neocrosser/scores/
    path('scores/', views.scores, name='scores'),
    # ex: /neocrosser/game/
    path('game/', views.game, name='game'), # the actual NEO CROSSER PAGE
    # creates the account, shoud redirect back to index
    path('createAccount/', views.createAccount, name='createAccount'),
    # checks and validates the login, shoud redirect back to index
    path('checkLogin/', views.checkLogin, name='checkLogin'),
    # logs the user out, shoud redirect back to index
    path('logoutUser/', views.logoutUser, name='logoutUser'),
]