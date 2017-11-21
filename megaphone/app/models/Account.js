'use strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const salt = bcrypt.genSaltSync(parseInt(process.env.DB_SALT));

module.exports = (db, Sequelize) => {
  var Account = db.define('Account', {
    stripeId: {
      field: 'stripe_id',
      type: Sequelize.INTEGER
    },
    firstName: {
      field: 'first_name',
      type: Sequelize.STRING
    },
    lastName: {
      field: 'last_name',
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      unique: {args: true, msg: 'This email is already taken'}
    },
    isEmailVerified: {
      field: 'is_email_verified',
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    passwordHash: {
      field: 'password_hash',
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.VIRTUAL,
      set: function(password) {
        this.setDataValue('password', password)
        // TODO: Use async to optimize hashing
        this.setDataValue('passwordHash', bcrypt.hashSync(password, salt))
      }
    },
    passwordToken: {
      field: 'password_token',
      type: Sequelize.STRING
    },
    verificationToken: {
      field: 'verification_token',
      type: Sequelize.STRING,
      defaultValue: jwt.sign({data: String(Math.floor(new Date() / 1000))}, process.env.SECRET)
    },
    verificationTokenExpiresAt: {
      field: 'verification_token_expires_at',
      type: Sequelize.DATE,
      defaultValue: () => {
        var tomorrow = new Date()
        return tomorrow.setDate(tomorrow.getDate() + 1)
      }
    },
    lastLoginAt: {
      field: 'last_login_at',
      type: Sequelize.DATE,
      defaultValue: () => {
        var today = new Date()
        return today.setDate(today.getDate())
      }
    }
  }, {
    tableName: 'accounts',
    underscored: true
  })

  Account.associate = (models) => {
    Account.hasMany(models.Social, {'foreignKey': 'accountId'})
  }
  Account.findAccount = (email, password) => {
    return Account.findOne({where: { email: email.toLowerCase() }})
      .then(account => {
        // TODO: Use async to optimize hashing
        const passwordMatch = bcrypt.compareSync(password, account.passwordHash)
        if(passwordMatch) return (null, account)
        return (new Error(404), null)
      })
      .catch(err => {
        return (err, null)
      })
  }
  Account.emailPasswordToken = (email, host) => {
    const receiverEmail = email.toLowerCase()
    return Account.findOne({where: {email: receiverEmail}})
    .then(account => {
      const token = jwt.sign({data: receiverEmail}, process.env.SECRET)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD}
      })
      const html = `
      <p>
        Hi ${account.firstName},
        <br>
        <br>
        Someone recently requested a password change for your Megaphone account.
        If this was you, you can set a new password here:
        <br>
        <br>
        <a href='http://${host}/verifypasswordtoken/${token}'>Reset password</a>
        <br>
        <br>
        If you don't want to change your password or didn't request this, just
        ignore and delete this message.
        <br>
        <br>
        To keep your account secure, please don't forward this email to anyone.
        <br>
        <br>
        Happy Megaphoning!
      </p>
      `
      const mailOptions = {
        from: process.env.EMAIL,
        to: receiverEmail,
        subject: 'Reset your Megaphone password',
        html: html
      }

      transporter.sendMail(mailOptions)
      account.update({passwordToken: token})
      return (null, token)
    })
    .catch(err => {
      return (err, null)
    })
  }
  Account.verifyToken = (token) => {
    // TODO: Use async to verify token to better optimize
    try {
      const verified = jwt.verify(token, process.env.SECRET)
      return Promise.resolve(verified)
    } catch(err) {
      // 404 is returned so user gets redirected to a 404 page
      return Promise.reject(new Error(404))
    }
  }
  Account.emailVerificationToken = (email, host) => {
    const receiverEmail = email.toLowerCase()
    return Account.findOne({where: {email: receiverEmail}})
    .then(account => {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD}
      })
      const html = `
      <p>
        Hi ${account.firstName},
        <br>
        <br>
        We just need you to verify your email address before you can manage your
        social media.
        <br>
        <br>
        <a href='http://${host}/verifyverificationtoken/${account.verificationToken}'>Verify your email</a>
        <br>
        <br>
        Thanks!
        <br>
        - The Megaphone Team
      </p>
      `
      const mailOptions = {
        from: process.env.EMAIL,
        to: receiverEmail,
        subject: 'Please verify your email',
        html: html
      }
      transporter.sendMail(mailOptions)
      return (null, account.verificationToken)
    })
    .catch(err => {
      return (err, null)
    })
  }
  return Account
}