from django.conf.urls import  url
from . import views

app_name = 'transaction'
urlpatterns = [
    url(r'^/?$', views.post, name='post'),
]
