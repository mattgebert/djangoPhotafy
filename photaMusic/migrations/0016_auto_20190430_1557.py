# Generated by Django 2.2 on 2019-04-30 15:57

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0015_auto_20190430_1557'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 1, 1, 57, 57, 640961), verbose_name='Expiry Time'),
        ),
    ]