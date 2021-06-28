import { IUser } from '../types/interfaces';

export const songs = async (parent: any, args: any, context: any, info: any) =>
  context.prisma.user.findUnique({ where: { id: parent.id } }).songs();

export const friends = async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  // if user is friendB, retrieve the user on friendA
  const friendA = await context.prisma.friend.findMany({
    where: { friendBId: context.userId },
    select: { friendA: true },
  });

  // if user is friendA, retrieve the user on friendB
  const friendB = await context.prisma.friend.findMany({
    where: { friendAId: context.userId },
    select: { friendB: true },
  });

  return [...friendA, ...friendB].map(
    (friendShip: { [key in "friendA" | "friendB"]: IUser }): IUser => {
      // remove the field key which will be either "friendB",
      return Object.values(friendShip)[0];
    }
  );
};

// export const friends = async (
//   parent: any,
//   args: any,
//   context: any,
//   info: any
// ) => {
//   console.log(
//     await Promise.all([
//       context.prisma.user.findUnique({ where: { id: parent.id } }).friendA(),
//       context.prisma.user.findUnique({ where: { id: parent.id } }).friendB(),
//     ]).then(([arr1,arr2]) => [...arr1, ...arr2])
//   )
// return await Promise.all([
//   context.prisma.user.findUnique({ where: { id: parent.id } }).friendA(),
//   context.prisma.user.findUnique({ where: { id: parent.id } }).friendB(),
// ]).then(([arr1,arr2]) => [...arr1, ...arr2]);
// };
