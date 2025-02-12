export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string | null;
}

export interface Session {
  user: User;
}
