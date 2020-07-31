const express = require('express');
const commentRouter = express.Router();

const Meeting = require('./../models/meeting');
const Comments = require('./../models/comments');
const { Router } = require('express');

//POST
commentRouter.post('/:id/comment', (req, res, next) => {
    const { comment } = req.body;
    const user = req.session.currentUser;
    const event = req.params.id
    Comments.create( { user, event, comment } )
    .then( (theComment) => {
        Meeting.findByIdAndUpdate( event, {$push:{commentArray:theComment}} )
        .then( () => {
            res.redirect(`/${event}`)
        }) 
    })
    .catch( (error) => {
        console.log('Error while editing the meeting info ', error);
    })
})

module.exports = commentRouter;
