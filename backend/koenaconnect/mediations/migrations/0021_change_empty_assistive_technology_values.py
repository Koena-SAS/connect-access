from django.db import migrations, models

import koenaconnect.mediations.models


def change_empty_assistive_technologies(apps, schema_editor):
    MediationRequest = apps.get_model("mediations", "MediationRequest")
    for row in MediationRequest.objects.all():
        # we are converting from a charfield of 2 chars to an postgres arrayfield
        # and postgres arrayfields have internally the format '{"aa", "bb", etc..}'
        if row.assistive_technology_used == "":
            row.assistive_technology_used = "{}"
            row.save(update_fields=["assistive_technology_used"])
        else:
            row.assistive_technology_used = "{" + row.assistive_technology_used + "}"
            row.save(update_fields=["assistive_technology_used"])


class Migration(migrations.Migration):

    dependencies = [
        ("mediations", "0020_auto_20210706_1655"),
    ]

    operations = [
        migrations.AlterField(
            model_name="mediationrequest",
            name="assistive_technology_used",
            field=models.CharField(
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
                max_length=6,
                verbose_name="Assistive technology used",
            ),
        ),
        migrations.RunPython(
            change_empty_assistive_technologies, reverse_code=migrations.RunPython.noop
        ),
    ]
