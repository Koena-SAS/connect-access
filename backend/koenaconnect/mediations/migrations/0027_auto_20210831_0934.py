# Generated by Django 3.1.10 on 2021-08-31 07:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mediations", "0026_auto_20210823_1725"),
    ]

    operations = [
        migrations.AlterField(
            model_name="tracereport",
            name="trace_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("ca", "Call"),
                    ("ma", "E-mail"),
                    ("le", "Letter"),
                    ("ot", "Other"),
                ],
                max_length=2,
                verbose_name="The contact type",
            ),
        ),
    ]
