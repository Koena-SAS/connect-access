import { t, Trans } from "@lingui/macro";
import { BorderedFieldset, Radio, TextField } from "../../forms";
import {
  chooseErrorWrappingElement,
  formatErrors,
} from "../../utils/formUtils";

type AboutIssueFieldsProps = {
  /**
   * React hook form register() function
   */
  register: any;
  /**
   * React hook form errors object
   */
  errors: any;
  /**
   * Function that performs the validation of required fields.
   */
  validateRequired?: any;
  /**
   * The class name passed to the main container div.
   */
  className?: string;
  [borderFieldsetProps: string]: any;
};

/**
 * Fields related to the issue, of the main mediation form.
 */
function AboutIssueFields({
  register,
  errors,
  validateRequired = (errorText: string) => {
    return (value: string) => (value ? true : errorText);
  },
  className,
  ...borderFieldsetProps
}: AboutIssueFieldsProps) {
  return (
    <BorderedFieldset
      legend={t`About the issue`}
      fieldsetClassName={`about-issue ${className ? className : ""}`}
      {...borderFieldsetProps}
    >
      <TextField
        id="issueDescription"
        name="issueDescription"
        inputRef={register({
          validate: validateRequired(t`You have to describe your problem`),
        })}
        label={t`What was the issue?`}
        type="text"
        error={!!errors.issueDescription}
        helperText={
          errors.issueDescription
            ? formatErrors(errors.issueDescription.message, true)
            : ""
        }
        FormHelperTextProps={{
          role: "alert",
          component: chooseErrorWrappingElement(errors.issueDescription),
        }}
        required={true}
        multiline={true}
        minRows={5}
        className="about-issue__issue-description"
      />
      <TextField
        id="stepDescription"
        name="stepDescription"
        inputRef={register}
        label={t`Describe every step you did in order to access the wanted content or features`}
        type="text"
        multiline={true}
        minRows={5}
        className="about-issue__step-description"
      />
      <div
        role="radiogroup"
        aria-labelledby="inaccessibilityLevel"
        className="radio-container"
      >
        <p className="label" id="inaccessibilityLevel">
          <Trans>What was the level of inaccessibility encountered?</Trans>
        </p>
        <Radio
          name="inaccessibilityLevel"
          id="inaccessibilityLevelImpossible"
          value="IMPOSSIBLE_ACCESS"
          register={register}
          label={t`Impossible access`}
          containerClassName="about-issue__inaccessibility-level"
        />
        <Radio
          name="inaccessibilityLevel"
          id="inaccessibilityLevelBypass"
          value="ACCESS_DIFFICULT"
          register={register}
          label={t`Access possible by bypass but difficult`}
          containerClassName="about-issue__inaccessibility-level"
        />
        <Radio
          name="inaccessibilityLevel"
          id="inaccessibilityLevelRandom"
          value="RANDOM_ACCESS"
          register={register}
          label={t`Random access, sometimes it works and sometimes it does not`}
          containerClassName="about-issue__inaccessibility-level"
        />
        <Radio
          name="inaccessibilityLevel"
          id="inaccessibilityLevelNotSpecified"
          value=""
          register={register}
          label={t`Not specified`}
        />
      </div>
      <div
        role="radiogroup"
        aria-labelledby="urgency"
        className="radio-container"
      >
        <p className="label" id="urgency">
          <Trans>Is your problem urgent?</Trans>
        </p>
        <Radio
          name="urgency"
          id="urgencyVeryUrgent"
          value="VERY_URGENT"
          register={register}
          label={t`Yes, very urgent: need a quick answer`}
        />
        <Radio
          name="urgency"
          id="urgencyModeratelyUrgent"
          value="MODERATELY_URGENT"
          register={register}
          label={t`Moderately, I can wait, but not too long`}
        />
        <Radio
          name="urgency"
          id="UrgencyNotUrgent"
          value="NOT_URGENT"
          register={register}
          label={t`Not urgent at all, but would like a solution as soon as possible`}
        />
        <Radio
          name="urgency"
          id="UrgencyNotSpecified"
          value=""
          register={register}
          label={t`Not specified`}
        />
      </div>
    </BorderedFieldset>
  );
}

export default AboutIssueFields;
