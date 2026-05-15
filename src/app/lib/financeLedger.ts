/**
 * Finance voids / refunds — booking refs excluded from revenue reconciliation.
 */

import { supabase } from '../../lib/supabaseClient';

export const TABLE_FINANCE_VOID_REFS = "finance_void_booking_refs";

export async function loadVoidBookingRefs(): Promise<Set<string>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_FINANCE_VOID_REFS)
      .select('booking_ref');
    
    if (error) throw error;
    
    const arr = data?.map(item => item.booking_ref) || [];
    return new Set(arr.map((x) => x.trim().toUpperCase()).filter(Boolean));
  } catch (error) {
    console.error('Error loading void booking refs:', error);
    return new Set();
  }
}

export async function markBookingRefVoid(bookingRef: string): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE_FINANCE_VOID_REFS)
      .upsert({
        booking_ref: bookingRef.trim().toUpperCase(),
        created_at: new Date().toISOString()
      }, {
        onConflict: 'booking_ref'
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error marking booking ref void:', error);
  }
}

export const TABLE_FINANCE_VOID_TXN = "finance_void_txn_ids";

export async function loadVoidTxnIds(): Promise<Set<string>> {
  try {
    const { data, error } = await supabase
      .from(TABLE_FINANCE_VOID_TXN)
      .select('txn_id');
    
    if (error) throw error;
    
    const arr = data?.map(item => item.txn_id) || [];
    return new Set(arr.map((x) => x.trim()).filter(Boolean));
  } catch (error) {
    console.error('Error loading void txn ids:', error);
    return new Set();
  }
}

export async function markTxnVoid(txnId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from(TABLE_FINANCE_VOID_TXN)
      .upsert({
        txn_id: txnId.trim(),
        created_at: new Date().toISOString()
      }, {
        onConflict: 'txn_id'
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Error marking txn void:', error);
  }
}
