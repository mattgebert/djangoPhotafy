# Generated by Django 2.2 on 2019-05-03 06:07

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0034_auto_20190503_0605'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 3, 16, 7, 48, 31897), verbose_name='Expiry Time'),
        ),
    ]
