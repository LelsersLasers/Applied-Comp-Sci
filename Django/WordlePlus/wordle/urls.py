from django.urls import path
from . import views

app_name = 'wordle'
urlpatterns = [
    # home/landing page
    path('wordle/', views.index, name='index'),
    # Redirect blank page to home page
    path('', views.blankURLRedirect, name='index'),

    # Signup to create account for MP
    path('wordle/signup/', views.signup, name='signup'),
    # Checks to make sure signup info is good then creates the account
    path('wordle/createAccount/', views.createAccount, name='createAccount'),

    # Login to already created account
    path('wordle/loginPage/', views.loginPage, name='loginPage'),
    # Checks/validates the login (then logs them in)
    path('wordle/checkLogin/', views.checkLogin, name='checkLogin'),

    # Logs the user out
    path('wordle/logoutUser/', views.logoutUser, name='logoutUser'),
    
    # Account settings: change password, display name, or username
    path('wordle/accountSettings/', views.accountSettings, name='accountSettings'),
    # Change password screen
    path('wordle/changePassword/', views.changePassword, name='changePassword'),
    # Makes sure all info is good then changes passwords
    path('wordle/checkChangePassword/', views.checkChangePassword, name='checkChangePassword'),
    # Change username screen
    path('wordle/changeUsername/', views.changeUsername, name='changeUsername'),
    # Makes sure all info is good then changes username
    path('wordle/checkChangeUsername/', views.checkChangeUsername, name='checkChangeUsername'),
    # Change display name screen
    path('wordle/changeDisplayName/', views.changeDisplayName, name='changeDisplayName'),
    # Makes sure all info is good then changes the display name
    path('wordle/checkChangeDisplayName/', views.checkChangeDisplayName, name='checkChangeDisplayName'),
    
    # Generate word screen for SP
    path('wordle/SPLauncher/', views.SPLauncher, name='SPLauncher'),
    # The actual wordle game
    path('wordle/game/<str:mode>', views.displayGame, name='displayGame'),

    # 'hub' screen for multiplayer/online options
    path('wordle/MPHub/', views.MPHub, name='MPHub'),
    # Rankings for a cup
    path('wordle/rankings/', views.rankings, name='rankings'),
    # After submitting a MP score, save it to DB
    path('wordle/MPReceiveScore/', views.MPReceiveScore, name='MPReceiveScore'),

    # Shows all the scores from the current user
    path('wordle/myScores/', views.myScores, name='myScores'),

    # Redirect to home page
    path('wordle/backToIndex/', views.backToIndex, name='backToIndex')
]