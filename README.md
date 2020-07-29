# meetup


<br>


## Description

There are many stages of learning a language. At some point in this learning, we realize it’s time to talk with a native speaker and practice everything we’ve learned so far. That’s where language exchange comes in. MeetUp helps you to find the right language exchange partner, one who shares our interests and has similar language goals. MeetUp allows you not only to improve a language, you also make great friends!


<br>

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage, log in and sign up. 
- **FAQ's** - As a user I want to be able to access to the FAQ'S.
- **sign up** - As a user I want to sign up on the web page so that I can create and suscribe to new meetings.
- **login** - As a user I want to be able to log in on the web page so that I can get back to my account.
- **logout** - As a user I want to be able to log out from the web page so that I can make sure no one will access my account.
- **myPendingMeetings** - As a user I want to see the list of my pending meetings, create a new meeting, edit or delete them.
- **Profile** - As a user I want to be able to see my profile.
- **edit user** - As a user I want to be able to edit my profile.
- **meetings** - As a user I want to see all the list of uncoming meetings.
- **result** - As a user I want to see the list of meetings and filter by my preferences.
- **meetingDetails** - As a user I want to see more details of the meeting, and be able to suscribe.

<br>


## Server Routes (Back-end):



| **Method** | **Route**                          | **Description**                                              | Request  - Body                                          |
| ---------- | ---------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| `GET`      | `/`                                | Main page route.  Renders home `index` view.                 |                                                          |
| `GET`      |`/FAQ's`                            | FAQ's page route.  Renders FAQ's `FAQ's` view.               |                                                         
|  `GET`     | `/login`                           | Renders `login` form view.                                   |                                                          |
| `POST`     | `/login`                           | Sends Login form data to the server.                         | { email, password }                                      |
| `GET`      | `/signup`                          | Renders `signup` form view.                                  |                                                          |
| `POST`     | `/signup`                          | Sends Sign Up info to the server and creates user in the DB. | { name, email, password }                                    |
| `GET`      | `/private/edit-profile`            | Private route. Renders `edit-profile` form view.             |                                                          |
| `PUT`      | `/private/edit-profile`            | Private route. Sends edit-profile info to server and updates user in DB. | { name, email, password, address, profileImage, languagesISpeak, languagesISpeak } |
| `GET`      | `/private/meetings`                | Private route. Render the `meetings` view.                   |                                                          |
| `GET`      | `/private/meetings/:meetingId`     | Private route. Render the `meeting` view.                    |                                                          |
| `GET`      | `/private/myPendingMeetings`       | Private route. Render the `myPendingMeetings` view.          |                                                          |
| `POST`     | `/private/myOrganizedMeetings/`    | Private route. Adds a new meeting for the current user.      | { meetingName, meetingImg, meetingDescription, meetingLanguage, meetingDate, meetingPoint, meetingOrganizer, meetingParticipants}                                 |
| `DELETE`   | `/private/myPendingMeetings/:meetingId`| Private route. Deletes the existing meeting from the current user. |                                                |
| `PUT`      | `/private/edit-myPendingMeetings/:meetingId`   | Private route. Sends edit-meeting info to server and updates user in DB. | { meetingName, meetingImg, meetingDescription, meetingLanguage, meetingDate, meetingPoint, meetingOrganizer, meetingParticipants } |


<br>

## Models

User model

```javascript

name: { type: String, required: true }, 
email: { type, String, required: true }, 
password: { type: String, required: true},
address: { 
        city: { type: String, required: true },
        country: { tyoe: String, required: true }
}, 
biography: { type: String }, 
profileImage: { type: String, required: true }, 
languagesISpeak: { type: String, required: true },
iWantToLearn: { type: String, required: true },
myPendingMeetings: [{ type: mongoose.Schema.Types.ObjectId, ref: "meetingSchema"}],
myOrganizedMeetings: [{  type: mongoose.Schema.Types.ObjectId, ref: "meetingSchema"}]
}
```
Meeting model

```javascript
meetingName: { type: String, required: true }, 
meetingImg: { type: String, required: true },
meetingDescription: { type: String, required: true },
meetingLanguage: { type: String, required: true },
meetingDate: { type: String, required: true },
meetingPoint: { type: String, required: true },
meetingOrganizer: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], 
meetingParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }]
}
```

<br>



## Backlog
- Geolocation - Google Maps API
- Filter events by languages.
- Inbox Messages - Send/receive messages between users.
- Add a event to Favorites.
- Authentication with Gmail/ Facebook accounts.


<br>

## Links

[See the Trello board.]( https://trello.com/b/AAcslH6p/meetup)

<br>

### Git

The url to your repository and to your deployed project

<br>

### Slides

The url to your presentation slides



