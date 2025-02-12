import { User } from "./user.types";

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, code?: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<any>;
  loading: boolean;
  // fetchUser: (token?: string) => Promise<void>;
}
