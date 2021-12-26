// <reference types='codeceptjs' />
type AxeHelper = import("../helpers/axe_helper");
type DjangoProductionHelper = import("../helpers/django_helper_production");
type DjangoHelper = import("../helpers/django_helper");

declare namespace CodeceptJS {
  interface SupportObject {
    I: I;
    current: any;
  }
  interface Methods
    extends Playwright,
      AxeHelper,
      DjangoHelper,
      DjangoProductionHelper {
    have: (objectName: string, data?: Record<string, any>) => void;
    preparePage: (page?: string) => void;
    signup: (email?: string, password?: string) => void;
    login: (email?: string, password?: string) => void;
    loginAsAdmin: () => void;
  }
  interface I extends WithTranslation<Methods> {} // eslint-disable-line @typescript-eslint/no-empty-interface
  namespace Translation {
    interface Actions {} // eslint-disable-line @typescript-eslint/no-empty-interface
  }
}
