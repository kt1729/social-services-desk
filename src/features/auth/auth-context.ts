import { createContext } from 'react';
import type { User } from 'firebase/auth';
import type { VolunteerRole } from '../../shared/types';

export interface VolunteerProfile {
  name: string;
  email: string;
  role: VolunteerRole;
}

export interface AuthContextValue {
  user: User | null;
  volunteer: VolunteerProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
