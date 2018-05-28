from photaHome.pageapps import get_pageapp_webitems
page_apps = get_pageapp_webitems()

def menubar(request):
    return {'page_apps':get_pageapp_webitems,
            'HOME_ON':True,
            }
