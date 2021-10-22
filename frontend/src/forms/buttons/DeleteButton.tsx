import DeleteIcon from "@material-ui/icons/Delete";
import React, { Ref } from "react";
import Button from "./Button";

type DeleteButtonProps = {
  children: any;
  variant?: "outlined" | "contained" | "standard";
  [props: string]: any;
};

/**
 * A button with the "delete" trashcan icon.
 * All the props are forwarded to the indernal MUI Button.
 */
const DeleteButton = React.forwardRef(
  (
    { children, variant, ...props }: DeleteButtonProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <Button
        variant={variant}
        type="button"
        startIcon={<DeleteIcon />}
        {...props}
        ref={ref}
        className={`delete-button ${props.className ? props.className : ""}`}
      >
        {children}
      </Button>
    );
  }
);

export default DeleteButton;
