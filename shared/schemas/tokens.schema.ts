import * as yup from 'yup';

export const tokensAssignmentValidationSchema = yup.object({
  tokens: yup
    .number()
    .typeError('Los tokens deben ser un número válido')
    .required('El número de tokens es obligatorio')
    .min(1000, 'El mínimo de tokens a asignar es 1,000')
    .max(100000000, 'No puedes asignar más de 100,000,000 tokens')
    .test(
      'is-integer',
      'Los tokens deben ser un número entero',
      (value) => value ? Number.isInteger(value) : true
    ),
});

export const tokenUsageValidationSchema = yup.object({
  tokensUsed: yup
    .number()
    .typeError('Los tokens usados deben ser un número válido')
    .required('Los tokens usados son obligatorios')
    .min(0, 'Los tokens usados no pueden ser negativos')
    .max(100000000, 'No puedes registrar más de 100,000,000 tokens usados'),
  totalTokensAssigned: yup
    .number()
    .typeError('El total de tokens asignados debe ser un número válido')
    .required('El total de tokens asignados es obligatorio')
    .min(0, 'El total de tokens asignados no puede ser negativo'),
});

export const tokensInitialValues = {
  tokens: 0,
};

export const tokenUsageInitialValues = {
  tokensUsed: 0,
  totalTokensAssigned: 0,
};