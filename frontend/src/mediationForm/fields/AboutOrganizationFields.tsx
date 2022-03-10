import { t } from "@lingui/macro";
import {
  BorderedFieldset,
  EmailField,
  PhoneField,
  TextField,
} from "../../forms";

type AboutOrganizationFieldsProps = {
  /**
   * React hook form register() function
   */
  register: any;
  /**
   * React hook form errors object
   */
  errors: any;
  /**
   * Wether the field names should be prefixed by 'organization'
   */
  prefixedNames?: boolean;
  /**
   * The class name passed to the main container div.
   */
  className?: string;
  [borderFieldsetProps: string]: any;
};

/**
 * Fields about organization, of the main mediation form.
 */
function AboutOrganizationFields({
  register,
  errors,
  prefixedNames = false,
  className,
  ...borderFieldsetProps
}: AboutOrganizationFieldsProps) {
  const names = prefixedNames
    ? {
        name: "organizationName",
        mailingAddress: "organizationAddress",
        email: "organizationEmail",
        phoneNumber: "organizationPhoneNumber",
        contact: "organizationContact",
      }
    : {
        name: "name",
        mailingAddress: "mailingAddress",
        email: "email",
        phoneNumber: "phoneNumber",
        contact: "contact",
      };
  return (
    <BorderedFieldset
      legend={t`About the organization`}
      fieldsetClassName={`about-organization ${className ? className : ""}`}
      {...borderFieldsetProps}
    >
      <TextField
        id={names.name}
        name={names.name}
        inputRef={register}
        label={t`Name of the organization`}
        type="text"
        className="about-organization__name"
      />
      <TextField
        id={names.mailingAddress}
        name={names.mailingAddress}
        inputRef={register}
        label={t`Mailing address`}
        type="text"
      />
      <EmailField
        componentName="about-organization"
        errors={errors}
        register={register}
        required={false}
        name={names.email}
      />
      <PhoneField
        componentName="about-organization"
        errors={errors}
        register={register}
        required={false}
        name={names.phoneNumber}
      />
      <TextField
        id={names.contact}
        name={names.contact}
        inputRef={register}
        label={t`Contact`}
        type="text"
      />
    </BorderedFieldset>
  );
}

export default AboutOrganizationFields;
