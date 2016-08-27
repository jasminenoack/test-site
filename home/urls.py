from django.conf.urls import url
from .views import base

app_name = 'home'
urlpatterns = [
    url(r'^', base, name='base'),
]
