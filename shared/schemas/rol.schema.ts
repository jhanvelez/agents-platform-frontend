import * as Yup from "yup";
import { FIELD_REQUIRED_MESSAGE } from "@/shared/utils/validations";

export const rolInitialValues = {
  name: "",
  permissionIds: []
};

export const rolValidationSchema = Yup.object({
  name: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  permissionIds: Yup.array().of(Yup.string())
});
