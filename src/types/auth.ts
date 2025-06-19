import { User, Session } from "@supabase/supabase-js";
import { Profile } from "./profile";

export interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    profile: Profile | null;
    signUp: (email: string, password: string, fullName: string, phone: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    changePassword: (newPassword: string) => Promise<boolean>;
}