import { i18n } from "@lingui/core";
import { t, Trans } from "@lingui/macro";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import enLocale from "date-fns/locale/en-US";
import frLocale from "date-fns/locale/fr";
import { Controller } from "react-hook-form";
import { BorderedFieldset, Radio, TextField } from "../../forms";
import MediationRequestStatus from "../../forms/fields/MediationRequestStatus";
import { MediationRequest } from "../../types/mediationRequest";
import { Langs } from "../../types/types";

type MainFieldsProps = {
  /**
   * React hook form register() function
   */
  register: any;
  /**
   * React hook form control from useForm
   */
  control: any;
  /**
   * React hook form setError function
   */
  setError: any;
  /**
   * React hook form clearErrors function
   */
  clearErrors: any;
  /**
   * React hook form errors object
   */
  errors: any;
  mediationRequest?: MediationRequest;
  /**
   * The class name passed to the main container div.
   */
  className?: string;
  [borderFieldsetProps: string]: any;
};

/**
 * Main fields of the mediation details in the admin panel.
 */
function MainFields({
  register,
  control,
  mediationRequest,
  setError,
  clearErrors,
  errors,
  className,
  ...borderFieldsetProps
}: MainFieldsProps) {
  const requestDateFormatError = t`The creation date must be formated following the pattern mm/dd/yyyy hh:mm (a|p)m`;
  const localeMap: Record<Langs, any> = {
    en: enLocale,
    fr: frLocale,
  };
  const maskMap = {
    fr: "__/__/____ __:__",
    en: "__/__/____ __:__ _M",
  };
  function formatIdentifier(id: string): JSX.Element {
    const initialSegment = id.substring(0, 8);
    const restOfId = id.substring(8);
    return (
      <>
        <span style={{ fontWeight: "bold" }}>{initialSegment}</span>
        {restOfId}
      </>
    );
  }
  return (
    <BorderedFieldset
      legend={t`Main information`}
      fieldsetClassName={`main-mediation-request-admin-fields ${
        className ? className : ""
      }`}
      level={3}
      legendClassName="main-mediation-request-admin-fields__title"
      {...borderFieldsetProps}
    >
      {mediationRequest?.id ? (
        <>
          <p className="label main-mediation-request-admin-fields__publicIdentifier">
            <Trans>Public identifier</Trans>
          </p>
          <p className="main-mediation-request-admin-fields__value">
            {formatIdentifier(mediationRequest.id)}
          </p>
        </>
      ) : (
        ""
      )}
      <div className="main-mediation-request-admin-fields__requestDate">
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={localeMap[i18n.locale as Langs]}
        >
          <Controller
            name="requestDate"
            control={control}
            rules={{
              validate: function checkDateFormatError() {
                if (Boolean(errors.requestDate)) {
                  return requestDateFormatError;
                } else {
                  return true;
                }
              },
            }}
            render={({ ref, ...rest }) => (
              <DateTimePicker
                label={t`Request date`}
                mask={maskMap[i18n.locale as Langs]}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      error={!!errors.requestDate}
                      helperText={
                        errors.requestDate ? errors.requestDate.message : ""
                      }
                      id="mediation-detail-request-date"
                      FormHelperTextProps={{ role: "alert" }}
                      aria-label={null}
                      inputProps={{
                        ...params.inputProps,
                        "aria-describedby":
                          "mediation-detail-request-date-desc",
                      }}
                      fullwidth={false}
                    />
                  );
                }}
                onError={(reason) => {
                  // when reason is not null then a new error occured on date
                  // when reason is null, then the previous error has disappeared
                  if (reason) {
                    setError("requestDate", {
                      type: "manual",
                      message: requestDateFormatError,
                    });
                  } else {
                    clearErrors("requestDate");
                  }
                }}
                {...rest}
              />
            )}
          />
          <p
            id="mediation-detail-request-date-desc"
            className="form__helper-text"
          >
            <Trans>Example of correct format: 09/01/2021 06:52 PM</Trans>
          </p>
        </LocalizationProvider>
      </div>
      {mediationRequest?.modificationDate ? (
        <>
          <p className="label main-mediation-request-admin-fields__modificationDate">
            <Trans>Last modification date</Trans>
          </p>
          <p className="main-mediation-request-admin-fields__value">
            {new Date(mediationRequest.modificationDate).toLocaleString(
              i18n.locale as Langs
            )}
          </p>
        </>
      ) : (
        ""
      )}
      <div className="main-mediation-request-admin-fields__status">
        <MediationRequestStatus
          register={register}
          name="status"
          label={t`Request status`}
          defaultOptionLabel={t`Not specified`}
          fullWidth={true}
        />
      </div>
      <div
        role="radiogroup"
        aria-labelledby="urgency"
        className="radio-container main-mediation-request-admin-fields__urgency"
      >
        <p className="label" id="urgency">
          <Trans>Is the problem urgent?</Trans>
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

export default MainFields;
