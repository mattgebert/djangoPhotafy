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
