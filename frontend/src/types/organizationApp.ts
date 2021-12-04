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
  buttonHover_color: string;
  stepColor: string;
  footerColor: string;
};

export type { OrganizationApp };
