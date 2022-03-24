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
    
    # from there: change password, display name, username
    path('accountSettings/', views.accountSettings, name='accountSettings'),
    # change password screen
    path('changePassword/', views.changePassword, name='changePassword'),
    # makes sure the changing password worked/can work
    path('checkChangePassword/', views.checkChangePassword, name='checkChangePassword'),
    # change username screen
    path('changeUsername/', views.changeUsername, name='changeUsername'),
    # makes sure it works
    path('checkChangeUsername/', views.checkChangeUsername, name='checkChangeUsername'),
    
    # back button
    path('backToIndex/', views.backToIndex, name='backToIndex'),

    # generate word screen
    path('SPLauncher/', views.SPLauncher, name='SPLauncher'),
    # single player game
    path('game/<str:mode>', views.displayGame, name='displayGame'),

    # 'hub' screen for multiplayer/online options
    path('MPHub/', views.MPHub, name='MPHub'),
    # rankings for a cup/etc
    path('rankings/', views.rankings, name='rankings'),
    # after submitting a MP score, save it to DB
    path('MPReceiveScore/', views.MPReceiveScore, name='MPReceiveScore')
]