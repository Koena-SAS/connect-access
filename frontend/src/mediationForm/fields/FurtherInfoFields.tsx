import { t, Trans } from "@lingui/macro";
import { BorderedFieldset, TextField } from "../../forms";

type FurtherInfoFieldsProps = {
  /**
   * React hook form register() function
   */
  register: any;
  /**
   * The class name passed to the main container div.
   */
  className?: string;
  currentAttachedFile?: React.ReactNode;
  [borderFieldsetProps: string]: any;
};

/**
 * Fields related to the further information, of the main mediation form.
 */
function FurtherInfoFields({
  register,
  className,
  currentAttachedFile,
  ...borderFieldsetProps
}: FurtherInfoFieldsProps) {
  return (
    <BorderedFieldset
      legend={t`Further information`}
      fieldsetClassName={`further-information ${className ? className : ""}`}
      {...borderFieldsetProps}
    >
      <TextField
        id="furtherInfo"
        name="furtherInfo"
        inputRef={register}
        label={t`Anything else about your problem?`}
        type="text"
        multiline={true}
        minRows={5}
        className="further-information__textarea input-top-margin"
      />
      <div className="further-information__attached-file">
        <label htmlFor="attachedFile" className="label">
          <Trans>
            Do not hesitate to upload any file that may be useful to better
            understand your problem
          </Trans>
        </label>
        {currentAttachedFile}
        <input
          type="file"
          name="attachedFile"
          id="attachedFile"
          ref={register}
          className="further-information__attached-file-input"
        />
      </div>
    </BorderedFieldset>
  );
}

export default FurtherInfoFields;
