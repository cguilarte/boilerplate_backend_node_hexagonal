class userRepository {
  constructor({ userModel }) {
    this._user = userModel;
  }

  async getMaxUserId() {
    return await new this._user().sort({ id: 1 }).limit(1);
  }

  async getUserAccount(email) {
    return await this._user.findOne({
      email: email,
      status: true,
      deleted: false,
    });
  }

  async addUserAccount(userData) {
    return await new this._user()(userData).save();
  }

  async verifyCode(email, code) {
    return await this._user.findOne({
      verify_code: `${code}`,
      email: `${email}`,
    });
  }

  async updateUser(dataUpdate, email) {
    return await this._user.findOneAndUpdate({ email: `${email}` }, dataUpdate);
  }
}

module.exports = userRepository;
