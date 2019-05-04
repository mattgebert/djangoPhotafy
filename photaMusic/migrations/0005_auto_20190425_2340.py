# Generated by Django 2.1.3 on 2019-04-25 23:40

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0004_auto_20190422_2355'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='photatrack',
            name='expiry',
        ),
        migrations.AlterField(
            model_name='photatrack',
            name='date_recorded',
            field=models.DateTimeField(verbose_name='Date Recorded'),
        ),
        migrations.AlterField(
            model_name='publictrack',
            name='date_recorded',
            field=models.DateTimeField(verbose_name='Date Recorded'),
        ),
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 4, 26, 9, 40, 25, 570633), verbose_name='Expiry Time'),
        ),
    ]
