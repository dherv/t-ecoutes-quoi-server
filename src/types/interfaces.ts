export interface IUser {
  id: string;
  name: string;
}
interface ISong {
  id: string;
  url: string;
  type?: string;
  duration: string;
  image: string;
  userId: string;
  likers: IUser[];
}