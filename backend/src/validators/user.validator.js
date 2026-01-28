import Joi from "joi";

export const userValidators = {
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100).trim().messages({
      "string.min": "Nome deve ter pelo menos 2 caracteres",
      "string.max": "Nome deve ter no máximo 100 caracteres",
    }),

    lastName: Joi.string().min(2).max(100).trim().allow("").messages({
      "string.min": "Sobrenome deve ter pelo menos 2 caracteres",
      "string.max": "Sobrenome deve ter no máximo 100 caracteres",
    }),

    cpf: Joi.string()
      .pattern(/^\d{11}$/)
      .allow("")
      .messages({
        "string.pattern.base": "CPF deve conter exatamente 11 dígitos numéricos",
      }),

    phone: Joi.string()
      .pattern(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/)
      .allow("")
      .messages({
        "string.pattern.base": "Telefone deve estar no formato (XX) XXXXX-XXXX",
      }),

    gender: Joi.string()
      .valid("masculino", "feminino", "outro", "prefiro_nao_informar", "")
      .messages({
        "any.only": "Gênero inválido",
      }),

    birthDate: Joi.date().max("now").allow(null).messages({
      "date.max": "Data de nascimento não pode ser no futuro",
    }),
  }),
};

export const validateUpdateProfile = (req, res, next) => {
  const { error, value } = userValidators.updateProfile.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path[0],
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Erro de validação",
      errors,
    });
  }

  req.body = value;
  next();
};
