import { User } from "@/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthState {
  isGuest: boolean;
  user: User | null;
}

interface AuthContextType {
  auth: AuthState | null;
  login: (user: User) => void;
  loginAsGuest: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    const authState: AuthState = {
      isGuest: false,
      user,
    };
    setAuth(authState);
    localStorage.setItem("auth", JSON.stringify(authState));
  };

  const loginAsGuest = () => {
    const authState: AuthState = {
      isGuest: true,
      user: null,
    };
    setAuth(authState);
    localStorage.setItem("auth", JSON.stringify(authState));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider
      value={{ auth, login, loginAsGuest, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Custom hook for protecting routes
export function useRequireAuth(requireUser: boolean = true) {
  const { auth, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !auth) {
      router.push("/login");
    }

    if (!isLoading && requireUser && auth?.isGuest) {
      router.push("/login");
    }
  }, [auth, isLoading, requireUser, router]);

  return { auth, isLoading };
}

// Example usage:
/*
// In your _app.tsx or layout component:
function App() {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

// In a component:
function ProtectedComponent() {
  const { auth, isLoading } = useRequireAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return <div>Protected Content</div>;
}

// In a component that needs auth state:
function SomeComponent() {
  const { auth, login, loginAsGuest, logout } = useAuth();
  
  return (
    <div>
      {auth?.isGuest ? (
        <div>Guest User</div>
      ) : auth?.user ? (
        <div>Welcome {auth.user.username}</div>
      ) : (
        <div>Not logged in</div>
      )}
    </div>
  );
}
*/
