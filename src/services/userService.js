import jwt from 'jsonwebtoken';
import path from 'path';
import { APPLICATION_NAME } from '../config/env';
import bcrypt from 'bcryptjs';
import { passworBcrypt, codeVerify } from '../helpers/utils';
import moment from 'moment';
import fs from 'fs';

const pathKey = path.join(__dirname, '..', '..', 'keys/');

class userService {
  constructor({ userRepository, mail, logger }) {
    this._repository = userRepository;
    this.mail = mail;
    this.logger = logger;
  }

  async verificarCuenta(email, password) {
    // eslint-disable-next-line no-useless-catch
    try {
      const userData = await this._repository.getUserAccount(email);
      if (userData != null) {
        // Validamos que el usario ya este verificado
        if (!userData.verified_account) {
          return {
            error: true,
            response: {
              code: 'EUSER001',
              message: 'La cuenta aun no esta verificada.',
            },
          };
        }

        const isPassword = await bcrypt.compare(password, userData.password);

        if (isPassword) {
          userData.password = undefined;
          const PRIVATE_KEY = fs.readFileSync(
            `${pathKey}PC_IO_private_key.pem`,
            'utf8',
          );
          const signOption = {
            issuer: process.env.JWT_issuer,
            subject: process.env.JWT_subject,
            audience: process.env.JWT_audience,
            expiresIn: process.env.JWT_expiresIn,
            algorithm: process.env.JWT_algorithms,
          };
          const token = jwt.sign({ user: userData }, PRIVATE_KEY, signOption);

          return {
            error: false,
            response: {
              user_id: userData.id,
              name: userData.name,
              email: userData.email,
              auth_token: token,
              type_token: 'Bearer',
            },
          };
        } else {
          return {
            error: true,
            response: {
              code: 'EUSER002',
              message: 'Contraseña incorrecta',
            },
          };
        }
      } else {
        return {
          error: true,
          response: {
            code: 'EUSER003',
            message: 'Usuario no registrado',
          },
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async addUser(user) {
    // eslint-disable-next-line no-useless-catch
    try {
      const verifyUser = await this._repository.getUserAccount(user.email);

      if (verifyUser.length === 0) {
        const codeMail = codeVerify();

        const userData = {
          name: user.name,
          email: user.email,
          password: await passworBcrypt(user.password),
          status: true,
          deleted: false,
          verify_code: codeMail,
          verified_account: 0,
          createdAt: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        };

        const addUser = await this._repository.addUserAccount(userData);

        if (addUser) {
          try {
            await this.mail.send({
              template: 'register',
              message: {
                from: `${APPLICATION_NAME} <no-reply@blog.com>`,
                to: user.email,
              },
              locals: {
                code: codeMail,
              },
            });
          } catch (error) {
            this.logger.error(error);
          }

          return {
            error: false,
            response: {
              userId: addUser.id,
              name: user.name,
              email: user.email,
            },
          };
        } else {
          return {
            error: true,
            response: {
              code: 'EUSER004',
              message: 'Error al intentar registrar la cuenta',
            },
          };
        }
      } else {
        return {
          error: true,
          response: {
            code: 'EUSER005',
            message: 'El usuario ya se encuentra registrado.',
          },
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyAccount(email, code) {
    // eslint-disable-next-line no-useless-catch
    try {
      let error = false;
      let message = 'Cuenta verificada con exito';
      let codeStatus = 'SUSER006';

      const validarCode = await this._repository.verifyCode(email, code);

      if (validarCode) {
        const dataUpdate = {
          verify_code: '',
          verified_account: 1,
        };
        await this._repository.updateUser(dataUpdate, email);
      } else {
        codeStatus = 'EUSER007';
        error = true;
        message = 'Codigo de verificación incorrecta.';
      }

      return {
        error: error,
        response: {
          code: codeStatus,
          message: message,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async recoveryAccount(email) {
    // eslint-disable-next-line no-useless-catch
    try {
      let error = false;
      let message = 'Mail valido para cambio de contraseña';
      let codeStatus = 'SUSER008';

      const validarMail = await this._repository.getUserAccount(email);

      if (validarMail) {
        const codeChangePassword = codeVerify();

        const dataUpdate = {
          code_change_password: codeChangePassword,
        };

        await this._repository.updateUser(dataUpdate, email);

        this.mail.send({
          template: 'recovery',
          message: {
            from: `${APPLICATION_NAME} <no-reply@blog.com>`,
            to: email,
          },
          locals: {
            code: codeChangePassword,
          },
        });
      } else {
        codeStatus = 'EUSER009';
        error = true;
        message = 'Cuenta no encontrada / mail no se cuentra registrado';
      }

      return {
        error: error,
        response: {
          code: codeStatus,
          message: message,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async changePassword(email, newPassword) {
    // eslint-disable-next-line no-useless-catch
    try {
      let error = false;
      let message = 'Contraseña cambiada con exito.';
      let codeStatus = 'SUSER0010';

      const validarMail = await this._repository.getUserAccount(email);

      if (validarMail) {
        const dataUpdate = {
          password: await passworBcrypt(newPassword),
        };

        await this._repository.updateUser(dataUpdate, email);
      } else {
        codeStatus = 'EUSER0011';
        error = true;
        message = 'Mail no encontrado';
      }

      return {
        error: error,
        response: {
          code: codeStatus,
          message: message,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = userService;
