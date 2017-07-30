from django.db import models

# Create your models here.

# example:
# class Item(models.Model):
#
#     MEDIA_CHOICES = (
#         ('Audio', (
#                 ('vinyl', 'Vinyl'),
#                 ('cd', 'CD'),
#             )
#         ),
#         ('Video', (
#                 ('vhs', 'VHS Tape'),
#                 ('dvd', 'DVD'),
#             )
#         ),
#         ('unknown', 'Unknown'),
#     )
#
#     media = models.CharField(
#         max_length=10,
#         choices=MEDIA_CHOICES,
#         default='vinyl',
#     )


    # set_name = models.CharField(max_length=200)
    #
    #
    #
    # # def filepath(self):
    #     # return STATIC_URL + '/amy/img/' + self.set_name + '_images/'
    #
    #
    # image_set =      models.ForeignKey(ImageSet, on_delete=models.CASCADE)
    # # image = models.ImageField(upload_to=ImageSet.filepath, max_length=200)
    # img =           models.ImageField(upload_to="amy/static/amy/image_sets/", max_length=200)
    # name =          models.CharField(max_length=200)
    # description =   models.CharField(max_length=200)
    #
    # def __str__(self):
    #     return self.name + ": '" + self.description + "'"
