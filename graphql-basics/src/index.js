import { GraphQLServer } from "graphql-yoga";
// import uuidv4 form 'uuid/v4';


let users = [{
    id: '1',
    name: 'alamin',
    email: 'alamin@gmail.com',
    age: 22
},{
    id: '2',
    name: 'adnan',
    email: 'adnan@gmail.com',
    age: 23
},{
    id: '3',
    name: 'sumon',
    email: 'sumon@gmail.com',
    age: 24
}]

let posts = [{
    id: '10',
    title: 'this is post one',
    body: 'this is post one and some other post one',
    author: '1'
},{
    id: '20',
    title: 'this is post two',
    body: 'this is post one and some other post two',
    author: '1'
},{
    id: '30',
    title: 'this is post there',
    body: 'this is post one and some other post theere',
    author: '2'
}]

let comments = [
    {
        id: '100',
        title: 'awesome post one',
        author: '1',
        post: '10'
    },
    {
        id: '102',
        title: 'awesome post two',
        author: '2',
        post: '20'
    },
    {
        id: '103',
        title: 'awesome post there',
        author: '2',
        post: '10'
    }
]





const typeDefs = `
    type Query {
        aboltabol(name: String!, possition: String): String!
        me: User!
        marks(mark: [Float!]!): Float!
        users(query: String): [User!]!
        posts: [Post!]!
        post: Post!
        comments: [Comment!]!
    }
    type mutation{
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deletecomment(id: ID!): Comment!
    }
    input CreateUserInput{
        name: String!,
        email: String!,
        age: Int
    }
    input CreatePostInput{
        title: String!,
        body: String!, 
        published: Boolean!
        author: ID!
    }
    input CreateCommentInput{
        title: String!, 
        author: ID!, 
        post: ID!
    }

    type User {
        id: ID
        name: String
        email: String
        age: Int
        post: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: ID!
        author: User!
        comments: [Comment!]!
    }
    type Comment {
        id: ID!
        title: String!
        author: User!
        post: Post!
    }

`


const resolvers = {
    Query: {
        aboltabol(parent, args, ctx, info){
            if(args.name && args.possition){
                return `name ${args.name} and possiton ${args.possition}`
            } else {
                return 'Hello'
            }
        },
        
        me() {
            return {
                id: '2232',
                name: 'John Smith',
                email: 'john@smith.com',
                age: 22
            }
        },
        marks(parent, args, ctx, info) {
            return args.mark.reduce((acc, cur) => {
                return acc + cur;
            })
            
        },
        users(parent, args, ctx, info) {
            if(!args.query){
                return users
            }
            return users.filter((user) => {
                const matches = user.name.toLowerCase().includes(query.toLowerCase())
                return matches
            })
        },
        posts() {
            return posts
        },
        comments() {
            return comments
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email)
            if(emailTaken){
                throw new Error(`User ${args.data.email} already exists`)
            }
            const user = {
                id: uuidv4(),
                name: args.data.name,
                email: args.data.email,
                age: args.data.age
            }
            users.push(user)
            return user
        },
        
        deleteUser(parent, args, ctx, info){
            const userIndex = users.findIndex((user) => user.id === args.id);
            if(userIndex === -1) {
                throw new Error("User Not Found")
            }
            const deleteUsers = users.splice(userIndex, 1)

            posts = posts.filter((post) => {
                const match = post.author === args.id
                if(match) {
                    comments = comments.filter((comment) => comment.author !== post.id)
                }
                return !match
            })
            comments = comments.filter((comment) => comment.author !== args.id)
            return deleteUsers[0]
        },

        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)
            if(!userExists) {
                throw new Error(`User ${args.data.email} not found`)
            }
            const post = {
                id: uuidv4(),
                title: args.data.title,
                body: args.data.body,
                author: args.data.author 
            }
            posts.push(post)
            return post
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((user) => user.id === args.id);
            if(postIndex === -1) {
                throw new Error('Post Not Found');
            }
            const deletePost = posts.slice(postIndex, 1);
            comments = comments.filter((comment) => comment.post !== args.id);
            return deletePost[0]
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)
            const postExists = posts.some((post) => post.id === args.data.post && post.published)

            if(!userExists || !postExists) {
                throw new Error('user or post not found')
            }
            const comment = {
                id: uuidv4(),
                title: args.data.title,
                author: args.data.author,
                post: args.data.post
            }
            comments.push(comment)
            return comment
        },
        deletecomment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex((comment) => comment.id === args.id);
            if(commentIndex === -1) {
                throw new Error('Comment not found');
            }
            const deleteComments = comments.splice(commentIndex, 1);
            return deleteComments[0]
        }
    },

    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id == parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => comment.post === parent.author)
        }
    },
    User: {
        post(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author = parent.id
            }) 
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => comment.author == parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => user.id == parent.author)
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => post.id == parent.post)
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})


server.start( () => {
    console.log('starting server')
})