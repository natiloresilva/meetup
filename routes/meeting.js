const express = require('express');
const meetingRouter = express.Router();

const Meeting = require('./../models/meeting');
const Comments = require('./../models/comments');
const { Router } = require('express');

//              >> PAGINA PRINCIPAL MEETINGS (GET)
//GET
//nos renderiza la pagina 'MEETINGS' con todos los meetings que hay disponibles. 
meetingRouter.get('/meetings', (req, res, next) => {
    Meeting.find()
    .then((meetings) => {
        console.log(meetings);
        
        res.render('meeting/meetings', meetings);
    })
    .catch( (error) => {
        console.log('Error while listing the meetings from the DB ', error);
    })
});

//              >> BUSQUEDA POR CIUDAD. PAGINA PRINCIPAL MEETINGS (POST)
//POST
//toma los datos que se encuentran en el formulario de la pagina 'MEETINGS' para filtrar busqueda por ciudad.
meetingRouter.post('/meetings/search', (req, res, next) => {
    Meeting.findOne( {city: req.query.city} )
    .then( (meetings) => {
        res.render('meetings/meetings', meetings);
    })
    .catch( (error) => {
        console.log('Error while searching the meetings from the DB ', error);
    })
})

//              >> PAGINA CREATE A NEW MEETING (GET & POST)
//GET
//nos renderiza la pagina donde se encontrará el formulario para CREAR NUEVO meeting.
meetingRouter.get('/createMeeting', (req, res, next) => {
    res.render('meeting/createMeeting');
});

//POST
//toma los datos que se encuentran en el formulario de la pagina 'CREATE MEETING'.
meetingRouter.post('/createMeeting', (req, res, next) => {
    const { meetingName, meetingDescription, meetingLanguage, meetingDate, meetingPoint } = req.body;

    console.log(req.session.currentUser);
    

    const newMeeting = { 
        meetingName, 
        meetingDescription, 
        meetingLanguage, 
        meetingDate, 
        meetingPoint, 
        meetingOrganizer: req.session.currentUser._id
    };

    Meeting.create(newMeeting)
    .then( (newMeet) => {
        console.log('A new meeting was created ', newMeet);
        res.redirect('/meet/meetings');
    })
    .catch( (error) => {
        console.log('Error while adding a new meeting to the DB ', error);
        //preguntar esto, como hacemos para mostrarle un mensaje al usuario >>
        //res.render('meeting/createMeeting');
    })
});

//              >> PAGINA MY PENDING MEETINGS (GET)
//GET
meetingRouter.get('/myPendingMeetings', (req, res, next) => {
    Meeting.find()
    .then ( (myMeetings) => {
        res.render('meeting/myPendingMeetings', myMeetings);
    })
    .catch( (error) => {
        console.log('Error while listing my pending meetings from the DB ', error);
    })
});

//              >> PAGINA DELETE MEETING (POST)
//POST
//toma los datos del boton cuando borra un meeting y redirecciona a pagina principal de meetings.
//              cambiar metodo de post a delete
meetingRouter.post('/:id/delete', (req, res, next) => {
    Meeting.findOneAndDelete(req.params.id)
    .then( (deleteMeeting) => {
        res.redirect('meeting/meetings', { deleteMeeting })
    })
    .catch( (error) => {
        console.log('Error while deleting the meeting from the DB ', error);
    })
});


//              >> PAGINA EDIT MEETING (GET & POST)
//GET 
//nos renderiza la pagina en donde se encontraran los campos par editar.
meetingRouter.get('/:id/editMeeting', (req, res, next) => {
    Meeting.findById(req.params.id)
    .then( (editMeeting) => {
        console.log(editMeeting)
        res.render('meeting/editMeeting', editMeeting);
    })
    .catch( (error) => {
        console.log('Error while editing the meeting ', error);
    })
});

//PATCH
//toma los datos que se encuentran en el formulario de la pagina 'EDIT MEETING'.
meetingRouter.patch('/:id/edit', (req, res, next) => {
    const { meetingName, meetingDescription, meetingLanguage, meetingDate, meetingPoint, meetingOrganizer } = req.body;
    Meeting.update( {_id:req.params.id}, { meetingName, meetingDescription, meetingLanguage, meetingDate, meetingPoint, meetingOrganizer } )
    .then( (editMeeting) => {
        console.log(editMeeting)
        res.redirect('meeting/myPendingMeetings', editMeeting);
    })
    .catch( (error) => {
        console.log('Error while editing the meeting info ', error);
    })
})

//              >> PAGINA MEETING DETAILS (GET)
//GET
//nos renderiza un evento en especifico que buscamos con el id.
meetingRouter.get('/:id', (req, res, next) => {
    Meeting.findById(req.params.id)
    .then( (theMeeting) => {
        console.log(theMeeting)
        res.render('meeting/meetingDetails', theMeeting)
    })
})

module.exports = meetingRouter;
