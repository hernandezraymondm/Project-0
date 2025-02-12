import { Session } from "@/lib/types/session.types";

export interface AuthContextType {
  session: Session | null;
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
