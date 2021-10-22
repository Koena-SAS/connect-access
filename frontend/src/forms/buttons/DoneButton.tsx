import DoneIcon from "@material-ui/icons/Done";
import React, { Ref } from "react";
import Button from "./Button";

type DoneButtonProps = {
  children: any;
  [props: string]: any;
};

/**
 * A button with the "done" check icon.
 * All the props are forwarded to the indernal MUI Button.
 */
const DoneButton = React.forwardRef(
  ({ children, ...props }: DoneButtonProps, ref: Ref<HTMLButtonElement>) => {
    return (
      <Button
        size="large"
        type="submit"
        startIcon={<DoneIcon />}
        {...props}
        ref={ref}
        className={`done-button ${props.className ? props.className : ""}`}
      >
        {children}
      </Button>
    );
  }
);

export default DoneButton;
