from django.db import models
import os.path
from djangoPhotafy.settings import BASE_DIR
from photaHome.settings import PAGE_APPS
from photaHome.pageapps import get_pageapp,  get_pageapp_classes
from datetime import date
from shutil import copyfile

pageapps = ()
for app in PAGE_APPS:
    pageappClass = get_pageapp(app)
    pageapps += ((pageappClass.name,pageappClass.page_name),)

# Create your models here.
class Subpagebubble(models.Model):
    "Links to create pages that are blog like, but are created for each file"

    href = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    template_path = models.CharField(max_length=200)#, unique=True)
    date_created = models.DateField(auto_now_add=True)
    date_modified = models.DateField(auto_now=True)

    STATUS_CHOICES = (
        ('d', 'Draft'),
        ('p', 'Published'),
        ('h', 'Hidden'),
    )

    status = models.CharField(max_length=1,choices=STATUS_CHOICES, default='d')

    pageapp = models.CharField(
        max_length=100,
        choices = pageapps,
    )

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super(Subpagebubble, self).__init__(*args, **kwargs)
        if user is not None:
            self.prefill_from_user(user)

    def __str__(self):
        return self.get_pageapp_display() + ":" + self.title

    def save(self, *args, **kwargs):
        #check that there this isn't already something created.
        if not self._state.adding:
            #Existing instance, skip
            pass
        else:
            href = self.href #cleaned_data.get('href')
            title = self.title #cleaned_data.get('title')
            description = self.description #cleaned_data.get('description')
            pageapp = self.pageapp #cleaned_data.get('pageapp')

            #If a new addition, generate new template path. Match pageapp class for pathing
            pageapp_classes = get_pageapp_classes()
            subpageClass = None
            #Match the selected pageape
            for klass in pageapp_classes:
                if klass.name == pageapp:
                    subpageClass = klass
            if subpageClass is None:
                raise forms.ValidationError("A Pageapp needs to be selected.")
            subpage_template_base = BASE_DIR + "/" + subpageClass.name + "/templates/"
            subpage_template_local = subpageClass.name + "/subpages/"
            subpage_template_path = subpage_template_base + subpage_template_local

            #Check for the existance of other subpages with same name
            if not os.path.isdir(subpage_template_path):
                os.mkdir(subpage_template_path)

            #Check for the existance of files for subpage:
            counter = 1
            if os.path.isdir(subpage_template_path + title):
                while os.path.isdir(subpage_template_path + title +'_'+ str(counter)):
                    counter+=1
                template_path = subpage_template_path + title +'_'+ str(counter)
            else:
                template_path = subpage_template_path + title

            #Setup new files and save paths
            self.template_path = subpage_template_local + title + '_' + str(counter)
            os.mkdir(template_path)
            print(template_path + " -- created.")

            #Create default template files
            copyfile(BASE_DIR + '/photaHome/templates/photaHome/subpage_template.html', template_path + '/content.html')

        #Save the updated model fields:
        super(Subpagebubble, self).save(*args, **kwargs)
        return

class Socialprofile(models.Model):
    """Object for a social media profile and it's link."""

    href = models.CharField(max_length=200)
    account_name = models.CharField(max_length=200)

    ARXIV =         "ax"
    FACEBOOK =      'fb'
    GITHUB =        'gh'
    GOOGLE =        'go'
    LINKEDIN =      "in"
    ORCID =         'or'
    SOUNDCLOUD =    'sc'
    REDDIT =        're'
    RESEARCHGATE =  "rg"
    STACKEXCHANGE = 'se'
    STACKOVERFLOW = "st"
    TWITTER =       'tw'
    YOUTUBE =       'yt'

    SOCIAL_PLATFORM_CHOICES = (
        ('Social Media', (
            (FACEBOOK, 'Facebook'),
            (GOOGLE, 'Google+'),
            (LINKEDIN, 'Linked In'),
            (TWITTER, 'Twitter'),
        )),
        ('Content Creation',(
            (GITHUB, 'Github'),
            (SOUNDCLOUD, 'Soundcloud'),
            (YOUTUBE, 'Youtube'),
        )),
        ('Academic', (
            (ORCID, "ORCID"),
            (RESEARCHGATE, "Research Gate"),
        )),
        ('Forums',(
            (STACKOVERFLOW, 'Stack Overflow'),
            (STACKEXCHANGE, 'Stack Exchange'),
            (REDDIT, 'Reddit')
        )),
    )

    SOCIAL_PLATFORM_ICONS = {
        FACEBOOK:       'fab fa-facebook',
        GITHUB:         'fab fa-github',
        GOOGLE:         'fab fa-google',
        LINKEDIN:       'fab fa-linkedin',
        YOUTUBE:        'fab fa-youtube',
        SOUNDCLOUD:     'fab fa-soundcloud',
        ORCID:          'fab fa-orcid',
        REDDIT:         'fab fa-reddit',
        RESEARCHGATE:   'fab fa-researchgate',
        STACKOVERFLOW:  'fab fa-stack-overflow',
        STACKEXCHANGE:  'fab fa-stack-exchange',
        TWITTER:        'fab fa-twitter',
    }

    platform = models.CharField(
        max_length=2,
        choices=SOCIAL_PLATFORM_CHOICES,
        default=GOOGLE,
    )

    def __str__(self):
        return self.get_platform_display() + ": " + self.account_name

    def get_fa_icon(self):
        return self.SOCIAL_PLATFORM_ICONS[self.platform]
