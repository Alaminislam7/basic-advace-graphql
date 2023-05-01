
const Query = {
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
    users(parent, args, {db}, info) {
        if(!args.query){
            return db.users
        }
        return db.users.filter((user) => {
            const matches = user.name.toLowerCase().includes(query.toLowerCase())
            return matches
        })
    },
    posts() {
        return db.posts
    },
    comments() {
        return db.comments
    }
}


export {Query as default}