import { Trans } from "@lingui/macro";
import {
  EmailField,
  FirstNameField,
  LastNameField,
  PhoneField,
} from "../../forms";
import DudeImage from "../../images/buildSvg/Dude";

type PersonalInformationFieldsProps = {
  /**
   * React hook form register() function
   */
  register: any;
  /**
   * React hook form errors object
   */
  errors: any;
  /**
   * The class name passed to the main container div.
   */
  className?: string;
  [borderFieldsetProps: string]: any;
};

/**
 * Fields for assistive technology of the main mediation form.
 */
function PersonalInformationFields({
  register,
  errors,
  className,
}: PersonalInformationFieldsProps) {
  return (
    <div
      role="group"
      aria-labelledby="personal-info-legend"
      className={`personal-info ${className ? className : ""}`}
    >
      <h3 id="personal-info-legend" className="personal-info__legend">
        <Trans>My personal information</Trans>
      </h3>
      <DudeImage className="personal-info__dude dude_svg" aria-hidden={true} />
      <div className="personal-info__firstName">
        <FirstNameField
          componentName="user-info"
          errors={errors}
          register={register}
          required={true}
        />
      </div>
      <div className="personal-info__lastName">
        <LastNameField
          componentName="user-info"
          errors={errors}
          register={register}
        />
      </div>
      <div className="personal-info__email">
        <EmailField
          componentName="user-info"
          errors={errors}
          register={register}
          required={true}
        />
      </div>
      <div className="personal-info__phone">
        <PhoneField
          componentName="user-info"
          errors={errors}
          register={register}
        />
      </div>
    </div>
  );
}

export default PersonalInformationFields;
