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
const db = {users, posts, comments}

export {db as default}