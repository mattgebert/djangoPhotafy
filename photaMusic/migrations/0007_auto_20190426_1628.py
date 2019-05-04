# Generated by Django 2.1.3 on 2019-04-26 16:28

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0006_auto_20190426_0355'),
    ]

    operations = [
        migrations.CreateModel(
            name='audioFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='')),
            ],
        ),
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 4, 27, 2, 28, 13, 460947), verbose_name='Expiry Time'),
        ),
    ]
