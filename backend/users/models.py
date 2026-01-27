from django.db import models

# Create your models here.
class Post(models.Model):
    reject = models.TextField(null=True,blank=True)
    content = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

