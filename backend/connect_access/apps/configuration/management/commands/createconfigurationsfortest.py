from django.core.management.base import BaseCommand, CommandError

from connect_access.core.loading import get_model

AboutServiceInformation = get_model("configuration", "AboutServiceInformation")
ContactInformation = get_model("configuration", "ContactInformation")


class Command(BaseCommand):
    help = "Creates a set of test configuration objects."

    def handle(self, *args, **options):
        try:
            if (
                len(ContactInformation.objects.all()) != 0
                or len(AboutServiceInformation.objects.all()) != 0
            ):
                raise Exception(
                    "The database should be empty to apply createconfigurationsfortest command.\n"
                    f"Here we have {len(ContactInformation.objects.all())} contact information objects "
                    f"and {len(AboutServiceInformation.objects.all())} about service objects."
                )
            ContactInformation.objects.create(
                email_en="mediation@example.com",
                email_text_en="mediation@example.com",
                phone_number_en="+339726321",
                phone_number_text_en="+33 (0)9 72 63 21",
                website_en="https://koena.net/",
                website_text_en="koena.net",
                terms_of_service_en="""## Terms of service title
Terms of service content""",
            )
            AboutServiceInformation.objects.create(
                display_order=1,
                link_text_en={"fr": "À propos de nous", "en": "About us"},
                link_url_en={"fr": "/terms-of-service", "en": "/terms-of-service"},
            )
            AboutServiceInformation.objects.create(
                display_order=2,
                link_text_en={"fr": "Mentions légales", "en": "Legal information"},
                link_url_en={
                    "fr": "https://koena.net/mentions-legales/",
                    "en": "https://koena.net/en/legal-information-and-credits/",
                },
            )
        except Exception as e:
            raise CommandError('Exception "%s"' % e)
