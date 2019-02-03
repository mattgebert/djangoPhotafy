from django.db import models
import os.path
from djangoPhotafy.settings import BASE_DIR
from photaHome.settings import PAGE_APPS
from photaHome.pageapps import get_pageapp
from datetime import date

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

    def save(self):
        
        return

class Socialprofile(models.Model):
    """Object for a social media profile and it's link."""

    href = models.CharField(max_length=200)
    account_name = models.CharField(max_length=200)

    GOOGLE = 'go'
    FACEBOOK = 'fb'
    TWITTER = 'tw'
    YOUTUBE = 'yt'
    LINKEDIN = "in"
    STACKOVERFLOW = "st"
    STACKEXCHANGE = 'se'
    SOUNDCLOUD = 'sc'
    GITHUB = 'gh'
    REDDIT = 're'

    SOCIAL_PLATFORM_CHOICES = (
        ('Social Media', (
            (GOOGLE, 'Google+'),
            (FACEBOOK, 'Facebook'),
            (TWITTER, 'Twitter'),
            (LINKEDIN, 'Linked In'),
        )),
        ('Content Creation',(
            (YOUTUBE, 'Youtube'),
            (SOUNDCLOUD, 'Soundcloud'),
            (GITHUB, 'Github'),
        )),
        ('Forums',(
            (STACKOVERFLOW, 'Stack Overflow'),
            (STACKEXCHANGE, 'Stack Exchange'),
            (REDDIT, 'Reddit')
        )),
    )

    SOCIAL_PLATFORM_ICONS = {
        GOOGLE: 'fab fa-google',
        FACEBOOK: 'fab fa-facebook',
        TWITTER: 'fab fa-twitter',
        LINKEDIN: 'fab fa-linkedin',
        YOUTUBE: 'fab fa-youtube',
        SOUNDCLOUD: 'fab fa-soundcloud',
        GITHUB: 'fab fa-github',
        STACKOVERFLOW: 'fab fa-stack-overflow',
        STACKEXCHANGE: 'fab fa-stack-exchange',
        REDDIT: 'fab fa-reddit'
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
