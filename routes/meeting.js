const express = require('express');
const authRouter = express.Router();

const meeting = require('./../models/meeting');
const { Router } = require('express');

//              >> PAGINA PRINCIPAL MEETINGS (GET)
//GET
//nos renderiza la pagina 'MEETINGS' con todos los meetings que hay disponibles. 
authRouter.get('/meetings', (req, res, next) => {
    res.render('meeting/meetings');
})

//              >> PAGINA CREATE A NEW MEETING (GET & POST)
//GET
//nos renderiza la pagina donde se encontrará el formulario para CREAR NUEVO meeting.
authRouter.get('/createMeeting', (req, res, next) => {
    res.render('meeting/createMeeting');
})

authRouter.get('/myPendingMeetings', (req, res, next) => {
    res.render('meeting/myPendingMeetings');
})

//POST
//toma los datos que se encuentran en el formulario de la pagina 'CREATE MEETING'.
authRouter.post('/createMeeting', (req, res, next) => {
    const { meetingName, meetingDescription, meetingLanguage, meetingDate, meetingPoint, meetingOrganizer } = req.body;
    const newMeeting = new meeting({ meetingName, meetingDescription, meetingLanguage, meetingDate, meetingPoint, meetingOrganizer })
    newMeeting.save()
    .then( (newMeet) => {
        console.log('A new meeting was created ', newMeet);
        res.redirect('/meet/myPendingMeetings');
    })
    .catch( (error) => {
        console.log('Error while adding a new meeting to the DB ', error);
        //preguntar esto, como hacemos para mostrarle un mensaje al usuario >>
        //res.render('meeting/createMeeting');
    })
});

//              >> PAGINA DELETE MEETING (POST)
//POST
//toma los datos del boton cuando borra un meeting y redirecciona a pagina principal de meetings.
authRouter.post('/:id/delete', (req, res, next) => {
    Meeting.findOneAndDelete(req.params.id)
    .then( (deleteMeeting) => {
        res.redirect('meeting/meetings', { deleteMeeting })
    })
    .catch( (error) => {
        console.log('Error while deleting the meeting from the DB ', error);
    })
})


//              >> PAGINA EDIT MEETING (GET & POST)
//GET 
//nos renderiza la pagina en donde se encontraran los campos par editar.
authRouter.get('/:id/editMeeting', (req, res, next) => {
    Meeting.findById(req.params.id)
    .then( (editMeeting) => {
        console.log(editMeeting)
        res.render('meeting/editMeeting');
    })
    .catch( (error) => {
        console.log('Error while editing the meeting ', error);
    })
})

//POST
//toma los datos que se encuentran en el formulario de la pagina 'EDIT MEETING'.
authRouter.post('/:id/editMeeting', (req, res, next) => {
    const { meetingName, meetingDescription, meetingLanguage, meetingDate, meetingPoint, meetingOrganizer } = req.body;
    Meeting.update( {_id:req.params.id}, { meetingName, meetingDescription, meetingLanguage, meetingDate, meetingPoint, meetingOrganizer } )
    .then( (editMeeting) => {
        console.log(editMeeting)
        res.redirect('meeting/myPendingMeetings');
    })
    .catch( (error) => {
        console.log('Error while editing the meeting info ', error);
    })
})

//              >> PAGINA MEETING DETAILS (GET)
//GET
//nos renderiza un evento en especifico que buscamos con el id.
authRouter.get('/:id', (req, res, next) => {
    Meeting.findById(req.params.id)
    .then( (theMeeting) => {
        console.log(theMeeting)
        res.render('meeting/meetingDetails', { theMeeting })
    })
})

module.exports = authRouter;
