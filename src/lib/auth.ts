/**
 * Authentication system using Custom Node.js Backend
 * Handles login, logout, and session management
 */

import { toast } from 'sonner';

const API_URL = `${(import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api'}/auth`;

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
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (res.ok && json.token) {
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));
      
      const user: AuthUser = json.user;
      toast.success('Đăng nhập thành công', { description: `Chào mừng trở lại, ${user.name || user.email}!` });
      return { success: true, user };
    } else {
      const errorMessage = json.error || 'Sai email hoặc mật khẩu';
      toast.error('Đăng nhập thất bại', { description: errorMessage });
      return { success: false, error: errorMessage };
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    toast.error('Lỗi kết nối', { description: 'Không thể kết nối đến server backend.' });
    return { success: false, error: errorMessage };
  }
}

/**
 * Sign up with email, password, and additional metadata
 */
export async function signUp(email: string, password: string, name: string, role: string = 'CUSTOMER'): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const json = await res.json();

    if (res.ok) {
      toast.success('Đăng ký thành công!', { description: 'Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.' });
      return { success: true };
    } else {
      const errorMessage = json.error || 'Đăng ký thất bại';
      toast.error('Đăng ký thất bại', { description: errorMessage });
      return { success: false, error: errorMessage };
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    toast.error('Lỗi kết nối', { description: 'Không thể kết nối đến server backend.' });
    return { success: false, error: errorMessage };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success('Đã đăng xuất', { description: 'Bạn đã đăng xuất thành công.' });
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    toast.error('Đăng xuất thất bại', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (userStr && token) {
      return JSON.parse(userStr) as AuthUser;
    }
    return null;
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
    const token = localStorage.getItem("token");
    if (!token) return null;
    return { access_token: token };
  } catch (err) {
    console.error('Error getting session:', err);
    return null;
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  toast.error('Tính năng chưa hỗ trợ', { description: 'Backend hiện tại chưa hỗ trợ reset mật khẩu.' });
  return { success: false, error: "Not implemented in custom backend" };
}

/**
 * Sign in with Real Google Credential (JWT)
 */
export async function signInWithGoogleReal(credential: string): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_URL}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    });

    const json = await res.json();

    if (res.ok && json.token) {
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));
      toast.success('Đăng nhập Google thành công!', { description: `Xin chào, ${json.user.name}!` });
      return { success: true, user: json.user };
    } else {
      const errorMessage = json.error || 'Lỗi đăng nhập Google';
      toast.error('Đăng nhập thất bại', { description: errorMessage });
      return { success: false, error: errorMessage };
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    toast.error('Lỗi kết nối', { description: 'Không thể kết nối đến server backend.' });
    return { success: false, error: errorMessage };
  }
}

/**
 * Sign in with Real Facebook Access Token
 */
export async function signInWithFacebookReal(accessToken: string): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_URL}/facebook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });

    const json = await res.json();

    if (res.ok && json.token) {
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));
      toast.success('Đăng nhập Facebook thành công!', { description: `Xin chào, ${json.user.name}!` });
      return { success: true, user: json.user };
    } else {
      const errorMessage = json.error || 'Lỗi đăng nhập Facebook';
      toast.error('Đăng nhập thất bại', { description: errorMessage });
      return { success: false, error: errorMessage };
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    toast.error('Lỗi kết nối', { description: 'Không thể kết nối đến server backend.' });
    return { success: false, error: errorMessage };
  }
}

/**
 * Sign in with social provider (Google or Facebook)
 */
export async function signInWithSocial(provider: 'google' | 'facebook'): Promise<AuthResponse> {
  try {
    // ⚠️ LƯU Ý: Đây là hộp thoại giả lập (Mock) để demo luồng đăng nhập MXH.
    // Trong thực tế, bạn sẽ dùng thư viện (vd: @react-oauth/google) để lấy token thực tế.
    const email = window.prompt(`[MÔ PHỎNG ĐĂNG NHẬP ${provider.toUpperCase()}]\nVui lòng nhập email của bạn:`, `user_${provider}@gmail.com`);
    
    if (!email) {
      return { success: false, error: "Đã hủy đăng nhập" };
    }

    const name = email.split('@')[0];

    const res = await fetch(`${API_URL}/social`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, email, name }),
    });

    const json = await res.json();

    if (res.ok && json.token) {
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));
      toast.success(`Đăng nhập ${provider} thành công!`, { description: `Xin chào, ${json.user.name}!` });
      return { success: true, user: json.user };
    } else {
      const errorMessage = json.error || `Lỗi đăng nhập ${provider}`;
      toast.error('Đăng nhập thất bại', { description: errorMessage });
      return { success: false, error: errorMessage };
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    toast.error('Lỗi kết nối', { description: 'Không thể kết nối đến server backend.' });
    return { success: false, error: errorMessage };
  }
}

/**
 * Fetch user role from the profiles table
 */
export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const user = await getCurrentUser();
    if (user && user.id === userId) {
      return user.role || null;
    }
    return null;
  } catch (err) {
    console.error('Error fetching user role:', err);
    return null;
  }
}
