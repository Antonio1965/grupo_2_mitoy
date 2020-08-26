//const fs = require('fs');
//const path = require('path');

const bcrypt = require('bcrypt');
const { check, validationResult, body } = require('express-validator');
const db = require('../database/models');


//usuarios = fs.readFileSync(path.join(__dirname, '../database/usuarios.json'), 'utf8');
//detallesUsuarios = fs.readFileSync(path.join(__dirname, '../database/detallesUsuarios.json'), 'utf8');
//usuarios = JSON.parse(usuarios);
//detallesUsuarios = JSON.parse(detallesUsuarios);

module.exports = {
  register: function (req, res) {
    res.render('register');
  },
  save: function (req, res, next) {
    //console.log(validationResult(req));
    //res.send(validationResult(req));
    let errors = validationResult(req);
    if (errors.isEmpty()) {
      db.User.create({
        name: null,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        phone: null,
        street: null,
        gender: null,
        avatar: null,
        group_id: 1,
        active: 0,
        remember_token: '12345678',
        createdAt: new Date(),
        updatedAt: new Date()
      })
        .then(function (resultado) {       
          res.redirect('/users/login');
        });
      }else {
        res.render('register', {
          errors: errors.mapped(),
          old: req.body
        });
      }
  },
  login: function (req, res) {
    res.render('login')
  },
  verify: function (req, res) {

    let errors = validationResult(req);
    console.log(req.body.email);
    db.User.findAll()
      .then(function (usuarios) {
        if (errors.isEmpty()) {
          for (let i = 0; i < usuarios.length; i++) {
            if (usuarios[i].email == req.body.email && bcrypt.compareSync(req.body.password, usuarios[i].password)) {
              req.session.emailUsuario = usuarios[i].email;
              if (req.body.remember != undefined) {
                res.cookie('authRemember', usuarios[i].email, { maxAge: 60000 * 8 });
              }
              return res.redirect('/')
            }
          }
          return res.render('login', {
            errors: {
              email: {
                msg: 'Credenciales inválidas. Inserta un email registrado y su respectiva contraseña'
              }
            }
          })
        } else {
          res.render('login', {
            errors: errors.mapped(),
            old: req.body
          })
        }
      }
      )

  },
  welcome: function (req, res, next) {
    res.render('welcome', { usuario: req.session.emailUsuario });
  },

  logout: function (req, res, next) {
    req.session.destroy();
    res.cookie('authRemember', '', { maxAge: 60000 * 0 });
    res.redirect('/users/login');
  },

  editLogin: function (req, res) {
    res.render('edit-login')
  },

  verifyedit: function (req, res) {

    /*       console.log('llegamos hasta aca');

           for(let i = 0; i < usuarios.length; i++) {
               if(usuarios[i].email == req.body.email && bcrypt.compareSync(req.body.password, usuarios[i].password)) {
                   req.session.emailUsuario = usuarios[i].email;
               
                   console.log ('usuario encontrado');
                   return res.redirect ('edit');
               }
           }
           return res.redirect ('register');  */
  },

  accessEditUser: function (req, res) {
    res.render('edit-user');
  },

  editUser: function (req, res) {
        let nuevoDetalleUsuario = {
            email: req.body.email,
            nombreUsuario: req.body.nombreUsuario,
            fechaNacimiento: req.body.fechaNacimiento,
            sexo: req.body.sexo,
            nosConociste: req.body.nosConociste
        }
            
        detallesUsuarios.push(nuevoDetalleUsuario);
        fs.writeFileSync(path.join(__dirname, '../database/detallesUsuarios.json'), JSON.stringify(detallesUsuarios));

        return res.redirect('editsuccess');
  },

  editsuccess: function (req, res) {
    res.render('edit-success');
  }
}
