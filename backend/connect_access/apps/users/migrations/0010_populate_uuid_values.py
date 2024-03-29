# Generated by Django 3.1.10 on 2021-05-31 10:03

import uuid

from django.db import migrations


def gen_uuid(apps, schema_editor):
    User = apps.get_model("users", "User")
    for row in User.objects.all():
        row.uuid = uuid.uuid4()
        row.save(update_fields=["uuid"])


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0009_add_uuid_field"),
    ]

    operations = [
        migrations.RunPython(gen_uuid, reverse_code=migrations.RunPython.noop),
    ]
