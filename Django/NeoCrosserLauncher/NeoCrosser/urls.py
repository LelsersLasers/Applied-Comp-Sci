from django.urls import path

from . import views

urlpatterns = [
    # ex: /neocrosser/
    path('', views.index, name='index'),
    # ex: /neocrosser/signup/
    path('signup/', views.signup, name='signup'),
    # ex: /neocrosser/login/
    path('login/', views.login, name='login'),
    # ex: /neocrosser/scores/
    path('scores/', views.scores, name='scores'),
    # ex: /neocrosser/game/
    path('game/', views.game, name='game'), # the actual NEO CROSSER PAGE
]