# Generated by Django 3.1.8 on 2021-04-21 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mediations", "0009_auto_20210421_0926"),
    ]

    operations = [
        migrations.AddField(
            model_name="mediationrequest",
            name="mobile_app_name",
            field=models.CharField(
                blank=True, max_length=255, verbose_name="The used mobile app name"
            ),
        ),
        migrations.AddField(
            model_name="mediationrequest",
            name="mobile_app_platform",
            field=models.CharField(
                blank=True,
                choices=[
                    ("is", "iOS"),
                    ("ad", "Chrome"),
                    ("wp", "Windows phone"),
                    ("ot", "Other"),
                ],
                max_length=2,
                verbose_name="The used mobile app platform",
            ),
        ),
        migrations.AddField(
            model_name="mediationrequest",
            name="mobile_app_used",
            field=models.BooleanField(
                null=True,
                verbose_name="Whether the problem occured while using a mobile app",
            ),
        ),
        migrations.AddField(
            model_name="mediationrequest",
            name="other_used_software",
            field=models.CharField(
                blank=True,
                max_length=255,
                verbose_name="Other software, connected object etc. used to navigate",
            ),
        ),
        migrations.AlterField(
            model_name="mediationrequest",
            name="urgency",
            field=models.CharField(
                blank=True,
                choices=[
                    ("vu", "Yes, very urgent: need a quick answer"),
                    ("mu", "Moderately, I can wait, but not too long"),
                    (
                        "nu",
                        "Not urgent at all, but would like a solution as soon as possible",
                    ),
                ],
                max_length=2,
                verbose_name="Whether the request is urgent or not",
            ),
        ),
    ]
