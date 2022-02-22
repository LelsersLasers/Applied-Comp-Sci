from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('wordle/', include('wordle.urls')),
    path('admin/', admin.site.urls),
]
