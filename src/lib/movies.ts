/**
 * Movies & Showtimes Data Layer
 * Handles CRUD operations for movies and showtimes in Supabase
 */

import { supabase } from './supabaseClient';
import { toast } from 'sonner';

export interface Movie {
  id: string;
  title: string;
  original_title?: string;
  genre: string;
  duration_minutes: number;
  poster_url?: string;
  description?: string;
  release_date?: string;
  rating?: string;
  language?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Showtime {
  id: string;
  movie_id: string;
  hall: string;
  date: string;
  time: string;
  format: '2D' | '3D' | 'IMAX' | '4DX';
  price_standard: number;
  price_premium: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MovieWithShowtimes extends Movie {
  showtimes?: Showtime[];
}

// ==================== MOVIE CRUD ====================

/**
 * Get all movies
 */
export async function getAllMovies(): Promise<{ success: boolean; data?: Movie[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch movies';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Get active movies only
 */
export async function getActiveMovies(): Promise<{ success: boolean; data?: Movie[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch active movies';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Get a single movie by ID
 */
export async function getMovieById(movieId: string): Promise<{ success: boolean; data?: Movie; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', movieId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch movie';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Create a new movie
 */
export async function createMovie(movie: Omit<Movie, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: Movie; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('movies')
      .insert(movie)
      .select()
      .single();

    if (error) throw error;

    toast.success('Movie created', { description: `${movie.title} has been added successfully.` });
    return { success: true, data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create movie';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Update an existing movie
 */
export async function updateMovie(movieId: string, updates: Partial<Omit<Movie, 'id' | 'created_at' | 'updated_at'>>): Promise<{ success: boolean; data?: Movie; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('movies')
      .update(updates)
      .eq('id', movieId)
      .select()
      .single();

    if (error) throw error;

    toast.success('Movie updated', { description: 'Movie details have been updated successfully.' });
    return { success: true, data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update movie';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete a movie (soft delete by setting is_active to false)
 */
export async function deleteMovie(movieId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('movies')
      .update({ is_active: false })
      .eq('id', movieId);

    if (error) throw error;

    toast.success('Movie deleted', { description: 'Movie has been deactivated.' });
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete movie';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

// ==================== SHOWTIME CRUD ====================

/**
 * Get all showtimes
 */
export async function getAllShowtimes(): Promise<{ success: boolean; data?: Showtime[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('showtimes')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch showtimes';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Get showtimes for a specific movie
 */
export async function getShowtimesByMovie(movieId: string): Promise<{ success: boolean; data?: Showtime[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('showtimes')
      .select('*')
      .eq('movie_id', movieId)
      .eq('is_active', true)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch showtimes';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Get showtimes for a specific date
 */
export async function getShowtimesByDate(date: string): Promise<{ success: boolean; data?: Showtime[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('showtimes')
      .select('*, movies(*)')
      .eq('date', date)
      .eq('is_active', true)
      .order('time', { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch showtimes';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Get movies with their showtimes
 */
export async function getMoviesWithShowtimes(): Promise<{ success: boolean; data?: MovieWithShowtimes[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*, showtimes(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch movies with showtimes';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Create a new showtime
 */
export async function createShowtime(showtime: Omit<Showtime, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: Showtime; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('showtimes')
      .insert(showtime)
      .select()
      .single();

    if (error) throw error;

    toast.success('Showtime created', { description: 'Showtime has been scheduled successfully.' });
    return { success: true, data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create showtime';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Update an existing showtime
 */
export async function updateShowtime(showtimeId: string, updates: Partial<Omit<Showtime, 'id' | 'created_at' | 'updated_at'>>): Promise<{ success: boolean; data?: Showtime; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('showtimes')
      .update(updates)
      .eq('id', showtimeId)
      .select()
      .single();

    if (error) throw error;

    toast.success('Showtime updated', { description: 'Showtime has been updated successfully.' });
    return { success: true, data };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update showtime';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete a showtime (soft delete by setting is_active to false)
 */
export async function deleteShowtime(showtimeId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('showtimes')
      .update({ is_active: false })
      .eq('id', showtimeId);

    if (error) throw error;

    toast.success('Showtime deleted', { description: 'Showtime has been deactivated.' });
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete showtime';
    toast.error('Error', { description: errorMessage });
    return { success: false, error: errorMessage };
  }
}
