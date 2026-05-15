/**
 * Staff session management - role and clock-in state using Supabase
 */

import { supabase } from '../../lib/supabaseClient';
import type { StaffRole } from '../components/StaffLayout';

export const TABLE_STAFF_SESSIONS = "staff_sessions";

export interface StaffSessionRecord {
  id?: string;
  role: StaffRole;
  clock_in_iso?: string;
  clock_out_iso?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function loadCurrentStaffSession(): Promise<{ role: StaffRole | null; clockInAt: Date | null }> {
  try {
    const { data, error } = await supabase
      .from(TABLE_STAFF_SESSIONS)
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw error;
    }
    
    if (data) {
      return {
        role: data.role as StaffRole,
        clockInAt: data.clock_in_iso ? new Date(data.clock_in_iso) : null
      };
    }
    
    return { role: null, clockInAt: null };
  } catch (error) {
    console.error('Error loading staff session:', error);
    return { role: null, clockInAt: null };
  }
}

export async function saveStaffRole(role: StaffRole): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE_STAFF_SESSIONS)
      .upsert({
        role,
        is_active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error saving staff role:', error);
  }
}

export async function clockIn(): Promise<Date> {
  const now = new Date();
  
  try {
    const { error } = await supabase
      .from(TABLE_STAFF_SESSIONS)
      .upsert({
        clock_in_iso: now.toISOString(),
        is_active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
    
    if (error) throw error;
    return now;
  } catch (error) {
    console.error('Error clocking in:', error);
    throw error;
  }
}

export async function clockOut(): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE_STAFF_SESSIONS)
      .update({
        clock_out_iso: new Date().toISOString(),
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('is_active', true);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error clocking out:', error);
    throw error;
  }
}
