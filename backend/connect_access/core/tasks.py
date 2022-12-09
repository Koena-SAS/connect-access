from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template


def send_multialternative_mail(context, subject, to, content_filename):
    text_content = get_template(f"{content_filename}.txt").render(context)
    html_content = get_template(f"{content_filename}.html").render(context)
    msg = EmailMultiAlternatives(subject, text_content, None, to)
    msg.attach_alternative(html_content, "text/html")
    msg.send()
