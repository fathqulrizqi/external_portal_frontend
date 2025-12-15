import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().required().messages({
    "string.empty": "Full name is required",
  }),

  email: Joi.string().email({ tlds: false }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Email is not valid",
  }),

  phone: Joi.string()
  .pattern(/^[0-9]+$/) 
  .min(9)
  .max(15)
  .required()
  .messages({
    "string.empty": "Phone is required",
    "string.pattern.base": "Phone must contain only numbers",
    "string.min": "Phone must be at least 9 characters",
    "string.max": "Phone must be max 15 characters",
  }),

  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and min 8 chars",
    }),

  passwordConfirm: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Password does not match",
      "string.empty": "Confirm password is required",
    }),
});


export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Email is not valid",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
}).unknown(true);;


export const resetPasswordSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Email is not valid",
  }),
});

export const resetPasswordConfirmSchema = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and min 8 chars",
    }),

  passwordConfirm: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Password does not match",
      "string.empty": "Confirm password is required",
    }),
});