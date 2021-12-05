import MUITextField from "@material-ui/core/TextField";
import { forwardRef, ReactNode, Ref } from "react";

type TextFieldProps = {
  children: ReactNode;
  fullwidth?: boolean;
  InputLabelProps?: any;
  FormHelperTextProps?: any;
  [props: string]: any;
};

/**
 * A wrapper around MUI TextField.
 */
const TextField = forwardRef(
  (
    {
      children,
      fullwidth = true,
      InputLabelProps = { shrink: true },
      FormHelperTextProps = { role: "alert" },
      ...props
    }: TextFieldProps,
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <MUITextField
        InputLabelProps={InputLabelProps}
        FormHelperTextProps={FormHelperTextProps}
        fullWidth={fullwidth}
        {...props}
        ref={ref}
      >
        {children}
      </MUITextField>
    );
  }
);

export default TextField;
