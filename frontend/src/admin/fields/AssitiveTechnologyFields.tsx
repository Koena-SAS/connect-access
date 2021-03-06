import { t, Trans } from "@lingui/macro";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { isBrowser } from "react-device-detect";
import { BorderedFieldset, TextField, Warning } from "../../forms";

type AssitiveTechnologyFieldsProps = {
  /**
   * React hook form register() function
   */
  register: any;
  /**
   * Wether this component is shown to a lambda user who needs more explanation.
   */
  isUserFacing: boolean;
  /**
   * The class name passed to the main container div.
   */
  className?: string;
  [borderFieldsetProps: string]: any;
} & { errors?: never };

/**
 * Fields for assistive technology in the admin panel.
 *
 * This component is here until the issue #77 is implemented on backend side, so that
 * we can use the AssistiveTechnologyFields component also in the admin panel.
 */
function AssitiveTechnologyFields({
  register,
  className,
  isUserFacing,
  ...borderFieldsetProps
}: AssitiveTechnologyFieldsProps) {
  return (
    <BorderedFieldset
      legend={t`Information about assistive technology used`}
      fieldsetClassName={`assistive-technology-admin-fields ${
        className ? className : ""
      }`}
      level={3}
      legendClassName="assistive-technology-admin-fields__title"
      {...borderFieldsetProps}
    >
      {isUserFacing && (
        <Warning
          containerClassName="assistive-technology-admin-fields__warning"
          text={t`If you don't use any assistance technology, you can ignore the
            following questions and go to next step. However, if you use
            technologies to compensate for your disability in numeric
            usage, any details would help us to process your demand.`}
        />
      )}
      <div className="assistive-technology-admin-fields__technologyUsed">
        <FormControl fullWidth>
          <InputLabel shrink htmlFor="assistiveTechnologyUsed">
            <Trans>Assistive technologies used</Trans>
          </InputLabel>
          <Select
            id="assistiveTechnologyUsed"
            name="assistiveTechnologyUsed"
            multiple
            native
            label={t`Assistive technologies used`}
            inputRef={register()}
            inputProps={
              isBrowser
                ? {
                    "aria-describedby": "assistiveTechnologyUsed-desc",
                  }
                : {}
            }
            classes={{
              select: "assistive-technology-admin-fields__technologyUsedSelect",
            }}
          >
            <option label={t`Not specified`} value="" />
            <Trans>
              <option value="KEYBOARD">Keyboard</option>
            </Trans>
            <Trans>
              <option value="SCREEN_READER_VOCAL_SYNTHESIS">
                Screen reader with vocal synthesis
              </option>
            </Trans>
            <Trans>
              <option value="BRAILLE_DISPLAY">Braille display</option>
            </Trans>
            <Trans>
              <option value="ZOOM_SOFTWARE">Zoom software</option>
            </Trans>
            <Trans>
              <option value="VOCAL_COMMAND_SOFTWARE">
                Vocal command software
              </option>
            </Trans>
            <Trans>
              <option value="DYS_DISORDER_SOFTWARE">
                DYS Disorder software
              </option>
            </Trans>
            <Trans>
              <option value="VIRTUAL_KEYBOARD">Virtual keyboard</option>
            </Trans>
            <Trans>
              <option value="EXCLUSIVE_KEYBOARD_NAVIGATION">
                Exclusive keyboard navigation
              </option>
            </Trans>
            <Trans>
              <option value="ADAPTED_NAVIGATION_DISPOSITIVE">
                Adapted navigation dispositive
              </option>
            </Trans>
            <Trans>
              <option value="OTHER">Other</option>
            </Trans>
          </Select>
        </FormControl>
        {isBrowser && (
          <p
            id="assistiveTechnologyUsed-desc"
            className="form__helper-text assistive-technology-admin-fields__technologyUsed-helper"
          >
            <Trans>
              To select several technologies, first hold down Ctrl key (or Cmd
              under macOS), then use the mouse click, or on the keyboard the
              directional arrows to move and Space to select them.
            </Trans>
          </p>
        )}
      </div>
      <div className="assistive-technology-admin-fields__technologyName">
        <TextField
          id="technologyName"
          name="technologyName"
          inputRef={register()}
          label={t`Assistive technology name(s)`}
          type="text"
          multiline={true}
          minRows={3}
        />
      </div>
      <div className="assistive-technology-admin-fields__technologyVersion">
        <TextField
          id="technologyVersion"
          name="technologyVersion"
          inputRef={register()}
          label={t`Assistive technology version(s)`}
          type="text"
          multiline={true}
          minRows={3}
        />
      </div>
    </BorderedFieldset>
  );
}

export default AssitiveTechnologyFields;
