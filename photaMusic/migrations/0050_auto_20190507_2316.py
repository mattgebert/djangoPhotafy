# Generated by Django 2.2 on 2019-05-07 23:16

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0049_auto_20190507_2312'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 8, 9, 16, 33, 845725), verbose_name='Expiry Time'),
        ),
    ]
