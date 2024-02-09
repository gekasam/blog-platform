export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
};

export type ArticlesList = {
  articles: Article[];
  total: number;
};
