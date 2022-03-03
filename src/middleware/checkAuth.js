import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import {
  JWTIssuer,
  JWTSubject,
  JWTAudience,
  JWTExpiresIn,
  JWTAlgorithms,
} from '../config/env';

const pathKey = path.join(__dirname, '..', '..', 'keys/');

module.exports = () => {
  return (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).send({
        status: true,
        message: 'api key required',
      });
    }
    const token = req.headers.authorization.split(' ')[1];
    const PUBLIC_KEY = fs.readFileSync(
      `${pathKey}PC_IO_public_key.pem`,
      'utf8',
    );
    const verifyOptions = {
      issuer: JWTIssuer,
      subject: JWTSubject,
      audience: JWTAudience,
      maxAge: JWTExpiresIn,
      algorithms: JWTAlgorithms,
    };

    jwt.verify(token, PUBLIC_KEY, verifyOptions, (err) => {
      if (err) {
        // En caso de que el token sea invalido y/o este expirado
        return res.status(401).send({
          status: false,
          message: 'Recurso protegido, token caducado',
        });
      }

      next(); // Le permitimos el acceso a la API
    });
  };
};
