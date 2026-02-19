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
    // Check if we are in a recovery flow (hash or search)
    const isRecovery = typeof window !== 'undefined' && (
      window.location.hash.includes('type=recovery') || 
      window.location.search.includes('type=recovery') ||
      window.location.hash.includes('access_token=') // Supabase often puts it in hash
    );

    if (isRecovery) {
      setUser(null);
      setIsLoaded(true);
      return;
    }

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
            id: (profile as any).role === 'admin' ? 1 : 2, // Map 'admin' to RoleEnum.ADMIN (1), 'user' to RoleEnum.USER (2)
            name: (profile as any).role === 'admin' ? 'Admin' : 'User',
          },
          provider: undefined,
          socialId: undefined,
          rsvpStatus: (profile as any).rsvp_status,
          createdAt: profile.created_at || new Date().toISOString(), // Fix lint error while at it
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
      } else if (event === 'PASSWORD_RECOVERY') {
        // When in password recovery mode, we don't want to log the user in automatically
        // to the app's UI state, as they should only be allowed to change their password.
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
