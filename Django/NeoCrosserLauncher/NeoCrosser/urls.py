from django.urls import path

from . import views

urlpatterns = [
    # ex: /neocrosser/
    path('', views.index, name='index'),
    # ex: /neocrosser/signup/
    path('signup/', views.detail, name='signup'),
    # ex: /neocrosser/login/
    path('login', views.results, name='login'),
    # ex: /neocrosser/game/
    path('game/', views.vote, name='game'), # the actual NEO CROSSER PAGE
]