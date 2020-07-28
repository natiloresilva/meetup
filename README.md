# meetup


<br>


## Description

There are many stages of learning a language. At some point in this learning, we realize it’s time to talk with a native speaker and practice everything we’ve learned so far. That’s where language exchange comes in. MeetUp helps you to find the right language exchange partner, one who shares our interests and has similar language goals. MeetUp allows you not only to improve a language, you also make great friends!

## Models

User model

```javascript

name: { type: String, required: true }, 
email: { type, String, required: true }, 
password: { type: String, required: true},
address: { 
        neighbourhood: { type: String, required: true },
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




