import { toast } from 'sonner';

const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export interface Movie {
  id: string;
  title: string;
  description?: string;
  posterUrl?: string;
  trailerUrl?: string;
  duration: number;
  releaseDate: string;
  status: string; // "NOW_SHOWING" hoặc "COMING_SOON"
}

export interface Showtime {
  id: string;
  movieId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  priceBase: number;
}

export interface MovieWithShowtimes extends Movie {
  showtimes?: Showtime[];
}

export async function getAllMovies(): Promise<{ success: boolean; data?: Movie[]; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/movies`);
    if (!res.ok) throw new Error('Không lấy được danh sách phim');
    const data = await res.json();
    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Lỗi' };
  }
}

export async function getActiveMovies(): Promise<{ success: boolean; data?: Movie[]; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/movies?status=NOW_SHOWING`);
    if (!res.ok) throw new Error('Lỗi server');
    const data = await res.json();
    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Lỗi' };
  }
}

// Thêm hàm lấy phim sắp chiếu
export async function getComingSoonMovies(): Promise<{ success: boolean; data?: Movie[]; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/movies?status=COMING_SOON`);
    if (!res.ok) throw new Error('Lỗi server');
    const data = await res.json();
    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, error: 'Lỗi' };
  }
}

export async function getMovieById(movieId: string): Promise<{ success: boolean; data?: Movie; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/movies/${movieId}`);
    if (!res.ok) throw new Error('Không tìm thấy phim');
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Lỗi' };
  }
}

// Admin API
export async function createMovie(movie: Omit<Movie, 'id'>): Promise<{ success: boolean; data?: Movie; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/admin/movies`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(movie) });
    if (!res.ok) throw new Error('Lỗi tạo phim');
    const data = await res.json();
    toast.success('Thành công', { description: 'Đã thêm phim.' });
    return { success: true, data };
  } catch (err) { return { success: false, error: 'Lỗi' }; }
}

export async function updateMovie(movieId: string, updates: Partial<Movie>): Promise<{ success: boolean; data?: Movie; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/admin/movies/${movieId}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(updates) });
    if (!res.ok) throw new Error('Lỗi update');
    const data = await res.json();
    toast.success('Thành công', { description: 'Đã cập nhật phim.' });
    return { success: true, data };
  } catch (err) { return { success: false, error: 'Lỗi' }; }
}

export async function deleteMovie(movieId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/admin/movies/${movieId}`, { method: 'DELETE', headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Lỗi xóa phim');
    toast.success('Đã xóa', { description: 'Phim đã bị gỡ.' });
    return { success: true };
  } catch (err) { return { success: false, error: 'Lỗi' }; }
}