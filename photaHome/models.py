from django.db import models

# Create your models here.
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
        GOOGLE: 'fa fa-google',
        FACEBOOK: 'fa fa-facebook',
        TWITTER: 'fa fa-twitter',
        LINKEDIN: 'fa fa-linkedin',
        YOUTUBE: 'fa fa-youtube',
        SOUNDCLOUD: 'fa fa-soundcloud',
        GITHUB: 'fa fa-github',
        STACKOVERFLOW: 'fa fa-stackoverflow',
        STACKEXCHANGE: 'fa fa-stackexchange',
        REDDIT: 'fa fa-reddit'
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
