/**
 * End-of-shift records written on staff clock-out (StaffLayout) — read by Finance Shift Audit.
 */

import { supabase } from '../../lib/supabaseClient';

export type ShiftAuditRole = "counter_staff" | "ticket_checker" | "general_staff";

export const TABLE_SHIFT_AUDIT = "shift_audit";

export interface ShiftAuditRecord {
  id: string;
  role: ShiftAuditRole;
  clockInIso: string;
  clockOutIso: string;
  durationSec: number;
  /** Declared physical cash in drawer (counter); other roles may report 0 */
  reportedCashVnd: number;
  approved: boolean;
  approvedAtIso?: string;
}

export async function loadShiftAudits(): Promise<ShiftAuditRecord[]> {
  try {
    const { data, error } = await supabase
      .from(TABLE_SHIFT_AUDIT)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    
    if (error) throw error;
    
    return data as ShiftAuditRecord[] || [];
  } catch (error) {
    console.error('Error loading shift audits:', error);
    return [];
  }
}

export async function appendShiftAudit(record: ShiftAuditRecord): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE_SHIFT_AUDIT)
      .insert({
        ...record,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error appending shift audit:', error);
  }
}

export async function approveShiftAudit(id: string): Promise<void> {
  try {
    const now = new Date().toISOString();
    const { error } = await supabase
      .from(TABLE_SHIFT_AUDIT)
      .update({ 
        approved: true, 
        approvedAtIso: now 
      })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error approving shift audit:', error);
  }
}
