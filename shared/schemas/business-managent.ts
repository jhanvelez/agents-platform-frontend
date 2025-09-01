import * as Yup from "yup";
import { FIELD_REQUIRED_MESSAGE } from "@/shared/utils/validations";

export const businessManagementInitialValues = {
  name: "",
  documentType: "",
  documentNumber: "",
  email: "",
  address: "",
  department: "",
  city: "",
  plan: "",
  monthlyTokenLimit: 0,
};

export const businnessManagementValidationSchema = Yup.object({
  name: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  documentType: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  documentNumber: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  email: Yup.string().email("Correo electrónico no válido").required(FIELD_REQUIRED_MESSAGE),
  address: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  department: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  city: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  plan: Yup.string().required(FIELD_REQUIRED_MESSAGE),
  monthlyTokenLimit: Yup.number()
    .integer("El límite mensual debe ser un número entero")
    .min(0, "El límite mensual no puede ser negativo")
    .required(FIELD_REQUIRED_MESSAGE),
});