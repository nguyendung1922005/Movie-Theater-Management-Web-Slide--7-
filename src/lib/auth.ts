/**
 * Authentication system using Supabase Auth
 * Handles staff login, logout, and session management
 */

import { supabase } from './supabaseClient';
import { toast } from 'sonner';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let errorMessage = 'Login failed';
      
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please confirm your email address';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please try again later';
      } else {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }

    if (!data.user) {
      return { success: false, error: 'No user data received' };
    }

    // Fetch role from profiles table
    const role = await getUserRole(data.user.id);

    // Get user metadata (role, name, etc.)
    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name,
      role: role || data.user.user_metadata?.role,
    };

    toast.success('Login successful', { description: `Welcome back, ${user.name || user.email}!` });
    return { success: true, user };

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    toast.error('Login failed', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Sign up with email, password, and additional metadata
 */
export async function signUp(email: string, password: string, name: string, role: string = 'general_staff'): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (error) {
      let errorMessage = 'Registration failed';
      
      // Handle specific error cases
      if (error.message.includes('User already registered') || error.message.includes('already been registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.message.includes('Password should be')) {
        errorMessage = 'Password must be at least 6 characters long';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address';
      } else {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }

    if (!data.user) {
      return { success: false, error: 'Registration failed - no user data received' };
    }

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name,
      role: data.user.user_metadata?.role,
    };

    toast.success('Account created!', { description: 'Your account has been created successfully.' });
    return { success: true, user };

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    toast.error('Registration failed', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      const errorMessage = error.message || 'Logout failed';
      toast.error('Logout failed', { description: errorMessage });
      return { success: false, error: errorMessage };
    }

    toast.success('Logged out', { description: 'You have been logged out successfully.' });
    return { success: true };

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    toast.error('Logout failed', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name,
      role: user.user_metadata?.role,
    };

  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    return session;

  } catch (err) {
    console.error('Error getting session:', err);
    return null;
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      const errorMessage = error.message || 'Password reset failed';
      toast.error('Reset failed', { description: errorMessage });
      return { success: false, error: errorMessage };
    }

    toast.success('Reset email sent', { description: 'Check your email for password reset instructions.' });
    return { success: true };

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    toast.error('Reset failed', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Sign in with social provider (Google or Facebook)
 */
export async function signInWithSocial(provider: 'google' | 'facebook'): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      const errorMessage = error.message || 'Social login failed';
      toast.error('Social login failed', { description: errorMessage });
      return { success: false, error: errorMessage };
    }

    // OAuth flow will redirect the user, so we don't need to return user data here
    return { success: true };

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    toast.error('Social login failed', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Fetch user role from the profiles table
 */
export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data.role;
  } catch (err) {
    console.error('Error fetching user role:', err);
    return null;
  }
}
