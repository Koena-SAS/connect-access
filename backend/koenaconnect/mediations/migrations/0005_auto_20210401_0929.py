# Generated by Django 3.0.11 on 2021-04-01 09:29

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mediations", "0004_auto_20210331_1745"),
    ]

    operations = [
        migrations.AlterField(
            model_name="mediationrequest",
            name="url",
            field=models.CharField(
                blank=True,
                max_length=200,
                validators=[
                    django.core.validators.RegexValidator(
                        message="Domain name must be at list in the form domain.extension",
                        regex="^(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$",
                    )
                ],
                verbose_name="URL address where the problem was encountered",
            ),
        ),
    ]
