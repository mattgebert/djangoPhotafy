from django.conf.urls import url
from photaChristianity import views

app_name = 'photaChristianity' #identifier for {% url %} html tag --> {% url 'polls:detail' question.id %}

urlpatterns = [
    url(r'^$', views.defaultView, name='chriatianDefault'),
]
