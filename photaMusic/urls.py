# from django.conf.urls import url
from django.urls import re_path as url
from photaMusic import apps

from . import views

app_name = 'photaMusic' #identifier for {% url %} html tag --> {% url 'polls:detail' question.id %}
urlpatterns = [
    url(r'^$', views.defaultView, name=apps.PhotamusicConfig.href),
    url(r'track', views.freq_view, name=apps.PhotamusicConfig.href)
]
