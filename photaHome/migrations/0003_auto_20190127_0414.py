# Generated by Django 2.1.3 on 2019-01-27 04:14

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('photaHome', '0002_subpagebubble'),
    ]

    operations = [
        migrations.RenameField(
            model_name='subpagebubble',
            old_name='templatePath',
            new_name='template_path',
        ),
        migrations.AddField(
            model_name='subpagebubble',
            name='date_created',
            field=models.DateField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='subpagebubble',
            name='date_modified',
            field=models.DateField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='subpagebubble',
            name='pageapp',
            field=models.CharField(choices=[('photaChristianity', 'Christian'), ('photaPhysics', 'Physicist')], max_length=100),
        ),
    ]
