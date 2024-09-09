import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  OAuthResponse,
  Session,
  User,
} from "@supabase/supabase-js";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import supabase from "@/config/supabase";

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<OAuthResponse>;
  signOut: () => Promise<AuthError> | void;
  signUp: (
    email: string,
    password: string,
    username: string,
  ) => Promise<AuthResponse>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResponse>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: () => Promise.resolve({} as OAuthResponse),
  signOut: () => {},
  signUp: () => Promise.resolve({} as AuthResponse),
  signInWithEmail: () => Promise.resolve({} as AuthResponse),
});

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("session onAuthStateChange: ", session);
        // setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      },
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: username,
        },
      },
    });
    console.log("data: ", data);
    console.log("error: ", error);
    return { data, error } as AuthResponse;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("data: ", data);
    console.log("error: ", error);
    return { data, error } as AuthTokenResponsePassword;
  };

  // In case we want to manually trigger a signIn (instead of using Auth UI)
  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { skipBrowserRedirect: false },
    });
    console.log("data: ", data);
    console.log("error: ", error);
    return { data, error } as OAuthResponse;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log("error: ", error);
    if (!error) {
      setUser(null);
      // setSession(null);
    }
    return error as AuthError;
  };

  return (
    <AuthContext.Provider
      value={{ user, signIn, signOut, signUp, signInWithEmail }}
    >
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
