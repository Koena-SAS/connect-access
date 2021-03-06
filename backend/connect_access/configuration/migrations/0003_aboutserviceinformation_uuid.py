# Generated by Django 3.1.10 on 2021-11-22 15:46

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ("configuration", "0002_auto_20211122_1613"),
    ]

    operations = [
        migrations.AddField(
            model_name="aboutserviceinformation",
            name="uuid",
            field=models.UUIDField(
                default=uuid.uuid4,
                editable=False,
                unique=True,
                verbose_name="Public identifier",
            ),
        ),
    ]
