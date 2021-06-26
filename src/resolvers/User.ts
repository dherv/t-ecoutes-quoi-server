export const songs = (parent: any, args: any, context: any, info: any) => {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).songs();
};
