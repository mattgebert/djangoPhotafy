# Generated by Django 2.2 on 2019-05-03 06:59

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0038_auto_20190503_0656'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 3, 16, 59, 7, 474153), verbose_name='Expiry Time'),
        ),
    ]