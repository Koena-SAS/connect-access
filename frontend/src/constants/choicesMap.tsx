import { t } from "@lingui/macro";
import type {
  AssistiveTechnology,
  Browser,
  InaccessibilityLevel,
  MobileAppPlatform,
  Status,
  Urgency,
} from "../types/mediationRequest";
import type { ContactEntityType, TraceType } from "../types/traceReport";
import type { YesNo } from "../types/types";

// This one is translated right here to be able to access the translated values
// and manipulate them in the javascript code for sorting purposes.
export const assistiveTechnologyMap: Record<
  AssistiveTechnology,
  { en: string; fr: string }
> = {
  KEYBOARD: { en: "Keyboard", fr: "Clavier" },
  SCREEN_READER_VOCAL_SYNTHESIS: {
    en: "Screen reader with vocal synthesis",
    fr: "Lecteur d'écran avec synthèse vocale",
  },
  BRAILLE_DISPLAY: { en: "Braille display", fr: "Plage braille" },
  ZOOM_SOFTWARE: { en: "Zoom software", fr: "Logiciel d'agrandissement" },
  VOCAL_COMMAND_SOFTWARE: {
    en: "Vocal command software",
    fr: "Logiciel de commande vocale",
  },
  DYS_DISORDER_SOFTWARE: {
    en: "DYS Disorder software",
    fr: "Logiciel pour troubles DYS",
  },
  VIRTUAL_KEYBOARD: { en: "Virtual keyboard", fr: "Clavier virtuel" },
  ADAPTED_NAVIGATION_DISPOSITIVE: {
    en: "Adapted navigation dispositive",
    fr: "Dispositif de navigation adaptée (boule de commande, clavier adapté, licorne, navigation par les yeux…)",
  },
  EXCLUSIVE_KEYBOARD_NAVIGATION: {
    en: "Exclusive keyboard navigation",
    fr: "Navigation clavier exclusive",
  },
  OTHER: { en: "Other", fr: "Autre" },
} as const;

export const urgencyLevelMap: Record<Urgency, string> = {
  VERY_URGENT: t`Yes, very urgent: need a quick answer`,
  MODERATELY_URGENT: t`Moderately, I can wait, but not too long`,
  NOT_URGENT: t`Not urgent at all, but would like a solution as soon as possible`,
} as const;

export const browserMap: Record<Browser, string> = {
  FIREFOX: t`Firefox`,
  CHROME: t`Chrome`,
  INTERNET_EXPLORER: t`Internet Explorer`,
  MICROSOFT_EDGE: t`Microsoft Edge`,
  OTHER: t`Other`,
  DONT_KNOW: t`Don't Know`,
} as const;

export const mobileAppPlatformMap: Record<MobileAppPlatform, string> = {
  IOS: t`iOS`,
  ANDROID: t`Android`,
  WINDOWS_PHONE: t`Windows phone`,
  OTHER: t`Other`,
} as const;

export const inaccessibilityLevelMap: Record<InaccessibilityLevel, string> = {
  IMPOSSIBLE_ACCESS: t`Impossible access`,
  ACCESS_DIFFICULT: t`Access possible by bypass but difficult`,
  RANDOM_ACCESS: t`Random access, sometimes it works and sometimes it does not`,
} as const;

export const booleanMap: Record<YesNo, string> = {
  YES: t`Yes`,
  NO: t`No`,
} as const;

export const statusMap: Record<Status, string> = {
  PENDING: t`Incomplete`,
  WAITING_MEDIATOR_VALIDATION: t`Waiting for mediator validation`,
  FILED: t`Request filed`,
  WAITING_ADMIN: t`Waiting for administrative validation`,
  WAITING_CONTACT: t`Waiting for contact`,
  WAITING_CONTACT_BIS: t`Waiting for second contact`,
  MEDIATING: t`Mediating`,
  CLOTURED: t`Closed`,
  MEDIATION_FAILED: t`Mediation failed`,
} as const;

export const traceTypeMap: Record<TraceType, string> = {
  CALL: t`Call`,
  MAIL: t`E-mail`,
  LETTER: t`Letter`,
  OTHER: t`Other`,
} as const;

export const contactEntityTypeMap: Record<ContactEntityType, string> = {
  COMPLAINANT: t`Complainant`,
  MEDIATOR: t`Mediator`,
  ORGANIZATION: t`Organization (partner)`,
  EXTERNAL_ORGANIZATION: t`External organization`,
  OTHER: t`Other`,
} as const;
