import React from "react";
import type { ContactInformation } from "../types/footerConfiguration";

const ContactInformationContext = React.createContext<ContactInformation>({
  email: {
    fr: "",
    en: "",
  },
  emailText: {
    fr: "",
    en: "",
  },
  phoneNumber: {
    fr: "",
    en: "",
  },
  phoneNumberText: {
    fr: "",
    en: "",
  },
  website: {
    fr: "",
    en: "",
  },
  websiteText: {
    fr: "",
    en: "",
  },
  termsOfService: {
    fr: "",
    en: "",
  },
});

export default ContactInformationContext;
