# from django.conf.urls import url
from django.urls import re_path as url
from photaChristianity import views, apps

app_name = apps.PhotachristianityConfig.name #identifier for {% url %} html tag --> {% url 'polls:detail' question.id %}

urlpatterns = [
    url(r'^$', views.defaultView, name=apps.PhotachristianityConfig.href),
]
