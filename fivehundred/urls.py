from django.conf.urls import url
from fivehundred import views

app_name = 'fivehundred' #identifier for {% url %} html tag --> {% url 'polls:detail' question.id %}

urlpatterns = [
    url(r'^$', views.defaultView, name='500default'),
]
