import factory
import faker
from django.core.files.uploadedfile import SimpleUploadedFile
from factory import Faker
from factory.django import DjangoModelFactory

from connect_access.apps.mediations.tests.factories import MediationRequestFactory
from connect_access.core.loading import get_model

from ..choices import ContactEntityType, TraceType


class TraceReportFactory(DjangoModelFactory):
    """Creates a trace report object.

    All fields are created, including attached_file with a real file
    in the filesystem.

    """

    mediation_request = factory.SubFactory(MediationRequestFactory)
    trace_type = Faker("random_element", elements=TraceType.values)
    sender_type = Faker("random_element", elements=ContactEntityType.values)
    sender_name = Faker("name")
    recipient_type = Faker("random_element", elements=ContactEntityType.values)
    recipient_name = Faker("name")
    comment = Faker("paragraph")
    attached_file = SimpleUploadedFile(
        faker.Faker().file_name(),
        b"file content",
        content_type="multipart/form-data",
    )

    class Meta:
        model = get_model("mediations", "TraceReport")
