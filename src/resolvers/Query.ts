export const songs = async (parent: any, args: any, context: any) => {
  // find user friends
  const friendships = await context.prisma.friend.findMany({
    where: {
      OR: [{ friendAId: context.userId }, { friendBId: context.userId }],
    },
  });

  // set with ids to remove duplicates
  const ids = new Set();
  // add user in case no friends
  ids.add(context.userId)
  // add each user id
  friendships.forEach((friendship: any) => {
    ids.add(friendship.friendAId);
    ids.add(friendship.friendBId);
  });

  // query song where usre id in ...
  return context.prisma.song.findMany({
    where: { userId: { in: Array.from(ids) } },
    orderBy: args?.orderBy || {createdAt: "desc"},
  });
};

export const user = async (parent: any, args: any, context: any) =>
  context.prisma.user.findUnique({ where: { id: context.userId } });
