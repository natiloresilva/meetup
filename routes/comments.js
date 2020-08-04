const express = require('express');
const commentRouter = express.Router();

const Meeting = require('./../models/meeting');
const Comment = require('./../models/comments');
const { Router } = require('express');

//              >> PAGINA MEETING DETAILS (POST)
//POST
//toma los datos que se encuentran en el formulario de la pagina 'MEETING DETAILS' y guarda un comentario.
commentRouter.post('/:id/comment', (req, res, next) => {
    const { comment } = req.body;
    const user = req.session.currentUser._id;
    const event = req.params.id
   Comment.create( { user, event, comment } )
    .then( (theComment) => {
        console.log(theComment)
        Meeting.findByIdAndUpdate( event, {$push:{commentArray:theComment}} )
        .then( () => {
            res.redirect(`/meet/meetings/${event}`)
        }) 
    })
    .catch( (error) => {
        console.log('Error while editing the meeting info ', error);
    })
})

module.exports = commentRouter;
