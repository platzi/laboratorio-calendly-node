const User = require('./../database/entities/user.entity');

class UserService {
  create(data) {
    const newUser = new User(data);
    return newUser.save();
  }

  getAll() {
    return User.find();
  }

  getById(id) {
    return User.findById(id);
  }

  update(id, changes) {
    return User.findByIdAndUpdate(id, changes, { upsert: true, new: true });
  }
}

module.exports = UserService;
