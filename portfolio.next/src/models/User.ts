export interface BaseUser {
  username: string;
  isAdmin: boolean;
}

export interface User extends BaseUser {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreate extends BaseUser {
  password: string;
}

export interface UserUpdate extends Partial<BaseUser> {
  password?: string;
}
