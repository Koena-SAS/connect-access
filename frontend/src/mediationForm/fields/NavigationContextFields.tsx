import { t, Trans } from "@lingui/macro";
import { BorderedFieldset, Radio, TextField } from "../../forms";
import {
  chooseErrorWrappingElement,
  formatErrors,
} from "../../utils/formUtils";

type NavigationContextFieldsProps = {
  /**
   * React hook form register() function
   */
  register: any;
  /**
   * React hook form errors object
   */
  errors: any;
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
 * Fields related to the navigation context, of the main mediation form.
 */
function NavigationContextFields({
  register,
  errors,
  watch,
  className,
  ...borderFieldsetProps
}: NavigationContextFieldsProps) {
  const firefoxOption = (
    <Trans>
      <span lang="en">Firefox</span>
    </Trans>
  );
  const chromeOption = (
    <Trans>
      <span lang="en">Chrome</span>
    </Trans>
  );
  const ieOption = (
    <Trans>
      <span lang="en">Internet Explorer</span>
    </Trans>
  );
  const edgeOption = (
    <Trans>
      <span lang="en">Microsoft Edge</span>
    </Trans>
  );
  const isBrowserUsed = watch("browserUsed");
  const isMobileAppUsed = watch("mobileAppUsed");
  console.log("mobileAppUsed ", isMobileAppUsed);
  return (
    <>
      <BorderedFieldset
        legend={t`Navigation context`}
        fieldsetClassName={`navigation-context ${className ? className : ""}`}
        {...borderFieldsetProps}
      >
        <div
          role="radiogroup"
          aria-labelledby="browserUsed"
          className="radio-container"
        >
          <p className="label" id="browserUsed">
            <Trans>Did the problem occur while using a web browser?</Trans>
          </p>
          <Radio
            name="browserUsed"
            id="browserUsedYes"
            value="YES"
            register={register}
            label={t`Yes`}
          />
          <Radio
            name="browserUsed"
            id="browserUsedNo"
            value="NO"
            register={register}
            label={t`No`}
          />
          <Radio
            name="browserUsed"
            id="browserUsedNotSpecified"
            value=""
            register={register}
            label={t`Not specified`}
          />
        </div>
        {isBrowserUsed !== "NO" && (
          <>
            <TextField
              id="url"
              name="url"
              inputRef={register({
                pattern: {
                  value:
                    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
                  message: t`The URL format is invalid`,
                },
              })}
              label={t`What is the URL address where you have encountered the problem?`}
              inputProps={{ "aria-describedby": "url-desc" }}
              type="url"
              error={!!errors.url}
              helperText={
                errors.url ? formatErrors(errors.url.message, true) : ""
              }
              FormHelperTextProps={{
                role: "alert",
                component: chooseErrorWrappingElement(errors.url),
              }}
              className="navigation-context__url"
            />
            <p id="url-desc" className="form__helper-text">
              <Trans>
                The URL must be a valid http address, with at least
                domain.extension
              </Trans>
            </p>
            <div
              role="radiogroup"
              aria-labelledby="browser"
              className="radio-container"
            >
              <p
                className="label navigation-context__browser-label"
                id="browser"
              >
                <Trans>Which web browser did you use?</Trans>
              </p>
              <Radio
                name="browser"
                id="browserFirefox"
                value="FIREFOX"
                register={register}
                label={firefoxOption}
              />
              <Radio
                name="browser"
                id="browserChrome"
                value="CHROME"
                register={register}
                label={chromeOption}
              />
              <Radio
                name="browser"
                id="browserInternetExplorer"
                value="INTERNET_EXPLORER"
                register={register}
                label={ieOption}
              />
              <Radio
                name="browser"
                id="browserMicrosoftEdge"
                value="MICROSOFT_EDGE"
                register={register}
                label={edgeOption}
              />
              <Radio
                name="browser"
                id="browserOther"
                value="OTHER"
                register={register}
                label={t`Other`}
              />
              <Radio
                name="browser"
                id="browserDontKnow"
                value="DONT_KNOW"
                register={register}
                label={t`Don't know`}
              />
              <Radio
                name="browser"
                id="browserNotSpecified"
                value=""
                register={register}
                label={t`Not specified`}
              />
            </div>
            <TextField
              id="browserVersion"
              name="browserVersion"
              inputRef={register}
              label={t`Which web browser version did you use?`}
              type="text"
              className="navigation-context__browser-version"
            />
          </>
        )}
      </BorderedFieldset>
      {isBrowserUsed === "NO" && (
        <BorderedFieldset
          legend={t`About the platform`}
          smallPaddingTop={true}
          level={3}
          fieldsetClassName="about-platform"
        >
          <div
            role="radiogroup"
            aria-labelledby="mobileAppUsed"
            className="radio-container"
          >
            <p className="label" id="mobileAppUsed">
              <Trans>Was it a mobile app?</Trans>
            </p>
            <Radio
              name="mobileAppUsed"
              id="mobileAppUsedYes"
              value="YES"
              register={register}
              label={t`Yes`}
            />
            <Radio
              name="mobileAppUsed"
              id="mobileAppUsedNo"
              value="NO"
              register={register}
              label={t`No`}
            />
            <Radio
              name="mobileAppUsed"
              id="mobileAppUsedNotSpecified"
              value=""
              register={register}
              label={t`Not specified`}
            />
          </div>
          {isMobileAppUsed !== "NO" && (
            <>
              <div>
                <TextField
                  name="mobileAppPlatform"
                  id="mobileAppPlatform"
                  select
                  SelectProps={{
                    native: true,
                  }}
                  label={t`What kind of app was it?`}
                  inputRef={register()}
                >
                  <option label={t`Not specified`} value="" />
                  <Trans>
                    <option value="IOS">iOS</option>
                  </Trans>
                  <Trans>
                    <option value="ANDROID">Android</option>
                  </Trans>
                  <Trans>
                    <option value="WINDOWS_PHONE">Windows phone</option>
                  </Trans>
                  <Trans>
                    <option value="OTHER">Other</option>
                  </Trans>
                </TextField>
              </div>
              <TextField
                id="mobileAppName"
                name="mobileAppName"
                inputRef={register}
                label={t`What was the name of the app?`}
                type="text"
              />
            </>
          )}
          {isMobileAppUsed === "NO" && (
            <TextField
              id="otherUsedSoftware"
              name="otherUsedSoftware"
              inputRef={register}
              label={t`Which software, connected object or other did you use?`}
              type="text"
            />
          )}
        </BorderedFieldset>
      )}
    </>
  );
}

export default NavigationContextFields;
