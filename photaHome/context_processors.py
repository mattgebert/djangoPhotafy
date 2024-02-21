from photaHome.pageapps import get_pageapp_webitems
from djangoPhotafy.settings import LOCAL_CDN
page_apps = get_pageapp_webitems()

def menubar(request):
    """Context processor to generate pageapps, and their source links for a menubar."""
    return {
        'page_apps':get_pageapp_webitems,
        'HOME_ON':True,
        }
    
def local_remote_cdn(request):
    """Context processor to return a variable for local or remote CDNs"""
    return {
        'local_cdn': LOCAL_CDN,
    }