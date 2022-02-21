import ClearIcon from "@mui/icons-material/Clear";
import React, { Ref } from "react";
import Button from "./Button";

type CancelButtonProps = {
  children: any;
  [props: string]: any;
};

/**
 * A button with the "cancel" cross icon.
 * All the props are forwarded to the indernal MUI Button.
 */
const CancelButton = React.forwardRef(
  ({ children, ...props }: CancelButtonProps, ref: Ref<HTMLButtonElement>) => {
    return (
      <Button
        size="large"
        type="button"
        startIcon={<ClearIcon />}
        {...props}
        ref={ref}
        className={`cancel-button ${props.className ? props.className : ""}`}
      >
        {children}
      </Button>
    );
  }
);

export default CancelButton;
