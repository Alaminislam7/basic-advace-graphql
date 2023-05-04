import  uuidv4 from "uuidv4"



const Mutation = {
    createUser(parent, args, {db}, info) {
        const emailTaken = db.users.some((user) => user.email === args.data.email)
        if(emailTaken){
            throw new Error(`User ${args.data.email} already exists`)
        }
        const user = {
            id: uuidv4(),
            name: args.data.name,
            email: args.data.email,
            age: args.data.age
        }
        db.users.push(user)
        return user
    },
    
    deleteUser(parent, args, {db}, info){
        const userIndex = db.users.findIndex((user) => user.id === args.id);
        if(userIndex === -1) {
            throw new Error("User Not Found")
        }
        const deleteUsers = db.users.splice(userIndex, 1)

        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id
            if(match) {
                db.comments = db.comments.filter((comment) => comment.author !== post.id)
            }
            return !match
        })
        db.comments = db.comments.filter((comment) => comment.author !== args.id)
        return deleteUsers[0]
    },
    updateUser(parent, args, {db}, info) {
        const {id, data} = args
        const user = db.users.find((user) => user.id === id)
        if(!user) {
            throw new Error('User not found')
        }
        if(typeof data.email === 'string') {
            const emailTaken = db.users.some((user) => user.email === data.email)
            if(emailTaken) {
                throw new Error('Email already taken')
            }
            user.email = data.email
        }
        if(typeof data.name === 'string') {
            user.name = data.name
        }
        if(typeof data.age !== 'undefined') {
            user.age = data.age
        }
        return user
    },
    createPost(parent, args, {db, pubsub}, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)
        if(!userExists) {
            throw new Error(`User ${args.data.email} not found`)
        }
        const post = {
            id: uuidv4(),
            title: args.data.title,
            body: args.data.body,
            author: args.data.author 
        }
        db.posts.push(post)
        if(args.data.published){
            pubsub.publish('post', {
                post: {
                    mutation: "CREATED",
                    data: post
                }
            })
        }

        return post
    },
    deletePost(parent, args, {db, pubsub}, info) {
        const postIndex = db.posts.findIndex((user) => user.id === args.id);
        if(postIndex === -1) {
            throw new Error('Post Not Found');
        }
        const [post] = db.posts.slice(postIndex, 1);
        db.comments = db.comments.filter((comment) => comment.post !== args.id);

        if(post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }

        return post
    },
    updatePost(parent, args, {db, pubsub}, info){
        const {id, data} = args
        const post = db.posts.find((post) => post.id === id)
        const originalPost = {...post}

        if(!post){
            throw new Error('Post Not Found');
        }
        if(typeof data.title === 'string'){
            post.title = data.title
        }
        if(typeof data.body === 'string'){
            post.body = data.body
        }
        if(typeof data.published === 'boolean'){
            post.published = data.published
        }

        if(typeof data.published === 'boolean') {
            post.published = data.published

            if(originalPost.published && !post.published){
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if(!originalPost.published && post.published){
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },
    createComment(parent, args, {db, pubsub}, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => post.id === args.data.post && post.published)

        if(!userExists || !postExists) {
            throw new Error('user or post not found')
        }
        const comment = {
            id: uuidv4(),
            title: args.data.title,
            author: args.data.author,
            post: args.data.post
        }
        db.comments.push(comment)
        pubsub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })
        return comment
    },
    deletecomment(parent, args, {db, pubsub}, info) {
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id);
        if(commentIndex === -1) {
            throw new Error('Comment not found');
        }
        const [deleteComment] = db.comments.splice(commentIndex, 1);

        pubsub.publish(`comment ${deleteComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deleteComment
            }
        })

        return deleteComment
    },
    updateComment(parent, args, {db,pubsub}, info){
        const {id, data} = args
        const comment = db.comments.find((comment) => comment.id === id)
        if(!comment){
            throw new Error('Comment Not Found');
        }
        if(typeof data.title === 'string'){
            comment.title = data.title
        }
        pubsub.publish(`comment`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment
    }
}

export {Mutation as default}