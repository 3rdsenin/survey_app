Requirements

    User should be able to register
    User should be able to login 
    Implement authorization with JWT
    User should be able to get blog posts
    Logged in users should be able to create/edit and delete their own blog posts
    Test application


Setup

    Install NodeJS, mongodb
    pull this repo
    run npm install
    update env with example.env
    run npm run dev

Base URL

    localhost:process.env.PORT || https://calm-pear-bee-gown.cyclic.app/

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  String |  default: ObjectId |
|  firstname | String  |  required | 
|  lastname  | String |  required |
|  email     | String  |  required, unique, lowercase |
|  password  | String |  required |


### Blog
| field  |  data_type | constraints  |
|---|---|---|
|  id |  String |  default: ObjectId |
|  title |  String |  required |
|  description | String  |  required |
|  tags  |  Array |  required  |
|  author     | String  |  required |
|  timestamp |   Date |     |
|  state |  String |  required, enum: ['draft', 'published'], default: 'draft' |
|  read_count |  Number |  default: 0 |
|  read_time |  Number |  required |
|  body |  String |  required |

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

Create Blog Post

    Route: blog/create
    Method: POST
    Header
        token: {token}
    Body:

{    
    "title": "Hackers",
    "description": "It's about the history of computing",
    "tags": "",
    "body": "There are no brief people.",
    
  
}
    Responses

Success

{
    "message": "successfully posted",
    "blogpost": {
        "timestamp": "2022-11-04T22:09:43.093Z",
        "title": "hackers",
        "description": "It's about the history of computing",
        "tags": [
            "untagged post",
            "post"
        ],
        "author": "6365818054e0ad6c0bb47f91",
        "read_count": 0,
        "read_time": 28,
        "body": "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
        "state": "draft",
        "_id": "63658da7a2de6ffc5de61a40",
        "__v": 0
    }
}

Update Blog Post State

    Route: blog/updatePostState/:id
    Method: PATCH
    Header
        token: {token}
    Body:

{    
    "title": "Hackers",
    "description": "It's about the history of computing",
    "tags": "",
    "body": "There are no brief people.",
    
  
}
    Responses

Success

{
    "message": "Post state update successfully to published",
    "blogpost": {
        "timestamp": "2022-11-04T22:09:43.093Z",
        "title": "hackers",
        "description": "It's about the history of computing",
        "tags": [
            "untagged post",
            "post"
        ],
        "author": "6365818054e0ad6c0bb47f91",
        "read_count": 0,
        "read_time": 28,
        "body": "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
        "state": "published",
        "_id": "63658da7a2de6ffc5de61a40",
        "__v": 0
    }
}

Update Blog Post 

    Route: blog/editPost/:id
    Method: PATCH
    Header
        token: {token}
    Body:

{
        
        "title": "hackerzz",
        "description": "It's about the history of computing",
        "tags": "updated post",
        "body": "There are no brief people People are short hhahahahha, ravi said yesterday"
        
    }
    Responses

Success

{
    "message": "updated successfully",
    "blog": {
        "_id": "63658da7a2de6ffc5de61a40",
        "timestamp": "2022-11-04T22:09:43.093Z",
        "title": "hackerzz",
        "description": "It's about the history of computing",
        "tags": [
            "updated post",
            "post"
        ],
        "author": "6365818054e0ad6c0bb47f91",
        "read_count": 0,
        "read_time": 24,
        "body": "There are no brief people People are short hhahahahha, ravi said yesterday",
        "state": "published",
        "__v": 1
    }
}

Delete Blog Post 

    Route: blog/deletePost/:id
    Method: PATCH
    Header
        token: {token}
    Body:

    {
                
    }

    Responses

Success

{
    "status": true,
    "message": "Post deleted successfully"
}

Get all published blog posts 

    Route: blog/published_posts
    Method: GET
    Header
        
    Body:

    {
                
    }

    Acceptable Params
    {
        tags: string,
        title: string,
        author: string,
        order: string,
        order_by: string
    }

    Responses

Success

{
    "blog": [
        {
            "_id": "63658686c7ed64471b360467",
            "timestamp": "2022-11-04T21:39:18.449Z",
            "title": "hackers",
            "description": "It's about the history of computing",
            "tags": [
                "untagged post",
                "post"
            ],
            "author": "6365818054e0ad6c0bb47f91",
            "read_count": 0,
            "read_time": 28,
            "body": "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
            "state": "published",
            "__v": 0
        },
        {
            "_id": "63658686c7ed64471b360467",
            "timestamp": "2022-11-04T21:39:18.449Z",
            "title": "hackers",
            "description": "It's about the history of computing",
            "tags": [
                "untagged post",
                "post"
            ],
            "author": "6365818054e0ad6c0bb47f91",
            "read_count": 0,
            "read_time": 28,
            "body": "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
            "state": "published",
            "__v": 0
        }
    ]
}

Get a published blog post

    Route: blog/published_post/:id
    Method: GET
    Header
        
    Body:

    {
                
    }

      Responses

Success

{
    "blog": [
        {
            "_id": "63658686c7ed64471b360467",
            "timestamp": "2022-11-04T21:39:18.449Z",
            "title": "hackers",
            "description": "It's about the history of computing",
            "tags": [
                "untagged post",
                "post"
            ],
            "author": "6365818054e0ad6c0bb47f91",
            "read_count": 0,
            "read_time": 28,
            "body": "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
            "state": "published",
            "__v": 0
        }
    ]
}

Get all published blog posts for a user

    Route: blog/userPosts
    Method: GET
    Header
        {
            token: {token}
        }
    Body:

    {
                
    }

    Acceptable Params
    {
        tags: string,
        title: string,
        order: string,
        order_by: string
    }

    Responses

Success

{
    "blog": [
        {
            "_id": "63658686c7ed64471b360467",
            "timestamp": "2022-11-04T21:39:18.449Z",
            "title": "hackers",
            "description": "It's about the history of computing",
            "tags": [
                "untagged post",
                "post"
            ],
            "author": "6365818054e0ad6c0bb47f91",
            "read_count": 0,
            "read_time": 28,
            "body": "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
            "state": "published",
            "__v": 0
        },
        {
            "_id": "63658686c7ed64471b360467",
            "timestamp": "2022-11-04T21:39:18.449Z",
            "title": "hackers",
            "description": "It's about the history of computing",
            "tags": [
                "untagged post",
                "post"
            ],
            "author": "6365818054e0ad6c0bb47f91",
            "read_count": 0,
            "read_time": 28,
            "body": "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
            "state": "published",
            "__v": 0
        }
    ]
}
```
Link to postman collection: [![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/12566761-ea49629c-6fbf-423d-b75b-3e51bed6c3ca?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D12566761-ea49629c-6fbf-423d-b75b-3e51bed6c3ca%26entityType%3Dcollection%26workspaceId%3Df3d6aad4-30d0-4b94-8262-abe60a8510c2
