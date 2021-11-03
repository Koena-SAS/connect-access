import factory
import faker
from django.core.files.uploadedfile import SimpleUploadedFile
from factory import Faker
from factory.django import DjangoModelFactory

from connect_access.mediations.models import (
    AssistiveTechnology,
    Browser,
    ContactEntityType,
    InaccessibilityLevel,
    MediationRequest,
    MediationRequestStatus,
    MobileAppPlatform,
    TraceReport,
    TraceType,
    UrgencyLevel,
)
from connect_access.users.tests.factories import UserFactory


class MediationRequestFactory(DjangoModelFactory):
    """Creates a mediation request object.

    All fields are created, including attached_file with a real file
    in the filesystem.

    """

    complainant = factory.SubFactory(UserFactory)
    status = Faker("random_element", elements=MediationRequestStatus.values)
    first_name = Faker("first_name")
    last_name = Faker("last_name")
    email = Faker("email")
    phone_number = Faker("msisdn")
    assistive_technology_used = Faker(
        "random_elements", elements=AssistiveTechnology.values, unique=True
    )
    technology_name = Faker("android_platform_token")
    technology_version = Faker("android_platform_token")
    urgency = Faker("random_element", elements=UrgencyLevel.values)
    issue_description = Faker("paragraph")
    step_description = Faker("paragraph")
    inaccessibility_level = Faker(
        "random_element", elements=InaccessibilityLevel.values
    )
    browser_used = Faker("boolean")
    url = Faker("url")
    browser = Faker("random_element", elements=Browser.values)
    browser_version = Faker("android_platform_token")
    mobile_app_used = Faker("boolean")
    mobile_app_platform = Faker("random_element", elements=MobileAppPlatform.values)
    mobile_app_name = Faker("android_platform_token")
    other_used_software = Faker("android_platform_token")
    did_tell_organization = Faker("boolean")
    did_organization_reply = Faker("boolean")
    organization_reply = Faker("paragraph")
    further_info = Faker("paragraph")
    attached_file = SimpleUploadedFile(
        faker.Faker().file_name(),
        b"file content",
        content_type="multipart/form-data",
    )
    organization_name = Faker("company")
    organization_address = Faker("address")
    organization_email = Faker("email")
    organization_phone_number = Faker("msisdn")
    organization_contact = Faker("name")

    class Meta:
        model = MediationRequest


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
        model = TraceReport
