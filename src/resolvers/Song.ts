export const user = (parent: any, args: any, context: any, info: any) => {
  return context.prisma.song.findUnique({ where: { id: parent.id } }).user();
};

export const likes = (parent: any, args: any, context: any, info: any) => {
  return context.prisma.song.findUnique({ where: { id: parent.id } }).likes();
};
