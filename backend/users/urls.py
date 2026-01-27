from django.urls import path
from .views import PostView, PostDeleteView

urlpatterns = [
    path('post/', PostView.as_view(), name='post-list-create'),
    path('post/<int:pk>/', PostDeleteView.as_view(), name='post-delete'),
]