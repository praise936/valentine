from .models import Post
from rest_framework.generics import ListCreateAPIView, DestroyAPIView
from rest_framework import serializers, permissions

class PostSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'content', 'created_at','reject']
    
    def get_created_at(self, obj):
        # Return formatted datetime string
        return obj.created_at.strftime("%Y-%m-%d %H:%M:%S")

class PostView(ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')  # Order by newest first
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

class PostDeleteView(DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]
    
    
