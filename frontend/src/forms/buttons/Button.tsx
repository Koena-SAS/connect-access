import MUIButton from "@material-ui/core/Button";
import React, { Ref } from "react";

type ButtonProps = {
  children: any;
  className?: string;
  [props: string]: any;
};

/**
 * A wrapper around MUI Button.
 * It corrects the vertical position of Luciole font family.
 */
const Button = React.forwardRef(
  (
    { children, className, ...props }: ButtonProps,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <MUIButton
        variant="contained"
        {...props}
        ref={ref}
        className={`button ${className ? className : ""}`}
      >
        <span className="button__content">{children}</span>
      </MUIButton>
    );
  }
);

export default Button;
