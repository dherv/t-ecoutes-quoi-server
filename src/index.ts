import 'graphql-import-node';
import { ApolloServer, PubSub } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import * as Like from './resolvers/Like';
import * as Mutation from './resolvers/Mutation';
import * as Query from './resolvers/Query';
import * as Song from './resolvers/Song';
import * as Subscription from './resolvers/Subscription';
import * as User from './resolvers/User';
import * as typeDefs from './schema.graphql';
import { getUserId } from './utils';

const pubsub = new PubSub();
const prisma = new PrismaClient();

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Song,
  Like,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: any) => ({
    ...req,
    prisma,
    pubsub,
    userId: req && req.headers.authorization ? getUserId(req) : null,
  }),
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
