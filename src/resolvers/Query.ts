import { IUser } from '../types/interfaces';

export const songs = async (parent: any, args: any, context: any) =>
  context.prisma.song.findMany();
