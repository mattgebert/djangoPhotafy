# Generated by Django 2.1.3 on 2019-04-22 13:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('photaHome', '0005_subpagebubble_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subpagebubble',
            name='pageapp',
            field=models.CharField(choices=[('photaChristianity', 'Christian'), ('photaPhysics', 'Physicist'), ('photaMusic', 'Musician')], max_length=100),
        ),
    ]
