# Generated by Django 2.2 on 2019-05-03 05:01

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0026_auto_20190503_0457'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 3, 15, 1, 28, 235137), verbose_name='Expiry Time'),
        ),
    ]