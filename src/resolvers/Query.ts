import { IUser } from '../types/interfaces';

export const songs = async (parent: any, args: any, context: any) =>
  context.prisma.song.findMany();

export const user = async (parent: any, args: any, context: any) =>
  context.prisma.user.findUnique({ where: { id: context.userId } });
