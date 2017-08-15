from django.conf.urls import url

from . import views

app_name = 'amy' #identifier for {% url %} html tag --> {% url 'polls:detail' question.id %}
urlpatterns = [
    url(r'^$', views.defaultView, name='defaultView'),
    ]
