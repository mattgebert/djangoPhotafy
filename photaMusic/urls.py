from django.conf.urls import url
from photaMusic import apps

from . import views

app_name = 'photaMusic' #identifier for {% url %} html tag --> {% url 'polls:detail' question.id %}
urlpatterns = [
    url(r'^$', views.defaultView, name=apps.PhotamusicConfig.href,
]
