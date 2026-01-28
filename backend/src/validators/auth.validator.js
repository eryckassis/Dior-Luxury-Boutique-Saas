import Joi from "joi";

export class AuthValidator {
  static registerSchema = Joi.object({
    name: Joi.string().min(3).max(100).trim().required().messages({
      "string.base": "O nome deve ser um texto",
      "string.empty": "O nome é obrigatório",
      "string.min": "O nome deve ter pelo menos {#limit} caracteres",
      "string.max": "O nome deve ter no máximo {#limit} caracteres",
      "any.required": "O nome é obrigatório",
    }),

    email: Joi.string().email().lowercase().trim().required().messages({
      "string.base": "O e-mail deve ser um texto",
      "string.empty": "O e-mail é obrigatório",
      "string.email": "Por favor, insira um e-mail válido (exemplo: usuario@email.com)",
      "any.required": "O e-mail é obrigatório",
    }),

    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        "string.base": "A senha deve ser um texto",
        "string.empty": "A senha é obrigatória",
        "string.min": "A senha deve ter pelo menos {#limit} caracteres",
        "string.max": "A senha deve ter no máximo {#limit} caracteres",
        "string.pattern.base":
          "A senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (@$!%*?&)",
        "any.required": "A senha é obrigatória",
      }),

    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": "As senhas não coincidem. Por favor, confirme a senha corretamente.",
      "any.required": "A confirmação de senha é obrigatória",
    }),
  });

  static loginSchema = Joi.object({
    email: Joi.string().email().lowercase().trim().required().messages({
      "string.base": "O e-mail deve ser um texto",
      "string.empty": "O e-mail é obrigatório",
      "string.email": "Por favor, insira um e-mail válido",
      "any.required": "O e-mail é obrigatório",
    }),

    password: Joi.string().required().messages({
      "string.empty": "Senha é obrigatória",
      "any.required": "A senha é obrigatória",
    }),
  });

  static refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
      "string.empty": "Refresh token é obrigatório",
      "any.required": "O token de atualização é obrigatório",
    }),
  });

  static forgotPasswordSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).lowercase().trim().required().messages({
      "string.base": "O e-mail deve ser um texto",
      "string.empty": "O e-mail é obrigatório",
      "string.email": "Por favor, insira um e-mail válido",
      "any.required": "O e-mail é obrigatório",
    }),
  });

  static resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
      "string.empty": "O token de recuperação é obrigatório",
      "any.required": "O token de recuperação é obrigatório",
    }),

    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        "string.base": "A senha deve ser um texto",
        "string.empty": "A nova senha é obrigatória",
        "string.min": "A senha deve ter pelo menos {#limit} caracteres",
        "string.max": "A senha deve ter no máximo {#limit} caracteres",
        "string.pattern.base":
          "A senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (@$!%*?&)",
        "any.required": "A nova senha é obrigatória",
      }),

    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": "As senhas não coincidem",
      "any.required": "A confirmação de senha é obrigatória",
    }),
  });

  static profileUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(100).trim().messages({
      "string.base": "O nome deve ser um texto",
      "string.min": "O nome deve ter pelo menos {#limit} caracteres",
      "string.max": "O nome deve ter no máximo {#limit} caracteres",
    }),

    lastName: Joi.string().max(100).trim().allow("", null).messages({
      "string.base": "O sobrenome deve ser um texto",
      "string.max": "O sobrenome deve ter no máximo {#limit} caracteres",
    }),

    cpf: Joi.string()
      .pattern(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
      .allow("", null)
      .messages({
        "string.pattern.base": "CPF inválido. Use o formato 000.000.000-00 ou apenas números",
      }),

    phone: Joi.string()
      .pattern(/^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-\d{4}$/)
      .allow("", null)
      .messages({
        "string.pattern.base": "Telefone inválido. Use o formato (00) 00000-0000",
      }),

    gender: Joi.string()
      .valid("Masculino", "Feminino", "Outro", "Prefiro não informar")
      .allow("", null)
      .messages({
        "any.only": "Gênero inválido",
      }),

    birthDate: Joi.date().max("now").allow("", null).messages({
      "date.base": "Data de nascimento inválida",
      "date.max": "A data de nascimento não pode ser no futuro",
    }),
  });

  static formatValidationErrors(error) {
    return error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
      type: detail.type,
    }));
  }
}
