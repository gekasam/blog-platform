export type User = {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string | null;
};

export type UserLoginBody = {
  user: {
    email: string;
    password: string;
  };
};

export type UserCreationBody = {
  user: {
    username: string;
    email: string;
    password: string;
  };
};

export type ProfileEditingBody = {
  user: {
    email: string;
    username: string;
    bio?: string;
    image?: string | null;
    password?: string | null;
  };
};
