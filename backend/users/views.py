

from .models import Post
from rest_framework.generics import ListCreateAPIView
from rest_framework import serializers,permissions

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['content','created_at']

class PostView(ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]
        