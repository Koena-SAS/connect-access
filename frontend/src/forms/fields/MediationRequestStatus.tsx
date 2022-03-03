import { Trans } from "@lingui/macro";
import TextField from "./TextField";

type MediationRequestStatusProps = {
  label: string;
  defaultOptionLabel: string;
  name: string;
  /**
   * React hook form register() function
   */
  register?: any;
  onChange?: any;
  fullWidth?: boolean;
  className?: string;
  /**
   * Other props are given to the MUI select component.
   */
  [props: string]: any;
};

/**
 * Field asking for mediation request status.
 */
function MediationRequestStatus({
  label,
  defaultOptionLabel,
  name,
  register,
  onChange,
  fullWidth = false,
  className,
  ...props
}: MediationRequestStatusProps) {
  return (
    <TextField
      id={name}
      name={name}
      select
      SelectProps={{
        native: true,
      }}
      label={label}
      inputRef={register}
      onChange={onChange}
      className={className}
      fullwidth={fullWidth}
      {...props}
    >
      <option value="" label={defaultOptionLabel} />
      <Trans>
        <option value="PENDING">Incomplete</option>
      </Trans>
      <Trans>
        <option value="WAITING_MEDIATOR_VALIDATION">
          Waiting for mediator validation
        </option>
      </Trans>
      <Trans>
        <option value="FILED">Request filed</option>
      </Trans>
      <Trans>
        <option value="WAITING_ADMIN">
          Waiting for administrative validation
        </option>
      </Trans>
      <Trans>
        <option value="WAITING_CONTACT">Waiting for contact</option>
      </Trans>
      <Trans>
        <option value="WAITING_CONTACT_BIS">Waiting for second contact</option>
      </Trans>
      <Trans>
        <option value="MEDIATING">Mediating</option>
      </Trans>
      <Trans>
        <option value="CLOTURED">Closed</option>
      </Trans>
      <Trans>
        <option value="MEDIATION_FAILED">Mediation failed</option>
      </Trans>
    </TextField>
  );
}

export default MediationRequestStatus;
