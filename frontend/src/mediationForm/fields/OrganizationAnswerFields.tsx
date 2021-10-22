import { t, Trans } from "@lingui/macro";
import { BorderedFieldset, Radio, TextField } from "../../forms";

type OrganizationAnswerFieldsProps = {
  /**
   * React hook form register() function
   */
  register: any;
  /**
   * React hook form watch() function
   */
  watch: any;
  /**
   * The class name passed to the main container div.
   */
  className?: string;
  [borderFieldsetProps: string]: any;
};

/**
 * Fields related to the organization answer, of the main mediation form.
 */
function OrganizationAnswerFields({
  register,
  watch,
  className,
  ...borderFieldsetProps
}: OrganizationAnswerFieldsProps) {
  const organizationTold = watch("didTellOrganization");
  const organizationReplied = watch("didOrganizationReply");
  return (
    <BorderedFieldset
      legend={t`About the organization's answer`}
      fieldsetClassName={`about-answer ${className ? className : ""}`}
      {...borderFieldsetProps}
    >
      <div
        role="radiogroup"
        aria-labelledby="didTellOrganization"
        className="radio-container"
      >
        <p className="label" id="didTellOrganization">
          <Trans>
            Did you already tell the organization in charge about the problem?
          </Trans>
        </p>
        <Radio
          name="didTellOrganization"
          id="didTellOrganizationYes"
          value="YES"
          register={register}
          label={t`Yes`}
        />
        <Radio
          name="didTellOrganization"
          id="didTellOrganizationNo"
          value="NO"
          register={register}
          label={t`No`}
        />
        <Radio
          name="didTellOrganization"
          id="didTellOrganizationNotSpecified"
          value=""
          register={register}
          label={t`Not specified`}
        />
      </div>
      {organizationTold !== "NO" && (
        <>
          <div
            role="radiogroup"
            aria-labelledby="didOrganizationReply"
            className="radio-container"
          >
            <p className="label" id="didOrganizationReply">
              <Trans>Did they reply?</Trans>
            </p>
            <Radio
              name="didOrganizationReply"
              id="didOrganizationReplyYes"
              value="YES"
              register={register}
              label={t`Yes`}
            />
            <Radio
              name="didOrganizationReply"
              id="didOrganizationReplyNo"
              value="NO"
              register={register}
              label={t`No`}
            />
            <Radio
              name="didOrganizationReply"
              id="didOrganizationReplyNotSpecified"
              value=""
              register={register}
              label={t`Not specified`}
            />
          </div>
          {organizationReplied !== "NO" && (
            <TextField
              id="organizationReply"
              name="organizationReply"
              inputRef={register}
              label={t`What was their reply?`}
              type="text"
              multiline={true}
              minRows={5}
              className="about-answer__organization-reply"
            />
          )}
        </>
      )}
    </BorderedFieldset>
  );
}

export default OrganizationAnswerFields;
