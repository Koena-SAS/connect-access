import { t, Trans } from "@lingui/macro";
import { Controller } from "react-hook-form";
import { BorderedFieldset, TextField } from "../../forms";
import {
  chooseErrorWrappingElement,
  formatErrors,
} from "../../utils/formUtils";

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
   * React hook form control object
   */
  control: any;
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
  control,
  className,
  ...borderFieldsetProps
}: AboutOrganizationFieldsProps) {
  const emailLabel = (
    <Trans>
      <span lang="en">E-mail</span>
    </Trans>
  );
  const emailRules = {
    pattern: {
      value: /^\S+@\S+\.\S+$/i,
      message: t`The e-mail format is invalid`,
    },
  };
  const phoneRules = {
    pattern: {
      value: /^\+?\d{9,15}$/,
      message: t`The phone number format is invalid`,
    },
  };
  return (
    <BorderedFieldset
      legend={t`About the organization`}
      fieldsetClassName={`about-organization ${className ? className : ""}`}
      {...borderFieldsetProps}
    >
      <TextField
        id="name"
        name="name"
        inputRef={register}
        label={t`Name of the organization`}
        type="text"
        className="about-organization__name"
      />
      <TextField
        id="mailingAddress"
        name="mailingAddress"
        inputRef={register}
        label={t`Mailing address`}
        type="text"
      />
      {/* TODO: currently the email/phone are in controllers instead of using generic compoennts.
                This is because with classic register() the rules cn't have a pattern without the field being mandatory.
                In RHF V7 this problem may be resolved, so repace by EmailField and PhoneField when migrating. */}
      <Controller
        control={control}
        name="email"
        rules={emailRules}
        error={!!errors.email}
        as={
          <TextField
            id="email"
            label={emailLabel}
            inputProps={{ "aria-describedby": "email-desc" }}
            type="email"
            helperText={
              errors.email ? formatErrors(errors.email.message, true) : ""
            }
            FormHelperTextProps={{
              role: "alert",
              component: chooseErrorWrappingElement(errors.email),
            }}
          />
        }
      />
      <p id="email-desc" className="form__helper-text">
        <Trans>Example of correct format: name@domain.com</Trans>
      </p>
      <Controller
        control={control}
        name="phoneNumber"
        rules={phoneRules}
        error={!!errors.phoneNumber}
        as={
          <TextField
            id="phoneNumber"
            label={t`Phone number`}
            inputProps={{ "aria-describedby": "phoneNumber-desc" }}
            type="tel"
            helperText={
              errors.phoneNumber
                ? formatErrors(errors.phoneNumber.message, true)
                : ""
            }
            FormHelperTextProps={{
              role: "alert",
              component: chooseErrorWrappingElement(errors.phoneNumber),
            }}
          />
        }
      />
      <p id="phoneNumber-desc" className="form__helper-text">
        <Trans>
          The phone number must be 9 to 15 digits long and can be preceded by
          the + sign
        </Trans>
      </p>
      <TextField
        id="contact"
        name="contact"
        inputRef={register}
        label={t`Contact`}
        type="text"
      />
    </BorderedFieldset>
  );
}

export default AboutOrganizationFields;
