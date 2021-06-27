export interface IUser {
  id: string;
  name: string;
}
interface ISong {
  id: string;
  url: string;
  name: string;
  artist: string;
  type?: string;
  duration: string;
  image: string;
  userId: string;
  likers: IUser[];
}