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

export const assistiveTechnologyMap: Record<AssistiveTechnology, string> = {
  KEYBOARD: t`Keyboard`,
  SCREEN_READER_VOCAL_SYNTHESIS: t`Screen reader with vocal synthesis`,
  BRAILLE_DISPLAY: t`Braille display`,
  ZOOM_SOFTWARE: t`Zoom software`,
  VOCAL_COMMAND_SOFTWARE: t`Vocal command software`,
  DYS_DISORDER_SOFTWARE: t`DYS Disorder software`,
  VIRTUAL_KEYBOARD: t`Virtual keyboard`,
  ADAPTED_NAVIGATION_DISPOSITIVE: t`Adapted navigation dispositive`,
  EXCLUSIVE_KEYBOARD_NAVIGATION: t`Exclusive keyboard navigation`,
  OTHER: t`Other`,
};

export const urgencyLevelMap: Record<Urgency, string> = {
  VERY_URGENT: t`Yes, very urgent: need a quick answer`,
  MODERATELY_URGENT: t`Moderately, I can wait, but not too long`,
  NOT_URGENT: t`Not urgent at all, but would like a solution as soon as possible`,
};

export const browserMap: Record<Browser, string> = {
  FIREFOX: t`Firefox`,
  CHROME: t`Chrome`,
  INTERNET_EXPLORER: t`Internet Explorer`,
  MICROSOFT_EDGE: t`Microsoft Edge`,
  OTHER: t`Other`,
  DONT_KNOW: t`Don't Know`,
};

export const mobileAppPlatformMap: Record<MobileAppPlatform, string> = {
  IOS: t`iOS`,
  ANDROID: t`Android`,
  WINDOWS_PHONE: t`Windows phone`,
  OTHER: t`Other`,
};

export const inaccessibilityLevelMap: Record<InaccessibilityLevel, string> = {
  IMPOSSIBLE_ACCESS: t`Impossible access`,
  ACCESS_DIFFICULT: t`Access possible by bypass but difficult`,
  RANDOM_ACCESS: t`Random access, sometimes it works and sometimes it does not`,
};

export const booleanMap: Record<YesNo, string> = {
  YES: t`Yes`,
  NO: t`No`,
};

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
};

export const traceTypeMap: Record<TraceType, string> = {
  CALL: t`Call`,
  MAIL: t`E-mail`,
  LETTER: t`Letter`,
  OTHER: t`Other`,
};

export const contactEntityTypeMap: Record<ContactEntityType, string> = {
  COMPLAINANT: t`Complainant`,
  MEDIATOR: t`Mediator`,
  ORGANIZATION: t`Organization (partner)`,
  EXTERNAL_ORGANIZATION: t`External organization`,
  OTHER: t`Other`,
};
