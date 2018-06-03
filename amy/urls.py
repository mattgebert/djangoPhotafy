from django.conf.urls import url

from . import views

app_name = 'amy' #identifier for {% url %} html tag --> {% url 'polls:detail' question.id %}

urlpatterns = [
    url(r'^$', views.homeView, name='homeView'),
    url(r'^upload/', views.get_img, name="upload"),
    url(r'^2017-06-18', views.event20170618, name='2017birthday'), #TODO Remove
    url(r'^event/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/(?P<day>[0-9]{2})', views.event_display, name='event'),
    # url(r'^event/(?P<year>[0-9]{4})/', views.event_display, name='eventy')
    ]
