import * as Yup from "yup";
import { FIELD_REQUIRED_MESSAGE } from "@/shared/utils/validations";


export const authInitialValues = {
  email: "",
  password: "",
};

export const authValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required(FIELD_REQUIRED_MESSAGE),
  password: Yup.string().required(FIELD_REQUIRED_MESSAGE),
});

export const forgotPasswordInitialValues = {
  email: "",
};

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email format").required(FIELD_REQUIRED_MESSAGE),
});

export const resetPasswordInitialValues = {
  token: "",
  password: "",
  confirmPassword: "",
};

export const resetPasswordValidationSchema = Yup.object({
  password: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required(FIELD_REQUIRED_MESSAGE),
});

export const changePasswordInitialValues = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export const changePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  newPassword: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required(FIELD_REQUIRED_MESSAGE),
});