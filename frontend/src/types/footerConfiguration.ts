type AboutService = {
  id: string;
  displayOrder: number;
  linkText: {
    fr: string;
    en: string;
  };
  linkUrl: {
    fr: string;
    en: string;
  };
};

type AboutServiceRecieved = {
  id: string;
  display_order: number;
  link_text: {
    fr: string;
    en: string;
  };
  link_url: {
    fr: string;
    en: string;
  };
};

type ContactInformation = {
  email?: {
    fr: string;
    en: string;
  };
  emailText?: {
    fr: string;
    en: string;
  };
  phoneNumber?: {
    fr: string;
    en: string;
  };
  phoneNumberText?: {
    fr: string;
    en: string;
  };
  website?: {
    fr: string;
    en: string;
  };
  websiteText?: {
    fr: string;
    en: string;
  };
  termsOfService?: {
    fr: string;
    en: string;
  };
};

type ContactInformationRecieved = {
  email?: {
    fr: string;
    en: string;
  };
  email_text?: {
    fr: string;
    en: string;
  };
  phone_number?: {
    fr: string;
    en: string;
  };
  phone_number_text?: {
    fr: string;
    en: string;
  };
  website?: {
    fr: string;
    en: string;
  };
  website_text?: {
    fr: string;
    en: string;
  };
};

export type {
  AboutService,
  AboutServiceRecieved,
  ContactInformation,
  ContactInformationRecieved,
};
