from django.apps import AppConfig

class PageAppConfig(AppConfig):
    """This class serves as the base for other apps that will generate a link from the home page."""

    def __init__(self, app_name, app_module):
        #Call super constructor:
        super(PageAppConfig, self).__init__(app_name, app_module)

        #Override these definitions for specific
        self.page_name = self.name          #Displayed Text for links.
        self.href = self.name               #Url text of root page.
        self.icon_class = 'fa fa-question'  #Font-Awesome Icon of Page

        return

    #   Shows a printout of the important properties of a PageAppConfig
    def __str__(self):
        return "Properties:\n\tPage Name:\t"+self.page_name+"\tPage Url:\t"+self.href+"\tIcon Class:\t"+self.icon_class


def get_page_app(app):
    """Checks If The App Text Extends PageAppConfig"""
    try:
        #Check <Name>Config class exists and is PageAppConfig type.
        app_path = app.split('.')
        if len(app_path) > 1:
            module_path = app_path[0]
            for i in range(1,len(app_path)-1):
                module_path += '.' + app_path[i]
            mod = __import__(module_path, fromlist=[app_path[-1]])
            klass = getattr(mod, app_path[-1])
            if issubclass(klass, PageAppConfig):
                return klass
        else:
            return None
    except ImportError as err:
        print("Error importing",app,"...")
        raise
    except Exception as err:
        print("Execption found with", app)
        raise

def get_page_urls(app):
    """Returns the urls  """
    klass = get_page_app(app)
    return
