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