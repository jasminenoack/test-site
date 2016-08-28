from django.conf.urls import  url
from . import views

app_name = 'accounts'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<account_id>[0-9]+)$', views.detail, name='detail'),
    url(r'^manage/?$', views.manage_index, name='manage_index')
]
