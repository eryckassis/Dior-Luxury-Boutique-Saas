import { ApiResponse } from "../utils/response.js";
import { AuthValidator } from "../validators/auth.validator.js";

export class ValidationMiddleware {
  static validate(schema) {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const errors = AuthValidator.formatValidationErrors(error);
        return ApiResponse.validationError(res, errors);
      }

      req.body = value;
      next();
    };
  }

  static validateRegister(req, res, next) {
    return ValidationMiddleware.validate(AuthValidator.registerSchema)(
      req,
      res,
      next,
    );
  }

  static validateLogin(req, res, next) {
    return ValidationMiddleware.validate(AuthValidator.loginSchema)(
      req,
      res,
      next,
    );
  }

  static validateRefreshToken(req, res, next) {
    return ValidationMiddleware.validate(AuthValidator.refreshTokenSchema)(
      req,
      res,
      next,
    );
  }

  static validateForgotPassword(req, res, next) {
    return ValidationMiddleware.validate(AuthValidator.forgotPasswordSchema)(
      req,
      res,
      next,
    );
  }

  static validateResetPassword(req, res, next) {
    return ValidationMiddleware.validate(AuthValidator.resetPasswordSchema)(
      req,
      res,
      next,
    );
  }

  static validateProfileUpdate(req, res, next) {
    return ValidationMiddleware.validate(AuthValidator.profileUpdateSchema)(
      req,
      res,
      next,
    );
  }
}
