type OrganizationApp = {
  id: string;
  name: { en: string; fr: string };
  slug: string;
  logo: string;
  logoAlternative: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
  textColor: string;
  buttonBackground_color: string;
  borderColor: string;
  buttonHoverColor: string;
  stepColor: string;
  footerColor: string;
};

type OrganizationAppRecieved = {
  id: string;
  name: { en: string; fr: string };
  slug: string;
  logo: string;
  logo_alternative: {
    en: string;
    fr: string;
  };
  description: {
    en: string;
    fr: string;
  };
  text_color: string;
  button_background_color: string;
  border_color: string;
  button_hover_color: string;
  step_color: string;
  footer_color: string;
};

type ApplicationData = {
  id: string;
  name: string;
  organizationName: string;
  organizationEmail: string;
  organizationPhoneNumber: string;
  organizationAddress: string;
};

type ApplicationDataRecieved = {
  id: string;
  name: string;
  organization_name: string;
  organization_email: string;
  organization_phone_number: string;
  organization_address: string;
};

export type {
  OrganizationApp,
  ApplicationData,
  OrganizationAppRecieved,
  ApplicationDataRecieved,
};
