import { GraphQLServer, PubSub } from "graphql-yoga";
import db from './db';
import Mutation from './resolvers/Mutation';
import Query from './resolvers/Query';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';
import User from './resolvers/User';
import Subscription from './resolvers/Subscription';

const pubsub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Post,
        Comment,
        User,
        Subscription
    },
    context: {
        db,
        pubsub
    }
})


server.start( () => {
    console.log('starting server')
})