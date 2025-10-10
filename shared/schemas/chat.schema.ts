import * as Yup from "yup";
import { FIELD_REQUIRED_MESSAGE } from "@/shared/utils/validations";


export const exportChatInitialValues = {
  email: "",
};

export const exportChatValidationSchema = Yup.object({
  email: Yup.string().email("Formato del email invalido").required(FIELD_REQUIRED_MESSAGE),
});