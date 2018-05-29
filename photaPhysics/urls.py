from django.conf.urls import url
from photaPhysics import views,apps

app_name = apps.PhotaphysicsConfig.name #identifier for {% url %} html tag --> {% url 'polls:detail' question.id %}

urlpatterns = [
    url(r'^$', views.defaultView, name=apps.PhotaphysicsConfig.href),
]
