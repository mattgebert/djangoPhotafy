# from django.conf.urls import url
from django.urls import re_path as url
from photaPhysics import views,apps
from django.urls import path
from photaHome.views import subpageView

app_name = apps.PhotaphysicsConfig.name #identifier for {% url %} html tag --> {% url 'polls:detail' question.id %}

# phys_subpages =

urlpatterns = [
    url(r'^$', views.defaultView, name=apps.PhotaphysicsConfig.href),
    url(r'(?P<article_name>[\w-]+)', subpageView, name="subpage"),

]
