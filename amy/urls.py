from django.conf.urls import url

from . import views

app_name = 'amy' #identifier for {% url %} html tag --> {% url 'polls:detail' question.id %}

event_pages = [
    url(r'^2017-06-18', views.event20170618, name='2017birthday')
]

urlpatterns = [
    url(r'^$', views.homeView, name='homeView'),
    url(r'^upload/', views.get_img, name="upload"),
    ] + event_pages
