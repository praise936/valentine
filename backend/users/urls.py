from .views import PostView

from django.urls import path


urlpatterns = [
    
    path('post/',PostView.as_view()),
]
