# Generated by Django 2.2 on 2019-05-03 05:07

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0029_auto_20190503_0507'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 3, 15, 7, 41, 313613), verbose_name='Expiry Time'),
        ),
    ]
