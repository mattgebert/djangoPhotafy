from django.conf.urls import url, include
from photaHome import views

app_name = 'photaHome'

# Page Apps
from djangoPhotafy.settings import PAGE_APPS
from photaHome.pageapps import PageAppConfig, get_page_app, get_page_urls

# Add Page App Urls
page_urls = []
for app in PAGE_APPS:
    klass = get_page_app(app)
    page_urls += [
        url(r'^'+klass.href, include(klass.name + ".urls"))
    ]

urlpatterns = [
    url(r'^$', views.homeView, name='homeView'),
] + page_urls
