# Generated by Django 2.2 on 2019-05-09 07:14

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0052_auto_20190508_0410'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 9, 17, 14, 31, 991734), verbose_name='Expiry Time'),
        ),
    ]
