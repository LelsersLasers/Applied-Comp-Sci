from django.urls import path
from . import views

app_name = 'wordle'
urlpatterns = [
    # ex: /wordle/
    path('', views.blankURLRedirect, name='index'),

    path('wordle/', views.index, name='index'),
    # ex: /wordle/signup/
    path('wordle/signup/', views.signup, name='signup'),
    # ex: /wordle/loginPage/
    path('wordle/loginPage/', views.loginPage, name='loginPage'),
    # creates the account, shoud redirect back to index
    path('wordle/createAccount/', views.createAccount, name='createAccount'),
    # checks and validates the login, shoud redirect back to index
    path('wordle/checkLogin/', views.checkLogin, name='checkLogin'),
    # logs the user out, shoud redirect back to index
    path('wordle/logoutUser/', views.logoutUser, name='logoutUser'),
    
    # from there: change password, display name, username
    path('wordle/accountSettings/', views.accountSettings, name='accountSettings'),
    # change password screen
    path('wordle/changePassword/', views.changePassword, name='changePassword'),
    # makes sure the changing password worked/can work
    path('wordle/checkChangePassword/', views.checkChangePassword, name='checkChangePassword'),
    # change username screen
    path('wordle/changeUsername/', views.changeUsername, name='changeUsername'),
    # makes sure it works
    path('wordle/checkChangeUsername/', views.checkChangeUsername, name='checkChangeUsername'),
    # change display name screen
    path('wordle/changeDisplayName/', views.changeDisplayName, name='changeDisplayName'),
    # makes sure it works
    path('wordle/checkChangeDisplayName/', views.checkChangeDisplayName, name='checkChangeDisplayName'),

    # shows persons scores
    path('wordle/myScores/', views.myScores, name='myScores'),
    
    # back button
    path('wordle/backToIndex/', views.backToIndex, name='backToIndex'),

    # generate word screen
    path('wordle/SPLauncher/', views.SPLauncher, name='SPLauncher'),
    # single player game
    path('wordle/game/<str:mode>', views.displayGame, name='displayGame'),

    # 'hub' screen for multiplayer/online options
    path('wordle/MPHub/', views.MPHub, name='MPHub'),
    # rankings for a cup/etc
    path('wordle/rankings/', views.rankings, name='rankings'),
    # after submitting a MP score, save it to DB
    path('wordle/MPReceiveScore/', views.MPReceiveScore, name='MPReceiveScore')
]