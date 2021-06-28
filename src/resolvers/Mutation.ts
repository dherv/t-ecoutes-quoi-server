const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const faker = require("faker");
import { APP_SECRET } from '../utils';

export const addSong = async (parent: any, args: any, context: any) => {
  const { userId } = context;

  const mock = {
    url: faker.internet.url(),
    name: faker.name.findName(),
    artist: faker.name.findName(),
    type: "playlist",
    image: faker.image.imageUrl(),
    duration: "02:00",
  };
  const newSong = await context.prisma.song.create({
    data: {
      ...mock,
      user: { connect: { id: userId } },
    },
  });

  context.pubsub.publish("NEW_SONG", newSong);
  return newSong;
};

export const signup = async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, avatar: faker.image.imageUrl(), password },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user,
  };
};

export const login = async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  // 1
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });

  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);

  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

export const addLike = async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  const { userId } = context;

  const like = await context.prisma.like.findUnique({
    where: {
      songId_userId: {
        songId: Number(args.songId),
        userId: userId,
      },
    },
  });

  if (Boolean(like)) {
    throw new Error(`Already liked this song: ${args.songId}`);
  }

  const newLike = context.prisma.like.create({
    data: {
      user: { connect: { id: userId } },
      song: { connect: { id: Number(args.songId) } },
    },
  });
  context.pubsub.publish("NEW_LIKE", newLike);

  return newLike;
};

export const addFriend = async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  const { userId } = context;
  const friendEmail = args.email;

  const friend = await context.prisma.user.findUnique({
    where: { email: friendEmail },
  });

  if (!friend) {
    throw new Error("No such user found");
  }

  if (friend.id === userId) {
    throw new Error(
      "you can not be friend with yourself - it just does not make sense"
    );
  }

  const friendShip = await context.prisma.friend.findUnique({
    where: {
      friendAId_friendBId: {
        friendAId: userId,
        friendBId: friend.id,
      },
    },
  });

  if (Boolean(friendShip)) {
    throw new Error(`Already friend with: ${friend.name}`);
  }

  await context.prisma.friend.create({
    data: {
      friendA: { connect: { id: userId } },
      friendB: { connect: { id: friend.id } },
    },
  });

  return friend;
};
