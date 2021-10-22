import { t } from "@lingui/macro";
import {
  BorderedFieldset,
  EmailField,
  FirstNameField,
  LastNameField,
  PhoneField,
} from "../../forms";

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
 * Fields for assistive technology of the mediation request details in the admin.
 */
function PersonalInformationFields({
  register,
  errors,
  className,
  ...borderFieldsetProps
}: PersonalInformationFieldsProps) {
  return (
    <BorderedFieldset
      legend={t`Personal information`}
      fieldsetClassName={`admin-personal-info ${className ? className : ""}`}
      legendClassName="admin-personal-info__title"
      {...borderFieldsetProps}
    >
      <div className="admin-personal-info__firstName">
        <FirstNameField
          componentName="admin-user-info"
          errors={errors}
          register={register}
          required={true}
        />
      </div>
      <div className="admin-personal-info__lastName">
        <LastNameField
          componentName="admin-user-info"
          errors={errors}
          register={register}
        />
      </div>
      <div className="admin-personal-info__email">
        <EmailField
          componentName="admin-user-info"
          errors={errors}
          register={register}
          required={true}
        />
      </div>
      <div className="admin-personal-info__phone">
        <PhoneField
          componentName="admin-user-info"
          errors={errors}
          register={register}
        />
      </div>
    </BorderedFieldset>
  );
}

export default PersonalInformationFields;
