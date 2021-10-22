from templated_mail.mail import BaseEmailMessage


class PasswordChangedConfirmationEmail(BaseEmailMessage):
    template_name = "users/emails/password_changed_confirmation.html"
