const express = require('express');
const authRouter = express.Router();

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const User = require('./../models/user');
const { Router } = require('express');

// GET /signup ===> renderizar el formulario de signup
authRouter.get('/signup', (req, res, next) => {
  // console.log('Entra en signup');
  res.render('auth/signup', { errorMessage: '' });
})

// POST /signup ===> recoger los datos del formulario y crear un nuevo usuario en la BDD
// con PROMISES
// authRouter.post('/signup', (req, res, next) => {
//   console.log('req.body', req.body);
//   const { name, email, password } = req.body;

//   // Comprobar que los campos email y password no esten en blanco
//   if(email === "" || password === "") {
//     res.render('auth/signup', { errorMessage: "Enter both email and password "});
//     return;
//   }

//   // Comprobar que no existe ningun usuario con este email en la BDD
//   User.findOne({ email })
//   .then( (foundUser) => {
//     if(foundUser) {
//       res.render('auth/signup', { errorMessage: `There's already an account with the email ${email}`});
//       return;
//     }

//     // no existe el usuario, encriptar la contraseña
//     const salt = bcrypt.genSaltSync(saltRounds);
//     const hashedPassword = bcrypt.hashSync(password, salt);

//     // guardar el usuario en la BDD
//     // const newUser = { name, email, password: hashedPassword };
//     User.create({ name, email, password: hashedPassword })
//     .then( () => {
//       res.redirect('/login');
//     })
//     .catch( (err) => {
//       res.render('auth/signup', { errorMessage: "Error while creating account. Please try again."})
//     });
//   })
//   .catch( (err) => console.log(err));
// })

// POST /signup ===> recoger los datos del formulario y crear un nuevo usuario en la BDD
// con ASYNC AWAIT
authRouter.post('/signup', async (req, res, next) => {
  console.log('req.body', req.body);
  const { name, email, password } = req.body;

  // Comprobar que los campos email y password no esten en blanco
  if(email === "" || password === "") {
    res.render('auth/signup', { errorMessage: "Enter both email and password "});
    return;
  }

  try {
      // Comprobar que no existe ningun usuario con este email en la BDD
    const foundUser = await User.findOne({ email })
    if(foundUser) {
      res.render('auth/signup', { errorMessage: `There's already an account with the email ${email}`});
      return;
    }

    // no existe el usuario, encriptar la contraseña
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // guardar el usuario en la BDD
    await User.create({ name, email, password: hashedPassword })
    res.redirect('/login');
  } 
  catch (error) {
    res.render('auth/signup', { errorMessage: "Error while creating account. Please try again."})
  }
})

// GET /login ===> renderizar el formulario de signup
authRouter.get('/login', (req, res, next) => {
    res.render('auth/login', {
      errorMessage: ''
    });
});
  
// POST /login ===> renderizar el formulario de login
authRouter.post('/login', async (req, res, next) => {
    const emailInput = req.body.email;
    const passwordInput = req.body.password;

    if (emailInput === '' || passwordInput === '') {
        res.render('auth/login', { errorMessage: 'Enter both email and password to log in.' });
        return;
    }

    try {
        //conseguimos el usuario para verificar el email. 
        const findUser = await User.findOne({ email: emailInput })
        if(findUser === null) {
            res.render('auth/login', { errorMessage: `There isn't an account with email ${emailInput}.` })
            return;
        }
        //conseguimos el usuario para verificar la contraseña
        const passwordCorrect = bcrypt.compareSync(passwordInput, findUser.password);
        if(!passwordCorrect) {
            res.render('auth/login', { errorMessage: 'Invalid password.' });
            return;
        }
        req.session.currentUser = findUser;
        res.redirect('/');
    }
    catch (error) {
        res.render('auth/login', { errorMessage: 'error' } );
    }
     
});

// GET /logout ===> renderizar log out.
authRouter.get('/logout', (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/');
        return;
    }

    req.session.destroy((err) => {
        if (err) {
            next(err);
            return;
        }

        res.redirect('/');
    });
});

module.exports = authRouter;