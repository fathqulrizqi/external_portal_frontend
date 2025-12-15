export const validateForm = (schema, data) => {
  const { error } = schema.validate(data, {
    abortEarly: false,
  });

  if (!error) return {};

  const errors = {};
  error.details.forEach((item) => {
    errors[item.path[0]] = item.message;
  });

  return errors;
};
