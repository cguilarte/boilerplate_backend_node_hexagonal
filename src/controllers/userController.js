class userController {
  constructor({ userService }) {
    this.userService = userService;
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const { error, response } = await this.userService.verificarCuenta(
        email,
        password,
      );

      if (error) {
        res.status(400).json({
          code: response.code,
          message: response.message,
        });
      }

      res.status(200).json({
        response,
      });
    } catch (error) {
      next(error);
    }
  }

  async signup(req, res, next) {
    try {
      console.log(res.body);

      const { error, response } = await this.userService.addUser(req.body);

      if (error) {
        res.status(400).json({
          code: response.code,
          message: response.message,
        });
      }

      res.status(201).json({ response });
    } catch (error) {
      next(error);
    }
  }

  async verifyAccount(req, res, next) {
    try {
      const { email, code } = req.body;

      const { error, response } = await this.userService.verifyAccount(
        email,
        code,
      );

      if (error) {
        res.status(400).json({
          code: response.code,
          message: response.message,
        });
      }

      res.status(200).json({ response });
    } catch (error) {
      next(error);
    }
  }

  async recoveryAccount(req, res, next) {
    try {
      const { email } = req.body;

      const { error, response } = await this.userService.recoveryAccount(email);

      if (error) {
        res.status(400).json({
          code: response.code,
          message: response.message,
        });
      }

      res.status(201).json({ response });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { email, newPassword } = req.body;

      const { error, response } = await this.userService.changePassword(
        email,
        newPassword,
      );

      if (error) {
        res.status(400).json({
          code: response.code,
          message: response.message,
        });
      }

      res.status(201).json({ response });
    } catch (error) {
      next(error);
    }
  }

  async getTokens(req, res, next) {
    try {
      const lista = await this.userService.getTokens();

      res.status(200).json({
        status: {
          code: 200,
          lista: lista,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;
