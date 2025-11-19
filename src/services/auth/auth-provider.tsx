"use client";

import { User } from "@/services/api/types/user";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthActionsContext,
  AuthContext,
  AuthTokensContext,
  TokensInfo,
} from "./auth-context";
import { supabase } from "@/lib/supabase/client";
import { getCurrentProfile, signOut } from "@/services/supabase/auth";

function AuthProvider(props: PropsWithChildren) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Legacy token setter - kept for compatibility but mostly unused with Supabase
  const setTokensInfo = useCallback((tokensInfo: TokensInfo) => {
    // Supabase handles tokens internally
  }, []);

  const logOut = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const profile = await getCurrentProfile();
      if (profile) {
        // Map Supabase profile to User type
        const mappedUser: User = {
          id: profile.id,
          email: profile.email,
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          photo: profile.avatar_url ? { id: "", path: profile.avatar_url } : undefined,
          role: {
            id: 2, // RoleEnum.USER
            name: "User",
          },
          provider: undefined, // Set if needed based on auth provider
          socialId: undefined,
        };
        setUser(mappedUser); 
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      setUser(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Initial load
    loadUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoaded(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUser]);

  const contextValue = useMemo(
    () => ({
      isLoaded,
      user,
    }),
    [isLoaded, user]
  );

  const contextActionsValue = useMemo(
    () => ({
      setUser,
      logOut,
    }),
    [logOut]
  );

  const contextTokensValue = useMemo(
    () => ({
      setTokensInfo,
    }),
    [setTokensInfo]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <AuthActionsContext.Provider value={contextActionsValue}>
        <AuthTokensContext.Provider value={contextTokensValue}>
          {props.children}
        </AuthTokensContext.Provider>
      </AuthActionsContext.Provider>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
