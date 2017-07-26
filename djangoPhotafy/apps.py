from django.apps import AppConfig


class djangoPhotafyConfig(AppConfig):
    name = 'djangoPhotafy'

class PageAppConfig(AppConfig):
    #This class serves as the base for other apps that will generate a link from the home page.
    def __init__(self, app_name, app_module):
        #Call super constructor:
        super(PageAppConfig, self).__init__(app_name, app_module)

        #Override these definitions for specific
        self.page_name = self.name          #Displayed Text
        self.href = self.name           #Url text of root page.
        self.icon_class = 'fa fa-question'  #Font-Awesome Icon of Page

        return
