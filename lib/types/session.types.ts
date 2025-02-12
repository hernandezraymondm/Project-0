export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Session {
  user: User;
}
