from django.urls import path
from . import views

app_name = 'wordle'
urlpatterns = [
    # home/landing page
    path('wordle/', views.display_welcome, name='display_welcome'),
    # Redirect blank url to home page
    path('', views.back_to_welcome, name='back_to_welcome'), # TODO: should name be the same?
    # Redirect to home page
    path('wordle/back_to_welcome/', views.back_to_welcome, name='back_to_welcome'),

    # Signup to create account for MP
    path('wordle/display_signup_page/', views.display_signup_page, name='display_signup_page'),
    # Checks to make sure signup info is good then creates the account
    path('wordle/create_account/', views.create_account, name='create_account'),

    # Login to already created account
    path('wordle/display_login_page/', views.display_login_page, name='display_login_page'),
    # Checks/validates the login (then logs them in)
    path('wordle/check_login/', views.check_login, name='check_login'),

    # Logs the user out
    path('wordle/logout_user/', views.logout_user, name='logout_user'),
    
    # Account settings: change password, display name, or username
    path('wordle/display_account_settings/', views.display_account_settings, name='display_account_settings'),
    # Change password screen
    path('wordle/display_change_password/', views.display_change_password, name='display_change_password'),
    # Change username screen
    path('wordle/display_change_username/', views.display_change_username, name='display_change_username'),
    # Change display name screen
    path('wordle/display_change_display_name/', views.display_change_display_name, name='display_change_display_name'),
    # Makes sure all the info is good/valid then makes the account/user setting change
    path('wordle/change_setting/<str:setting>', views.change_setting, name='change_setting'),
    
    # Generate word screen for SP
    path('wordle/display_SP_launcher/', views.display_SP_launcher, name='display_SP_launcher'),
    # The actual wordle game
    path('wordle/display_game/<str:mode>', views.display_game, name='display_game'),

    # 'hub' screen for multiplayer/online options
    path('wordle/display_MP_Hub/', views.display_MP_Hub, name='display_MP_Hub'),
    # Rankings for a cup
    path('wordle/display_rankings/', views.display_rankings, name='display_rankings'),
    # After submitting a MP score, save it to DB
    path('wordle/MP_receive_score/', views.MP_receive_score, name='MP_receive_score'),

    # Shows all the scores from the current user
    path('wordle/display_personal_scores/', views.display_personal_scores, name='display_personal_scores'),
]