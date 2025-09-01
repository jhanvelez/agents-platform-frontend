import * as Yup from "yup";
import { FIELD_REQUIRED_MESSAGE } from "@/shared/utils/validations";

export const userInitialValues = {
  firstName: "",
  lastName: "",
  documentType: "",
  documentId: "",
  phoneNumber: "",
  email: "",
  password: "",
  serviceStartSate: "",
  isEmailConfirmed: false,
  roles: [],
};

export const userValidationSchema = Yup.object({
  firstName: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  lastName: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  documentType: Yup.string().nullable(),
  documentId: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  phoneNumber: Yup.string()
    .nullable()
    .matches(/^\+?[0-9\s\-()]{7,20}$/, "Número de telefono invalido"),
  email: Yup.string().email("Formato del email invalido").required(FIELD_REQUIRED_MESSAGE),
  password: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  serviceStartSate: Yup.date().nullable(),
  isEmailConfirmed: Yup.boolean(),
  roles: Yup.array().of(Yup.string()).required(FIELD_REQUIRED_MESSAGE),
});
