# Generated by Django 2.2 on 2019-05-07 22:32

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0046_auto_20190507_1606'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 5, 8, 8, 32, 49, 633108), verbose_name='Expiry Time'),
        ),
    ]
