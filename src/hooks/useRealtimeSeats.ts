import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'occupied';
  showtime_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface UseRealtimeSeatsReturn {
  seats: Seat[];
  loading: boolean;
  error: string | null;
  toggleSeat: (seatId: string) => Promise<void>;
  refreshSeats: () => Promise<void>;
}

export function useRealtimeSeats(showtimeId: string): UseRealtimeSeatsReturn {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial seats
  const fetchSeats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('seats')
        .select('*')
        .eq('showtime_id', showtimeId)
        .order('row', { ascending: true })
        .order('number', { ascending: true });

      if (fetchError) throw fetchError;
      
      setSeats(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch seats';
      setError(errorMessage);
      toast.error('Error', { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Toggle seat status
  const toggleSeat = async (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    
    if (!seat) {
      toast.error('Seat not found');
      return;
    }

    if (seat.status === 'occupied') {
      toast.error('Seat occupied', { description: 'This seat is already occupied and cannot be selected.' });
      return;
    }

    const newStatus = seat.status === 'available' ? 'selected' : 'available';

    try {
      // Optimistic update
      setSeats(prev => prev.map(s => 
        s.id === seatId ? { ...s, status: newStatus } : s
      ));

      const { error: updateError } = await supabase
        .from('seats')
        .update({ status: newStatus })
        .eq('id', seatId);

      if (updateError) throw updateError;

    } catch (err) {
      // Revert on error
      setSeats(prev => prev.map(s => 
        s.id === seatId ? { ...s, status: seat.status } : s
      ));
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to update seat';
      toast.error('Error', { description: errorMessage });
    }
  };

  useEffect(() => {
    fetchSeats();

    // Set up Realtime subscription
    const channel = supabase
      .channel(`seats-${showtimeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'seats',
          filter: `showtime_id=eq.${showtimeId}`,
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          if (eventType === 'INSERT') {
            setSeats(prev => [...prev, newRecord as Seat]);
          } else if (eventType === 'UPDATE') {
            setSeats(prev => prev.map(seat => 
              seat.id === newRecord.id ? { ...seat, ...newRecord } as Seat : seat
            ));
          } else if (eventType === 'DELETE') {
            setSeats(prev => prev.filter(seat => seat.id !== oldRecord.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [showtimeId]);

  return {
    seats,
    loading,
    error,
    toggleSeat,
    refreshSeats: fetchSeats,
  };
}
