# Generated by Django 3.1.14 on 2022-03-01 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("configuration", "0010_auto_20220216_1617"),
    ]

    operations = [
        migrations.AlterField(
            model_name="contactinformation",
            name="terms_of_service_en",
            field=models.TextField(
                blank=True, verbose_name="Terms of service. Please use Markdown format."
            ),
        ),
        migrations.AlterField(
            model_name="contactinformation",
            name="terms_of_service_fr",
            field=models.TextField(
                blank=True, verbose_name="Terms of service. Please use Markdown format."
            ),
        ),
    ]
