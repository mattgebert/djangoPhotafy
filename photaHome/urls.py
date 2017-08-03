from django.conf.urls import url, include
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

urlpatterns = [
    url(r'^$', views.homeView, name='homeView'),
] + page_urls
