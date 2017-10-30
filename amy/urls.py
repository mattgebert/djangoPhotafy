from django.conf.urls import url

from . import views

app_name = 'amy' #identifier for {% url %} html tag --> {% url 'polls:detail' question.id %}
urlpatterns = [
    url(r'^$', views.homeView, name='homeView'),
    url(r'^upload/', views.get_img, name="upload"),
    ]
