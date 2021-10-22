# Generated by Django 3.1.10 on 2021-09-20 16:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mediations", "0027_auto_20210831_0934"),
    ]

    operations = [
        migrations.AddField(
            model_name="tracereport",
            name="recipient_name",
            field=models.CharField(
                blank=True, max_length=255, verbose_name="Name of the recipient(s)"
            ),
        ),
        migrations.AddField(
            model_name="tracereport",
            name="recipient_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("cp", "Complainant"),
                    ("md", "Mediator"),
                    ("or", "Organization (partner)"),
                    ("eo", "External organization"),
                    ("ot", "Other"),
                ],
                max_length=2,
                verbose_name="Recipient type",
            ),
        ),
        migrations.AddField(
            model_name="tracereport",
            name="sender_name",
            field=models.CharField(
                blank=True, max_length=255, verbose_name="Name of the sender(s)"
            ),
        ),
        migrations.AddField(
            model_name="tracereport",
            name="sender_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("cp", "Complainant"),
                    ("md", "Mediator"),
                    ("or", "Organization (partner)"),
                    ("eo", "External organization"),
                    ("ot", "Other"),
                ],
                max_length=2,
                verbose_name="Sender type",
            ),
        ),
    ]
