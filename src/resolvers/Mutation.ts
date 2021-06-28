import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import faker from 'faker';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../utils';

dotenv.config()

export const addSong = async (parent: any, args: any, context: any) => {
  const { userId } = context;

  var youtube = google.youtube({
    version: "v3",
    auth: process.env.GOOGLE_AUTH_KEY,
  });

  youtube.search.list(
    {
      part: ["snippet"],
      q: args.url
    },
    async function (err: any, data: any) {
      if (err) {
        console.error("Error: " + err);
      }
      if (data) {
        console.log(data.data.items[0].snippet);
        const songData = data.data.items[0]
        const song = {
          url: args.url,
          name: songData.snippet.title,
          artist: "",
          type: "playlist",
          image: songData.snippet.thumbnails.default.url,
          duration: "02:00",
        };

        const newSong = await context.prisma.song.create({
          data: {
            ...song,
            user: { connect: { id: userId } },
          },
        });
      
        context.pubsub.publish("NEW_SONG", newSong);
        return newSong;
      }
    }
  );
 




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
