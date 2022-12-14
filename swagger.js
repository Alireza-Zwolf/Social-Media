const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/users.js' , './routes/posts.js', './routes/likes.js', './routes/auth.js']



const doc = {
    info: {
        version: "1.0.0",
        title: "Social Media API Documentation",
        description: "Documentation for the Social Media API, made by <b>Swagger Autogen</b>."
    },
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    apis: ['routes/users.js'],
    tags: [
        {
            "name": "Users",
            "description": "users details"
        },
        {
            "name": "Posts",
            "description": "posts details"
        },
        {
            "name": "Likes",
            "description": "likes details"
        }
    ],
    // definitions: {
    //     User: {
    //         name: "Alireza",
    //         username: "Ali123",
    //         email: "alireza2621@gmail.com",
    //         age: 21,
    //         password: 123456,
    //         posts : [] ,
    //         likes : []
    //     }
    // }
}


swaggerAutogen(outputFile, endpointsFiles , doc).then(() => {
    require('./main.js')
})
