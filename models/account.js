'use strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const salt = bcrypt.genSaltSync(parseInt(process.env.DB_SALT));

module.exports = (db, Sequelize) => {
  var Account = db.define('Account', {
    firstName: {
      field: 'first_name',
      type: Sequelize.STRING(100),
      allowNull: false
    },
    lastName: {
      field: 'last_name',
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      set: function(email) {
        this.setDataValue('email', email.toLowerCase())
      }
    },
    passwordHash: {
      field: 'password_hash',
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.VIRTUAL,
      set: function(password) {
        this.setDataValue('password', password)
        // TODO: Use async to optimize hashing
        this.setDataValue('passwordHash', bcrypt.hashSync(password, salt))
      },
      validate: {
        isLongEnough: (password) => {
          if (password.length < 7) {
            throw new Error('Please choose a longer password')
          }
        }
      }
    },
    passwordToken: {
      field: 'password_token',
      type: Sequelize.STRING
    },
    confirmationToken: {
      field: 'confirmation_token',
      type: Sequelize.STRING,
      defaultValue: () => {
        return bcrypt.hashSync(String(Math.floor(new Date() / 1000)), salt) // Unix timestamp
      }
    },
    createdAt: {
      field: 'created_at',
      type: Sequelize.DATE
    },
    updatedAt: {
      field: 'updated_at',
      type: Sequelize.DATE
    }
  }, {
    tableName: 'accounts'
  })

  Account.associate = (models) => {}
  Account.findAccount = (email, password) => {
    return Account.findOne({where: { email: email.toLowerCase() }})
      .then(account => {
        // TODO: Use async to optimize hashing
        const passwordMatch = bcrypt.compareSync(password, account.passwordHash)
        if(passwordMatch) return (null, account)
        return ('No account found', null)
      })
      .catch((err) => {return (err, null)})
  }
  Account.generatePasswordToken = (email) => {
    const receiverEmail = email.toLowerCase()
    return Account.findOne({where: {email: receiverEmail}})
    .then(account => {
      const token = jwt.sign({data: receiverEmail}, process.env.SECRET)
      const transporter = nodemailer.createTransport(`smtps://${process.env.EMAIL}:${process.env.EMAIL_PASSWORD}@smtp.gmail.com`)
      const html = `
      <h1> Reset your password? </h1>
      <p>
        Please go to ${process.env.DOMAIN_NAME}/resetPassword?token=${token}
        reset your password
      </p>
      `
      const mailOptions = {
        from: process.env.EMAIL,
        to: receiverEmail,
        subject: 'Megaphone password reset',
        html: html
      }

      transporter.sendMail(mailOptions)
      account.update({passwordToken: token})
      return (null, token)
    })
  }
  Account.verifyPasswordToken = (token) => {
    // TODO: Use async to verify token to better optimize
    const verified = jwt.verify(token, process.env.SECRET)
    if (verified) return Promise.resolve(verified)
    return Promise.reject('Token was invalid!')
  }
  Account.sendEmailConfirmation = (email) => {
    const receiverEmail = email.toLowerCase()
    return Account.findOne({where: {email: receiverEmail}})
    .then((account) => {
      const token = jwt.sign({data: receiverEmail}, process.env.SECRET)
      const transporter = nodemailer.createTransport(`smtps://${process.env.EMAIL}:${process.env.EMAIL_PASSWORD}@smtp.gmail.com`)
      const html = `
      <h1> Email confirmation </h1>
      <p>
        Confirm your account by going to
        ${process.env.DOMAIN_NAME}/emailVerify?confirmation=${account.confirmationToken}
      </p>
      `
      const mailOptions = {
        from: process.env.EMAIL,
        to: receiverEmail,
        subject: 'Megaphone confirm email',
        html: html
      }
      transporter.sendMail(mailOptions)
      return (null, token)
    })
  }
  return Account
}
