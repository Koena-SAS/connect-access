import EditIcon from "@mui/icons-material/Edit";
import React, { Ref } from "react";
import Button from "./Button";

type EditButtonProps = {
  children: any;
  variant?: "outlined" | "contained" | "standard";
  [props: string]: any;
};

/**
 * A button with the "delete" trashcan icon.
 * All the props are forwarded to the indernal MUI Button.
 */
const EditButton = React.forwardRef(
  (
    { children, variant, ...props }: EditButtonProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <Button
        variant={variant}
        type="button"
        startIcon={<EditIcon />}
        {...props}
        ref={ref}
        className={`edit-button ${props.className ? props.className : ""}`}
      >
        {children}
      </Button>
    );
  }
);

export default EditButton;
