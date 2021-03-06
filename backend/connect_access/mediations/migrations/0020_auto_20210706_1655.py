# Generated by Django 3.1.10 on 2021-07-06 14:55

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("mediations", "0019_mediationrequest_request_date"),
    ]

    operations = [
        migrations.AlterField(
            model_name="mediationrequest",
            name="request_date",
            field=models.DateTimeField(
                default=django.utils.timezone.now, verbose_name="Date of the request"
            ),
        ),
    ]
