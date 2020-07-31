const express = require('express');
const profileRouter = express.Router();

const User = require('./../models/user');
const { Router } = require('express');

const parser = require('./../config/cloudinary');

//              >> PAGINA PROFILE (GET)
//GET 
//nos renderiza la pagina en donde se vera el perfil.
profileRouter.get('/:id/profile', (req, res, next) => {
    User.find()
    .then( (profile) => {
        res.render('user/profile', profile);
    })
    .catch( (error) => {
        console.log('Error while showing the profile ', error);
    })
})

//              >> PAGINA PROFILE (GET & PATCH)
//GET 
//nos renderiza la pagina en donde se encontraran los campos para editar.
profileRouter.get('/:id/editProfile', (req, res, next) => {
    User.findById(req.params.id)
    .then( (editProfile) => {
        console.log(editProfile)
        res.render('user/editUser', editProfile);
    })
    .catch( (error) => {
        console.log('Error while showing the profile ', error);
    })
})

//PATCH
//toma los datos que se encuentran en el formulario de la pagina 'EDIT MEETING'.
//tiene que tener el mismo nombre el input del formulario. 
profileRouter.patch('/:id/editProfile', parser.single('profilepic'), (req, res, next) => {
    const { name, address, biography, languagesISpeak, iWantToLearn } = req.body;
    const image_url = req.file.secure_url;
    User.update( {_id:req.params.id}, { name, address, biography, profileImage:image_url, languagesISpeak, iWantToLearn } )
    .then( (editProfile) => {
        console.log(editProfile)
        res.render('user/profile', editProfile);
    })
    .catch( (error) => {
        console.log('Error while editing the profile ', error);
    })
})


module.exports = profileRouter;