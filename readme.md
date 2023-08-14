Description
    Simple survey app api.

Requirements

    User should be able to register
    User should be able to login 
    Implement authorization with JWT
    User should be able to get and complete surveys
    Logged in users should be able to create/edit and delete their own surveys
    Logged in users should be able to see all completed surveys that belong to them

Setup

    Install NodeJS, mongodb
    pull this repo
    run npm install
    update env with example.env
    run npm run dev

Base URL

    localhost:process.env.PORT || 

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  String |  default: ObjectId |
|  firstname | String  |  required | 
|  lastname  | String |  required |
|  email     | String  |  required, unique, lowercase |
|  password  | String |  required |


### Survey
| field  |  data_type | constraints  |
|---|---|---|
|  id |  String |  default: ObjectId |
|  title |  String |  required |
|  description | String  |  required |
|  author     | String  |  required |
|  timestamp |   Date |     |

### Question
| field  |  data_type | constraints  |
|---|---|---|
|  id |  String |  default: ObjectId |
|  content |  String |  required |
|  surveyId | String  |  required |
|  type | String  |  required |
|  author     | String  |  required |
|  timestamp |   Date |     |


### Response
| field  |  data_type | constraints  |
|---|---|---|
|  id |  String |  default: ObjectId |
|  questionId |  String |  required |
|  response | array  |   |
    |
---

API Endpoints
```
Signup User

    Route: auth/signup
    Method: POST
    Body:

{
  "email": "doe@example.com",
  "password": "Password1",
  "firstname": "jon",
  "lastname": "doe",
  
}

    Responses

Success
---
{
    "message": "Successfully created user",
    "user": {
        "firstname": "Paul",
        "lastname": "Solomon",
        "email": "paul@any3.com",
        "password": "$2b$10$kCJcMeER4Yh7nTANdwPdhui/KyQnAOAtaCpRlZkH1gNyKWICuqZ7i",
        "_id": "63658c6ba2de6ffc5de61a3b",
        "__v": 0
    }
}
---

Login User

    Route: auth/login
    Method: POST
    Body:

{
  "password": "Password1",
  "username": 'jon_doe",
}

    Responses

Success

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2MzY1ODE4MDU0ZTBhZDZjMGJiNDdmOTEiLCJlbWFpbCI6InBhdWxAYW55Mi5jb20iLCJmaXJzdG5hbWUiOiJQYXVsIiwibGFzdG5hbWUiOiJTb2xvbW9uIiwiaWF0IjoxNjY3NTk5NTY4LCJleHAiOjE2Njc2MDY3Njh9.7V9dSTVCVlUmyLrmc_2FPLTYnfWrPM5b1X1LGT-WrBc"
}

All other endpoints documented in postman file included in repo. Please note that you will need to create two variables: "localhost" which maps to base url and "accessToken" which maps to the returned token after login.

Set up environment variables as indicated in example.env file.