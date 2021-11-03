# the 3 following migrations are following this documentation to add uuid field
# https://docs.djangoproject.com/en/dev/howto/writing-migrations/#migrations-that-add-unique-fields

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mediations", "0013_merge_20210430_1652"),
    ]

    operations = [
        migrations.AddField(
            model_name="mediationrequest",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, editable=False, null=True),
        ),
    ]
