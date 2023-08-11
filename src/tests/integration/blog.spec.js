const request = require('supertest')
const { connect } = require('./database')
const UserModel = require('../../models/user.model')
const BlogModel = require('../../models/blog.model')
const app = require('../../../index');
const { getWordCount, getTags, getUserIdFromToken } = require('../../services/blog.services')

describe('Blog: Protected Routes', () => {
    let conn;
    let token, blogPost, publishedPost;

    beforeAll(async() => {
        conn = await connect();
        await UserModel.create({
            firstname: 'tobie',
            lastname: 'Augustina',
            email: 'tobi@mail.com',
            password: 'Password123'
        });

        const loginResponse = await request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'tobi@mail.com',
                password: 'Password123'
            });

        token = loginResponse.body.token;






    })
    beforeEach(async() => {
        await BlogModel.create({
            title: "Hackers",
            description: "It's about the history of computing",
            tags: ["post", "posted"],
            author: getUserIdFromToken(token),
            read_count: 5,
            read_time: 2,
            body: "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
            state: "published"
        })

        await BlogModel.create({
            title: "Hackerthon",
            description: "It's about the history of computing",
            tags: ["post", "posted"],
            author: getUserIdFromToken(token),
            read_count: 5,
            read_time: 2,
            body: "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
            state: "draft"
        })

    })

    afterEach(async() => {
        await conn.cleanup()
    })

    afterAll(async() => {
        await conn.disconnect()
    })



    it('should create a blog post and return an object', async() => {
        const response = await request(app).post('/blog/create')
            .set('content-type', 'application/json')
            .set('token', token)
            .send({
                title: "Hackers",
                description: "It's about the history of computing",
                tags: "",
                body: "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",

            })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('blogpost')
        expect(response.body.blogpost).toHaveProperty('_id')

    })

    it('should update the state of  blog post', async() => {

        blogPost = await BlogModel.create({
            title: "Hackers",
            description: "It's about the history of computing",
            tags: ["post", "posted"],
            author: getUserIdFromToken(token),
            read_count: 5,
            read_time: 2,
            body: "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
            state: "draft"

        })

        const response = await request(app)
            .patch(`/blog/updatePostState/${blogPost._id}`)
            .set('content-type', 'application/json')
            .set("token", token)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('blog')
        expect(response.body.blog).toHaveProperty('state', 'published')

    })
    it('should update a blog post', async() => {

        blogPost = await BlogModel.create({
            title: "Hackers",
            description: "It's about the history of computing",
            tags: ["post", "posted"],
            author: getUserIdFromToken(token),
            read_count: 5,
            read_time: 2,
            body: "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
            state: "draft"

        })

        const response = await request(app)
            .patch(`/blog/editPost/${blogPost._id}`)
            .set('content-type', 'application/json')
            .set("token", token)
            .send({
                title: "Hackers United",
                description: "It's about the history of computing",
                tags: "Hackers, test, wonderful",
                body: "There are no brief people Paul Solomon People are short hhahahahha, said Ravi",
                state: "published"

            })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('blog')
        expect(response.body).toHaveProperty('message', 'updated successfully')

    })

    it('should delete a blog post', async() => {

        blogPost = await BlogModel.create({
            title: "Hackers",
            description: "It's about the history of computing",
            tags: ["post", "posted"],
            author: getUserIdFromToken(token),
            read_count: 5,
            read_time: 2,
            body: "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
            state: "draft"

        })

        const response = await request(app)
            .delete(`/blog/deletePost/${blogPost._id}`)
            .set('content-type', 'application/json')
            .set("token", token);


        expect(response.body).toHaveProperty('message')

        expect(response.body).toHaveProperty('status', true)
    })

    it('should get a users draft blog posts', async() => {



        const response = await request(app)
            .get(`/blog/userPosts?state=draft`)
            .set('content-type', 'application/json')
            .set("token", token);

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('blog')
        expect(response.body.blog[0]).toHaveProperty('state', 'draft')


    })
    it('should get a users published blog posts', async() => {



        const response = await request(app)
            .get(`/blog/userPosts?state=published`)
            .set('content-type', 'application/json')
            .set("token", token);

        //console.log(response.body.blog);

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('blog')
        expect(response.body.blog[0]).toHaveProperty('state', 'published')

    })



})

describe('Blog: Open Routes', () => {
    let conn;
    let token, blogPost, publishedPost;

    beforeAll(async() => {
        conn = await connect();
        await UserModel.create({
            firstname: 'tobie',
            lastname: 'Augustina',
            email: 'tobi@mail.com',
            password: 'Password123'
        });

        const loginResponse = await request(app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({
                email: 'tobi@mail.com',
                password: 'Password123'
            });

        token = loginResponse.body.token;






    })
    it('should get a published post', async() => {

        publishedPost = await BlogModel.create({
            title: "Hackers",
            description: "It's about the history of computing",
            tags: ["post", "posted"],
            author: getUserIdFromToken(token),
            read_count: 5,
            read_time: 2,
            body: "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
            state: "published"

        })
        const response = await request(app)
            .get(`/blog/published_post/${publishedPost._id}`)
            .set('content-type', 'application/json')


        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('blog')
        expect(response.body).toHaveProperty('user')


    })

    it('should get all published posts', async() => {

        publishedPost = await BlogModel.create({
            title: "Hackers",
            description: "It's about the history of computing",
            tags: ["post", "posted"],
            author: getUserIdFromToken(token),
            read_count: 5,
            read_time: 2,
            body: "There are no brief people Paul Solomon People are short hhahahahha, ravi said yesterday",
            state: "published"

        })
        const response = await request(app)
            .get(`/blog/published_posts`)
            .set('content-type', 'application/json')


        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('blog')



    })

})