# Generated by Django 3.1.10 on 2021-08-19 10:14

from django.db import migrations, models
import koenaconnect.mediations.models


class Migration(migrations.Migration):

    dependencies = [
        ("mediations", "0022_auto_20210730_1720"),
    ]

    operations = [
        migrations.AlterField(
            model_name="mediationrequest",
            name="assistive_technology_used",
            field=koenaconnect.mediations.models.ChoiceArrayField(
                base_field=models.CharField(
                    blank=True,
                    choices=[
                        ("kb", "Keyboard"),
                        ("sv", "Screen reader with vocal synthesis"),
                        ("bd", "Braille display"),
                        ("zs", "Zoom software"),
                        ("vc", "Vocal command software"),
                        ("ds", "DYS Disorder software"),
                        ("vk", "Virtual keyboard"),
                        ("an", "Adapted navigation dispositive"),
                        ("ek", "Exclusive keyboard navigation"),
                        ("ot", "Other"),
                    ],
                    max_length=2,
                    verbose_name="Assistive technology used",
                ),
                default=list,
                size=None,
                verbose_name="Assistive technology used",
            ),
        ),
    ]
