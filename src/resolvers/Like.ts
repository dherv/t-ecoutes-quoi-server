export const user = (parent: any, args: any, context: any, info: any) => {
  return context.prisma.like.findUnique({ where: { id: parent.id } }).user();
};
export const song = (parent: any, args: any, context: any, info: any) => {
  return context.prisma.like.findUnique({ where: { id: parent.id } }).song();
};
