# Generated by Django 2.2 on 2019-05-03 04:32

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0017_auto_20190501_1603'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 3, 14, 32, 33, 324869), verbose_name='Expiry Time'),
        ),
    ]
