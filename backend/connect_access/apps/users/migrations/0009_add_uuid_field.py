# the 3 following migrations are following this documentation to add uuid field
# https://docs.djangoproject.com/en/dev/howto/writing-migrations/#migrations-that-add-unique-fields

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0008_auto_20210430_0948"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="uuid",
            field=models.UUIDField(default=uuid.uuid4, editable=False, null=True),
        ),
    ]
