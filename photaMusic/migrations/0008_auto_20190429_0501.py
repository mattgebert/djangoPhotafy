# Generated by Django 2.1.3 on 2019-04-29 05:01

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('photaMusic', '0007_auto_20190426_1628'),
    ]

    operations = [
        migrations.CreateModel(
            name='photaAudioFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filename', models.CharField(max_length=200)),
                ('file', models.FileField(upload_to='photaMusic/static/photaMusic/photaTracks/')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='publicAudioFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filename', models.CharField(max_length=200)),
                ('file', models.FileField(upload_to='photaMusic/static/photaMusic/publicTracks/')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.DeleteModel(
            name='audioFile',
        ),
        migrations.AlterField(
            model_name='photatrack',
            name='date_recorded',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Date Recorded'),
        ),
        migrations.AlterField(
            model_name='photatrack',
            name='file_audio',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='photaMusic.photaAudioFile'),
        ),
        migrations.AlterField(
            model_name='publictrack',
            name='date_recorded',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Date Recorded'),
        ),
        migrations.AlterField(
            model_name='publictrack',
            name='expiry',
            field=models.DateTimeField(default=datetime.datetime(2019, 4, 29, 15, 1, 53, 110010), verbose_name='Expiry Time'),
        ),
        migrations.AlterField(
            model_name='publictrack',
            name='file_audio',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='photaMusic.publicAudioFile'),
        ),
    ]
