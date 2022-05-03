from django.urls import path
from . import views

app_name = 'wordle'
urlpatterns = [
    # home/landing page
    path('wordle/', views.display_welcome, name='display_welcome'),
    # Redirect blank url to home page
    path('', views.back_to_welcome, name='back_to_welcome'), # TODO: should name be the same?
    # Redirect to home page
    path('wordle/welcome/', views.back_to_welcome, name='back_to_welcome'),

    # Signup to create account for MP
    path('wordle/signup/', views.display_signup_page, name='display_signup_page'),
    # Checks to make sure signup info is good then creates the account
    path('wordle/create_account/', views.create_account, name='create_account'),

    # Login to already created account
    path('wordle/login/', views.display_login_page, name='display_login_page'),
    # Checks/validates the login (then logs them in)
    path('wordle/check_login/', views.check_login, name='check_login'),

    # Logs the user out
    path('wordle/logout/', views.logout_user, name='logout_user'),
    
    # Account settings: change password, display name, or username
    path('wordle/account_settings/', views.display_account_settings, name='display_account_settings'),
    # The screen where you input new values for either password, display name, or username
    path('wordle/change_setting/<str:setting>', views.display_change_setting, name='display_change_setting'),
    # Makes sure all the info is good/valid then makes the account/user setting change
    path('wordle/change/<str:setting>', views.change_setting, name='change_setting'),
    
    # Generate word screen for SP
    path('wordle/SP_launcher/', views.display_SP_launcher, name='display_SP_launcher'),
    # The actual wordle game
    path('wordle/game/<str:mode>', views.display_game, name='display_game'),

    # 'hub' screen for multiplayer/online options
    path('wordle/MP_hub/', views.display_MP_hub, name='display_MP_hub'),
    # Rankings for a cup
    path('wordle/rankings/', views.display_rankings, name='display_rankings'),
    # After submitting a MP score, save it to DB
    path('wordle/submit_score/', views.MP_receive_score, name='MP_receive_score'),

    # Shows all the scores from the current user
    path('wordle/personal_scores/', views.display_personal_scores, name='display_personal_scores'),
]