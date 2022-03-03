import nodemailer from 'nodemailer';
import Email from 'email-templates';
import {
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASSWORD,
} from '../config/env';

import path from 'path';

const pathTemplate = path.join(__dirname, '..', 'templates/mails/');

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

const email = new Email({
  transport: transporter,
  send: true,
  preview: false,
  views: {
    root: `${pathTemplate}`,
    options: {
      extension: 'twig',
    },
  },
});

module.exports = email;
