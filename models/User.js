const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchemamm = new mongoose.Schema({
  user_firstName: {
    type: String,
    required: true,
  },
  user_lastName: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        // Regular expression to check if it's a valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: 'Invalid email format',
    },
  },
  user_username: {
    type: String,
    required: true,
    minlength: 6,
    match: /^[A-Za-z0-9_]+$/, // Allows letters, numbers, and underscores
    unique: true,
    immutable: true, // This makes the field read-only after initial creation
  },
  user_password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value) {
        // Check for at least one uppercase letter and one number
        return /[A-Z]+/.test(value) && /\d+/.test(value);
      },
      message:
        'Password must contain at least one uppercase letter and one number',
    },
  },
  user_birthDate: {
    type: Date,
    required: true,
  },
  user_Gender: {
    type: String,
    required: true,
  },
  user_weight: {
    type: Number,
    required: true,
  },
  user_height: {
    type: Number,
    required: true,
  },
  user_coin: {
    type: Number,
    default: 0,
  },
  user_status: {
    type: Number,
    default: 1,
  },
  user_rankingName: {
    type: String,
    default: 'beginner',
  },
  user_image: String,
});

UserSchemamm.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(this.user_password, salt);
    this.user_password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchemamm.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate(); // Get the update object
    if (update.user_password) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(update.user_password, salt);
      update.user_password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchemamm);
