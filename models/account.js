'use strict'

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const salt = bcrypt.genSaltSync(parseInt(process.env.DB_SALT));

module.exports = (db, Sequelize) => {
  var Account = db.define('Account', {
    firstName: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING(100),
      allowNull: false
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
    }
  })

  Account.associate = (models) => {}
  Account.findAccount = (email, password='nothing') => {
    return Account.findOne({where: { email: email.toLowerCase() }})
      .then((account) => {
        // TODO: Use async to optimize hashing
        if (password) {
          const passwordMatch = bcrypt.compareSync(password, account.passwordHash)
          if(passwordMatch) return (null, account)
        }
        return (null, account)
      })
      .catch((err) => {return (err, null)})
  }
  Account.generatePasswordToken = (email) => {
    return Account.findAccount(email).then((account) => {
      // TODO: Use async here
      const token = jwt.sign({data: email}, process.env.SECRET, {expiresIn: '30 days'})
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
        to: email,
        subject: 'Megaphone password reset',
        html: html
      }

      transporter.sendMail(mailOptions, (err, info) => {
        if(err) console.log(err)
      })

      return (null, token)
    }).catch((err) => {
      return (err, null)
    })
  }
  Account.verifyPasswordToken = (token) => {
    // TODO: Use async here
    const verified = jwt.verify(token, process.env.SECRET)
    if (verified) return Promise.resolve(verified)
    return Promise.reject('Token was invalid!')
  }
  return Account
}
