# Generated by Django 3.1.8 on 2021-04-20 14:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("mediations", "0005_auto_20210401_0929"),
    ]

    operations = [
        migrations.AddField(
            model_name="mediationrequest",
            name="issue_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("ay", "Accessibility issue"),
                    ("ug", "Understanding issue, i.e. needs easy-to-read"),
                    ("uy", "Usability issue"),
                ],
                max_length=2,
                verbose_name="Issue type",
            ),
        ),
        migrations.AlterField(
            model_name="mediationrequest",
            name="complainant",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to=settings.AUTH_USER_MODEL,
                verbose_name="User who submitted this request",
            ),
        ),
    ]
