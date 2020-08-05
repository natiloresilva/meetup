const express = require('express');
const meetingRouter = express.Router();

const Meeting = require('./../models/meeting');
const User = require('../models/user');
const Comments = require('./../models/comments');
const { Router } = require('express');

//              >> PAGINA PRINCIPAL MEETINGS (GET)
//GET
//nos renderiza la pagina 'MEETINGS' con todos los meetings que hay disponibles. 
meetingRouter.get('/meetings', (req, res) => {
    Meeting.find()
    .then((meetings) => {
        res.render('meeting/meetings', {
            meetings: meetings
        });
    })
    .catch( (error) => {
        console.log('Error while listing the meetings from the DB ', error);
    })
});

//              >> BUSQUEDA POR CIUDAD. PAGINA PRINCIPAL MEETINGS (POST)
//POST
//toma los datos que se encuentran en el formulario de la pagina 'MEETINGS' para filtrar busqueda por ciudad.
meetingRouter.get('/meetings/search', (req, res) => {
    console.log(req.query.meetingCity)
    //let meetingCity = req.query.meetingCity.charAt(0).toUpperCase() + req.query.meetingCity.slice(1).toLowerCase();
   // Meeting.find( {meetingCity: meetingCity} )
   Meeting.find({ "meetingCity" : { $regex : new RegExp(req.query.meetingCity, "i") } })
    .then( (meetings) => {
        console.log(meetings)
        res.render('meeting/meetings', {meetings});
    })
    .catch( (error) => {
        console.log('Error while searching the meetings from the DB ', error);
    })
})

//              >> PAGINA CREATE A NEW MEETING (GET & POST)
//GET
//nos renderiza la pagina donde se encontrará el formulario para CREAR NUEVO meeting.
meetingRouter.get('/createMeeting', (req, res) => {
    res.render('meeting/createMeeting');
});

//POST
//toma los datos que se encuentran en el formulario de la pagina 'CREATE MEETING'.
meetingRouter.post('/createMeeting', (req, res) => {
    const { meetingName, meetingDescription, meetingLanguage, meetingDate, meetingPoint, meetingCity } = req.body;

    // el creador se agrega a la meeting
    let meetingParticipants = [];
    meetingParticipants.push(req.session.currentUser._id);
    
    const newMeeting = { 
        meetingName, 
        meetingDescription, 
        meetingLanguage, 
        meetingDate, 
        meetingPoint, 
        meetingCity,
        meetingOrganizer: req.session.currentUser._id,
        meetingParticipants
    };

    Meeting.create(newMeeting)
    .then((newMeet) => {
        console.log('A new meeting was created ', newMeet);

         // agrego la meeting a la meetingPending del usuario
        User.findById(req.session.currentUser._id)
        .then((user) => {
            let { myPendingMeetings } = user;
            myPendingMeetings.push(newMeet._id);
            const addMeetingToUser = {
                myPendingMeetings
            }
            User.update({_id: req.session.currentUser._id}, addMeetingToUser)
            .then(() => {
                res.redirect(`/meet/meetings`);
            });
        })
    })
    .catch( (error) => {
        console.log('Error while adding a new meeting to the DB ', error);
        //preguntar esto, como hacemos para mostrarle un mensaje al usuario >>
        //res.render('meeting/createMeeting');
    })
});

//              >> PAGINA MY PENDING MEETINGS (GET)
//GET
meetingRouter.get('/myPendingMeetings', (req, res) => {
    User.findById(req.session.currentUser._id)
    .populate('myPendingMeetings')
    .then ((user) => {
        res.render('meeting/myPendingMeetings', {
            myMeetings: user.myPendingMeetings
        });
    })
    .catch( (error) => {
        console.log('Error while listing my pending meetings from the DB ', error);
    })
});

//              >> PAGINA DELETE MEETING (POST)
//POST
//toma los datos del boton cuando borra un meeting y redirecciona a pagina principal de meetings.
//              cambiar metodo de post a delete
meetingRouter.post('/:id/delete', (req, res) => {
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
meetingRouter.get('/:id/editMeeting', (req, res) => {
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
meetingRouter.patch('/:id/edit', (req, res) => {
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
meetingRouter.get('/meetings/:id', (req, res) => {
    Meeting.findById(req.params.id)
    .populate('meetingParticipants')
    .then( (theMeeting) => {
        console.log(theMeeting);
        const isOrganizer = req.session.currentUser._id == theMeeting.meetingOrganizer;
        res.render('meeting/meetingDetails', {theMeeting, isOrganizer})
    })
});

//              >> SUBSCRIBIRSE A UNA MEETING (POST)
//POST
//se registrara al usuario en la meeting agregandolo al campo "meetingParticipants"
meetingRouter.post('/meetings/:id', (req, res) => {
    Meeting.findById(req.params.id)
        .then((theMeeting) => {
            // agrego al usuario a la meeting
            let { meetingParticipants } = theMeeting;
            meetingParticipants.push(req.session.currentUser._id);
            const updateMeeting = { 
                meetingParticipants 
            };

            Meeting.update({_id: req.params.id}, updateMeeting)
            .then(() => {
                 // agrego la meeting a la meetingPending del usuario
                 User.findById(req.session.currentUser._id)
                     .then((user) => {
                         let {
                             myPendingMeetings
                         } = user;
                         myPendingMeetings.push(req.params.id);
                         const addMeetingToUser = {
                             myPendingMeetings
                         }
                         User.update({
                                 _id: req.session.currentUser._id
                             }, addMeetingToUser)
                             .then(() => {
                                 res.redirect(`/meet/meetings`);
                             });
                     })
            })
            .catch(err => console.log(err));
        })  
        .catch(err => console.log(err));
});


//                              >> DES- SUBSCRIBIRSE A UNA MEETING (POST)
//POST - BOTÓN ====> CANT GO!
//se borra al usuario de la meeting, sacando su ID del campo "meetingParticipants".
meetingRouter.post('/meetings/:id/remove', async (req, res) => {
        const result = await Meeting.findByIdAndUpdate(req.params.id, {
            $pull: {
                meetingParticipants: req.session.currentUser._id
            }
        }, {
            new: true
        });

        // se elimina la meeting de las meetingPending del usuario.

        const userResult = await User.findByIdAndUpdate(req.session.currentUser._id, {
            $pull: {
                 myPendingMeetings: req.params.id
        }
        }, {
            new: true
        });
        req.session.currentUser = userResult;
        res.redirect('/meet/myPendingMeetings')

})
           /* Meeting.findById(req.params.id)
                .then((theMeeting) => {
                        // agrego al usuario a la meeting
                        let {
                            meetingParticipants
                        } = theMeeting;
                        meetingParticipants.findOneAndDelete(req.session.currentUser._id);
                        const updateMeeting = {
                            meetingParticipants
                        };
                        
                        //Se actualiza la meeting

                        Meeting.update({
                                _id: req.params.id
                            }, updateMeeting)
                            .then(() => {
                                // se elimina la meeting de las meetingPending del usuario.
                                User.findById(req.session.currentUser._id)
                                    .then((user) => {
                                        let {
                                            myPendingMeetings
                                        } = user;
                                        myPendingMeetings.findOneAndDelete(req.params.id);
                                        const deleteMeetingToUser = {
                                            myPendingMeetings
                                        }
                                        User.update({
                                                _id: req.session.currentUser._id
                                            }, deleteMeetingToUser)
                                            .then(() => {
                                                res.redirect(`/meet/meetings`);
                                            });
                                    })
                            })
                            .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                        }); */



module.exports = meetingRouter;
