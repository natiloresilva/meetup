const express = require('express');
const profileRouter = express.Router();

const User = require('./../models/user');
const { Router } = require('express');

const parser = require('./../config/cloudinary');

//              >> PAGINA PROFILE (GET & POST)
//GET 
//nos renderiza la pagina en donde se encontraran los campos para editar.
profileRouter.get('/:id/editProfile', (req, res, next) => {
    User.findById(req.params.id)
    .then( (editProfile) => {
        console.log(editProfile)
        res.json({editProfile});
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
        res.json({editProfile});
    })
    .catch( (error) => {
        console.log('Error while editing the profile ', error);
    })
})


module.exports = profileRouter;