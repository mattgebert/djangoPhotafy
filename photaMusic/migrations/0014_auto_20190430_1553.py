# Generated by Django 2.2 on 2019-04-30 15:53

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0013_auto_20190429_0732'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 1, 1, 53, 34, 223343), verbose_name='Expiry Time'),
        ),
    ]
