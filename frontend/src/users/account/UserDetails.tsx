import { t, Trans } from "@lingui/macro";
import produce from "immer";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  EmailField,
  FirstNameField,
  LastNameField,
  PhoneField,
} from "../../forms";
import Button from "../../forms/buttons/Button";
import Snackbar from "../../forms/Snackbar";
import { useModifyUserDetails, useUserDetails } from "../../hooks";
import { setManualError } from "../../utils/formUtils";

/**
 * Display user details.
 */
function UserDetails({ token }) {
  const [requestSuccessMessageOpen, setRequestSuccessMessageOpen] =
    useState(false);
  const [requestFailureMessageOpen, setRequestFailureMessageOpen] =
    useState(false);
  const displayRequestSuccess = () => {
    setRequestSuccessMessageOpen(true);
  };
  const displayRequestFailure = () => {
    setRequestFailureMessageOpen(true);
  };
  const handleCloseSuccessMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestSuccessMessageOpen(false);
  };
  const handleCloseFailureMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setRequestFailureMessageOpen(false);
  };
  const { userDetails } = useUserDetails(token);
  const [modifyUserDetails, { error: userDetailsModificationError }] =
    useModifyUserDetails({
      token,
      displayRequestSuccess,
      displayRequestFailure,
    });
  const { register, handleSubmit, errors, setValue, setError } = useForm();

  useEffect(() => {
    if (userDetailsModificationError) {
      setManualError(
        userDetailsModificationError.first_name,
        "firstName",
        setError
      );
      setManualError(
        userDetailsModificationError.last_name,
        "lastName",
        setError
      );
      setManualError(userDetailsModificationError.email, "email", setError);
      setManualError(
        userDetailsModificationError.phone_number,
        "phoneNumber",
        setError
      );
    }
  }, [userDetailsModificationError, setError]);
  useEffect(() => {
    if (userDetails) {
      setValue("firstName", userDetails.firstName);
      setValue("lastName", userDetails.lastName);
      setValue("email", userDetails.email);
      setValue("phoneNumber", userDetails.phoneNumber);
    }
  }, [userDetails, setValue]);

  const onSubmit = (data) => {
    const userDetailsToSend = produce(data, (draft) => {
      draft.isStaff = userDetails.isStaff;
    });
    modifyUserDetails({ userDetails: userDetailsToSend, token });
  };
  return (
    <section className="user-details">
      <div className="user-details__explanation-container">
        <h2 className="user-details__title">
          <Trans>Personal information</Trans>
        </h2>
        <p className="user-details__description">
          <Trans>
            This information is used to identify you, you can modify it at any
            time.
          </Trans>
        </p>
      </div>
      <form
        className="user-details__content form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <ul className="user-details__content-list">
          <li className="user-details__item first">
            <LastNameField
              componentName="account"
              errors={errors}
              register={register}
              defaultValue={userDetails && userDetails.lastName}
              className="user-details__field"
            />
          </li>
          <li className="user-details__item">
            <FirstNameField
              componentName="account"
              errors={errors}
              register={register}
              required={true}
              defaultValue={userDetails && userDetails.firstName}
              className="user-details__field"
            />
          </li>
          <li className="user-details__item">
            <EmailField
              componentName="account"
              errors={errors}
              register={register}
              required={true}
              defaultValue={userDetails && userDetails.email}
              className="user-details__field"
            />
          </li>
          <li className="user-details__item last">
            <PhoneField
              componentName="user-info"
              errors={errors}
              register={register}
              defaultValue={userDetails && userDetails.phoneNumber}
              className="user-details__field"
            />
          </li>
        </ul>
        <Snackbar
          notificationText={t`Your personal information was successfully updated.`}
          open={requestSuccessMessageOpen}
          onClose={handleCloseSuccessMessage}
          severity="success"
        />
        <Snackbar
          notificationText={t`We could'nt update your personal information. Please retry later.`}
          open={requestFailureMessageOpen}
          onClose={handleCloseFailureMessage}
          severity="error"
        />
        <div className="user-details__submit">
          <Button size="medium" type="submit">
            <Trans>Validate your new personal information</Trans>
          </Button>
        </div>
      </form>
    </section>
  );
}

UserDetails.propTypes = {
  token: PropTypes.string.isRequired,
};

export default UserDetails;
