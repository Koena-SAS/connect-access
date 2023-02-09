from django.core.management.base import CommandError

from connect_access.core.loading import get_model
from connect_access.core.management.commands import BaseCommand

AboutServiceInformation = get_model("configuration", "AboutServiceInformation")
ContactInformation = get_model("configuration", "ContactInformation")


class Command(BaseCommand):
    help = "Creates a set of test configuration objects."

    @staticmethod
    def _check_requirements():
        if (
            len(ContactInformation.objects.all()) != 0
            or len(AboutServiceInformation.objects.all()) != 0
        ):
            raise Exception(
                "The database should be empty to apply createconfigurationsfortest command.\n"
                f"Here we have {len(ContactInformation.objects.all())} contact information objects "
                f"and {len(AboutServiceInformation.objects.all())} about service objects."
            )

    def handle(self, *args, **options):
        try:
            self._check_requirements()

            ContactInformation.objects.create(
                email_en="mediation@example.com",
                email_text_en="mediation@example.com",
                email_fr="mediation@example.com",
                email_text_fr="mediation@example.com",
                phone_number_fr="09726321",
                phone_number_text_fr="09 72 63 21",
                phone_number_en="+339726321",
                phone_number_text_en="+33 (0)9 72 63 21",
                website_en="https://koena.net/",
                website_fr="https://koena.net/",
                website_text_en="koena.net",
                website_text_fr="koena.net",
                terms_of_service_en="""## Terms of service title
                Terms of service content""",
                terms_of_service_fr="""## Conditions d'utilisation
                Les conditions d'utilisation
                """,
            )
            AboutServiceInformation.objects.create(
                display_order=1,
                link_text_en="About us",
                link_text_fr="À propos de nous",
                link_url_en="/terms-of-service",
                link_url_fr="/terms-of-service",
            )
            AboutServiceInformation.objects.create(
                display_order=2,
                link_text_en="Legal information",
                link_text_fr="Mentions légales",
                link_url_en="https://koena.net/en/legal-information-and-credits/",
                link_url_fr="https://koena.net/mentions-legales/",
            )
        except Exception as e:
            raise CommandError('Exception "%s"' % e)
