const newSongSubscribe = (parent: any, args: any, context: any, info: any) => {
  return context.pubsub.asyncIterator("NEW_SONG");
};

export const newSong = {
  subscribe: newSongSubscribe,
  resolve: (payload: any) => {
    return payload;
  },
};

const newLikeSubscribe = (parent: any, args: any, context: any, info: any) => {
  return context.pubsub.asyncIterator("NEW_LIKE");
};
export const newLike = {
  subscribe: newLikeSubscribe,
  resolve: (payload: any) => {
    return payload;
  },
};
