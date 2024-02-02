from django.conf.urls import include
#from django.conf.urls import url
from django.urls import re_path as url
from django.views.generic.base import RedirectView

from photaHome import views

app_name = 'photaHome'

# Page Apps
from .settings import PAGE_APPS
from photaHome.pageapps import PageAppConfig, get_pageapp
# Add Page App Urls
page_urls = []
for app in PAGE_APPS:
    klass = get_pageapp(app)
    page_urls += [
        url(r'^'+klass.href, include(klass.name + ".urls"))
    ]

faviconView = RedirectView.as_view(url='static/photaHome/icon/mg_icon.png', permanent=True)

urlpatterns = [
    url(r'^$', views.homeView, name='home'),
    url(r'^favicon.ico', faviconView),
] + page_urls
