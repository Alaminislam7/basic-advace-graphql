const Query = {
    users(parent, args, {db}, info) {
        if(!args.query){
            return db.users
        }
        return db.users.filter((user) => {
            const matches = user.name.toLowerCase().includes(args.query.toLowerCase())
            return matches
        })
    },
    posts(parent, args, {db}, info) {
        return db.posts
    },
    comments(parent, args, {db}, info) {
        return db.comments
    }
}


export {Query as default}