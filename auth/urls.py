from django.conf.urls import  url
from . import views

app_name = 'users'
urlpatterns = [
    url(r'^data/?$', views.data, name='data'),
    url(r'^login/?$', views.login_user, name='login'),
    url(r'^logout/?$', views.logout_user, name='logout'),
    url(r'^create/?$', views.create_user, name='create'),
    url(r'^index/?$', views.users_index, name='index')
]
