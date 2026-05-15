/**
 * Movies & Showtimes Manager
 * Allows cinema managers to add movies and schedule showtimes
 */

import { useState, useEffect } from 'react';
import { Film, Plus, Clock, Calendar, X, Edit, Trash2, Play, DollarSign } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { StaffPage, SC } from '../components/StaffLayout';
import { StaffRouteGuard } from '../components/StaffRouteGuard';
import {
  getAllMovies,
  getActiveMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getShowtimesByMovie,
  createShowtime,
  deleteShowtime,
  type Movie,
  type Showtime,
} from '../../lib/movies';

type ModalPhase = 'closed' | 'add-movie' | 'edit-movie' | 'add-showtime';

export function StaffMoviesManager() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [modalPhase, setModalPhase] = useState<ModalPhase>('closed');

  // Movie form state
  const [movieForm, setMovieForm] = useState({
    title: '',
    original_title: '',
    genre: '',
    duration_minutes: 120,
    poster_url: '',
    description: '',
    release_date: '',
    rating: '',
    language: '',
    is_active: true,
  });

  // Showtime form state
  const [showtimeForm, setShowtimeForm] = useState({
    movie_id: '',
    hall: 'Hall 1',
    date: '',
    time: '',
    format: '2D' as '2D' | '3D' | 'IMAX' | '4DX',
    price_standard: 100000,
    price_premium: 150000,
    is_active: true,
  });

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    const result = await getAllMovies();
    if (result.success && result.data) {
      setMovies(result.data);
    }
    setLoading(false);
  };

  const loadShowtimes = async (movieId: string) => {
    const result = await getShowtimesByMovie(movieId);
    if (result.success && result.data) {
      setShowtimes(result.data);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    loadShowtimes(movie.id);
  };

  const openAddMovieModal = () => {
    setMovieForm({
      title: '',
      original_title: '',
      genre: '',
      duration_minutes: 120,
      poster_url: '',
      description: '',
      release_date: '',
      rating: '',
      language: '',
      is_active: true,
    });
    setModalPhase('add-movie');
  };

  const openEditMovieModal = (movie: Movie) => {
    setMovieForm({
      title: movie.title,
      original_title: movie.original_title || '',
      genre: movie.genre,
      duration_minutes: movie.duration_minutes,
      poster_url: movie.poster_url || '',
      description: movie.description || '',
      release_date: movie.release_date || '',
      rating: movie.rating || '',
      language: movie.language || '',
      is_active: movie.is_active,
    });
    setSelectedMovie(movie);
    setModalPhase('edit-movie');
  };

  const openAddShowtimeModal = (movie: Movie) => {
    setShowtimeForm({
      movie_id: movie.id,
      hall: 'Hall 1',
      date: '',
      time: '',
      format: '2D',
      price_standard: 100000,
      price_premium: 150000,
      is_active: true,
    });
    setSelectedMovie(movie);
    setModalPhase('add-showtime');
  };

  const handleSaveMovie = async () => {
    if (!movieForm.title || !movieForm.genre) {
      toast.error('Validation error', { description: 'Title and genre are required.' });
      return;
    }

    const result = modalPhase === 'add-movie'
      ? await createMovie(movieForm)
      : await updateMovie(selectedMovie!.id, movieForm);

    if (result.success) {
      setModalPhase('closed');
      loadMovies();
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (!confirm('Are you sure you want to deactivate this movie?')) return;
    
    const result = await deleteMovie(movieId);
    if (result.success) {
      loadMovies();
      if (selectedMovie?.id === movieId) {
        setSelectedMovie(null);
        setShowtimes([]);
      }
    }
  };

  const handleSaveShowtime = async () => {
    if (!showtimeForm.date || !showtimeForm.time) {
      toast.error('Validation error', { description: 'Date and time are required.' });
      return;
    }

    const result = await createShowtime(showtimeForm);
    if (result.success) {
      setModalPhase('closed');
      if (selectedMovie) {
        loadShowtimes(selectedMovie.id);
      }
    }
  };

  const handleDeleteShowtime = async (showtimeId: string) => {
    if (!confirm('Are you sure you want to deactivate this showtime?')) return;
    
    const result = await deleteShowtime(showtimeId);
    if (result.success && selectedMovie) {
      loadShowtimes(selectedMovie.id);
    }
  };

  const formatVND = (n: number) => n.toLocaleString('vi-VN') + ' ₫';

  return (
    <StaffRouteGuard allow={['cinema_manager']}>
      <Toaster theme="dark" position="top-center" richColors closeButton />
      <StaffPage
        title="Movies & Showtimes Manager"
        subtitle="Manage your cinema's movie catalog and schedule showtimes"
        actions={
          <button
            type="button"
            onClick={openAddMovieModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all active:scale-[0.98]"
            style={{
              fontWeight: 800,
              fontSize: '0.82rem',
              background: `linear-gradient(135deg,${SC.red},#c8111f)`,
              boxShadow: '0 4px 20px rgba(232,25,44,0.38)',
              letterSpacing: '0.06em',
            }}
          >
            <Plus size={16} /> Add Movie
          </button>
        }
      >
        <div className="flex gap-6 pt-6">
          {/* Movies List */}
          <section
            className="w-1/2 rounded-3xl border p-6"
            style={{ backgroundColor: SC.cardAlt, borderColor: SC.border }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Film size={16} style={{ color: SC.red }} />
              <h2 className="text-white" style={{ fontWeight: 800, fontSize: '0.92rem' }}>
                Movies
              </h2>
              <span className="ml-auto text-white/35" style={{ fontSize: '0.72rem' }}>
                {movies.length} movies
              </span>
            </div>

            {loading ? (
              <div className="text-center py-8 text-white/35" style={{ fontSize: '0.82rem' }}>
                Loading movies...
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => handleSelectMovie(movie)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedMovie?.id === movie.id
                        ? 'border-[#e8192c] bg-[rgba(232,25,44,0.08)]'
                        : 'border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)]'
                    }`}
                    style={{
                      backgroundColor: selectedMovie?.id === movie.id ? '' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div className="flex gap-4">
                      {movie.poster_url && (
                        <img
                          src={movie.poster_url}
                          alt={movie.title}
                          className="w-16 h-24 object-cover rounded-lg"
                          style={{ backgroundColor: SC.card }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold truncate" style={{ fontSize: '0.9rem' }}>
                          {movie.title}
                        </h3>
                        {movie.original_title && (
                          <p className="text-white/45 truncate" style={{ fontSize: '0.75rem' }}>
                            {movie.original_title}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-white/35" style={{ fontSize: '0.7rem' }}>
                            {movie.genre}
                          </span>
                          <span className="text-white/35" style={{ fontSize: '0.7rem' }}>
                            {movie.duration_minutes} min
                          </span>
                          {movie.rating && (
                            <span className="text-white/35" style={{ fontSize: '0.7rem' }}>
                              {movie.rating}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAddShowtimeModal(movie);
                            }}
                            className="px-3 py-1.5 rounded-lg text-white text-xs font-bold transition-all hover:bg-[rgba(232,25,44,0.15)]"
                            style={{ backgroundColor: 'rgba(232,25,44,0.08)', border: '1px solid rgba(232,25,44,0.25)' }}
                          >
                            <Clock size={12} className="inline mr-1" /> Add Showtime
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditMovieModal(movie);
                            }}
                            className="px-3 py-1.5 rounded-lg text-white/45 text-xs font-bold transition-all hover:text-white hover:bg-white/5"
                          >
                            <Edit size={12} className="inline mr-1" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMovie(movie.id);
                            }}
                            className="px-3 py-1.5 rounded-lg text-white/45 text-xs font-bold transition-all hover:text-red-400 hover:bg-white/5"
                          >
                            <Trash2 size={12} className="inline mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Showtimes for Selected Movie */}
          <section
            className="flex-1 rounded-3xl border p-6"
            style={{ backgroundColor: SC.card, borderColor: SC.border }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} style={{ color: SC.green }} />
              <h2 className="text-white" style={{ fontWeight: 800, fontSize: '0.92rem' }}>
                Showtimes
              </h2>
              {selectedMovie && (
                <span className="ml-auto text-white/35" style={{ fontSize: '0.72rem' }}>
                  {selectedMovie.title}
                </span>
              )}
            </div>

            {!selectedMovie ? (
              <div className="text-center py-8 text-white/35" style={{ fontSize: '0.82rem' }}>
                Select a movie to view its showtimes
              </div>
            ) : showtimes.length === 0 ? (
              <div className="text-center py-8 text-white/35" style={{ fontSize: '0.82rem' }}>
                No showtimes scheduled for this movie
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {showtimes.map((showtime) => (
                  <div
                    key={showtime.id}
                    className="p-4 rounded-2xl border"
                    style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: SC.border }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-white font-bold" style={{ fontSize: '1.1rem' }}>
                            {showtime.time}
                          </div>
                          <div className="text-white/35" style={{ fontSize: '0.7rem' }}>
                            {showtime.date}
                          </div>
                        </div>
                        <div className="h-8 w-px" style={{ backgroundColor: SC.border }} />
                        <div>
                          <div className="text-white font-bold" style={{ fontSize: '0.85rem' }}>
                            {showtime.hall}
                          </div>
                          <div className="text-white/35" style={{ fontSize: '0.7rem' }}>
                            {showtime.format}
                          </div>
                        </div>
                        <div className="h-8 w-px" style={{ backgroundColor: SC.border }} />
                        <div>
                          <div className="text-white/35" style={{ fontSize: '0.7rem' }}>
                            Standard
                          </div>
                          <div className="text-white font-bold" style={{ fontSize: '0.85rem' }}>
                            {formatVND(showtime.price_standard)}
                          </div>
                        </div>
                        <div>
                          <div className="text-white/35" style={{ fontSize: '0.7rem' }}>
                            Premium
                          </div>
                          <div className="text-white font-bold" style={{ fontSize: '0.85rem' }}>
                            {formatVND(showtime.price_premium)}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteShowtime(showtime.id)}
                        className="p-2 rounded-lg text-white/35 hover:text-red-400 hover:bg-white/5 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Add/Edit Movie Modal */}
        {modalPhase === 'add-movie' || modalPhase === 'edit-movie' ? (
          <div
            className="fixed inset-0 z-[240] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(10,10,15,0.82)', backdropFilter: 'blur(14px)' }}
            role="dialog"
            aria-modal
          >
            <div
              className="w-full max-w-lg rounded-3xl border overflow-hidden"
              style={{
                backgroundColor: 'rgba(18,18,28,0.98)',
                borderColor: SC.borderHi,
                boxShadow: '0 32px 90px rgba(0,0,0,0.75)',
              }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: SC.border }}>
                <h2 className="text-white" style={{ fontWeight: 900, fontSize: '1.05rem' }}>
                  {modalPhase === 'add-movie' ? 'Add New Movie' : 'Edit Movie'}
                </h2>
                <button
                  type="button"
                  onClick={() => setModalPhase('closed')}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors"
                  style={{ borderColor: SC.border, color: SC.muted }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${SC.border}`,
                      fontWeight: 700,
                    }}
                    placeholder="Movie title"
                  />
                </div>

                <div>
                  <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                    Original Title
                  </label>
                  <input
                    type="text"
                    value={movieForm.original_title}
                    onChange={(e) => setMovieForm({ ...movieForm, original_title: e.target.value })}
                    className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${SC.border}`,
                      fontWeight: 700,
                    }}
                    placeholder="Original title (if different)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                      Genre *
                    </label>
                    <input
                      type="text"
                      value={movieForm.genre}
                      onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                      className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${SC.border}`,
                        fontWeight: 700,
                      }}
                      placeholder="Action, Drama, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      value={movieForm.duration_minutes}
                      onChange={(e) => setMovieForm({ ...movieForm, duration_minutes: parseInt(e.target.value) || 120 })}
                      className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${SC.border}`,
                        fontWeight: 700,
                      }}
                      placeholder="120"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                    Poster URL
                  </label>
                  <input
                    type="text"
                    value={movieForm.poster_url}
                    onChange={(e) => setMovieForm({ ...movieForm, poster_url: e.target.value })}
                    className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${SC.border}`,
                      fontWeight: 700,
                    }}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                    Description
                  </label>
                  <textarea
                    value={movieForm.description}
                    onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                    className="w-full rounded-2xl px-4 py-3 text-white outline-none resize-none"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${SC.border}`,
                      fontWeight: 700,
                      minHeight: 80,
                    }}
                    placeholder="Movie description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                      Release Date
                    </label>
                    <input
                      type="date"
                      value={movieForm.release_date}
                      onChange={(e) => setMovieForm({ ...movieForm, release_date: e.target.value })}
                      className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${SC.border}`,
                        fontWeight: 700,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                      Rating
                    </label>
                    <input
                      type="text"
                      value={movieForm.rating}
                      onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                      className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${SC.border}`,
                        fontWeight: 700,
                      }}
                      placeholder="PG-13, R, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                    Language
                  </label>
                  <input
                    type="text"
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${SC.border}`,
                      fontWeight: 700,
                    }}
                    placeholder="English, Vietnamese, etc."
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveMovie}
                  className="w-full py-3.5 rounded-2xl text-white"
                  style={{
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    background: `linear-gradient(135deg,${SC.red},#99101c)`,
                    boxShadow: '0 10px 32px rgba(232,25,44,0.38)',
                  }}
                >
                  {modalPhase === 'add-movie' ? 'Create Movie' : 'Update Movie'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Add Showtime Modal */}
        {modalPhase === 'add-showtime' ? (
          <div
            className="fixed inset-0 z-[240] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(10,10,15,0.82)', backdropFilter: 'blur(14px)' }}
            role="dialog"
            aria-modal
          >
            <div
              className="w-full max-w-lg rounded-3xl border overflow-hidden"
              style={{
                backgroundColor: 'rgba(18,18,28,0.98)',
                borderColor: SC.borderHi,
                boxShadow: '0 32px 90px rgba(0,0,0,0.75)',
              }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: SC.border }}>
                <h2 className="text-white" style={{ fontWeight: 900, fontSize: '1.05rem' }}>
                  Add Showtime
                </h2>
                <button
                  type="button"
                  onClick={() => setModalPhase('closed')}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors"
                  style={{ borderColor: SC.border, color: SC.muted }}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                    Movie
                  </label>
                  <div className="w-full rounded-2xl px-4 py-3 text-white/70" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${SC.border}` }}>
                    {selectedMovie?.title}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={showtimeForm.date}
                      onChange={(e) => setShowtimeForm({ ...showtimeForm, date: e.target.value })}
                      className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${SC.border}`,
                        fontWeight: 700,
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={showtimeForm.time}
                      onChange={(e) => setShowtimeForm({ ...showtimeForm, time: e.target.value })}
                      className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${SC.border}`,
                        fontWeight: 700,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                      Hall
                    </label>
                    <select
                      value={showtimeForm.hall}
                      onChange={(e) => setShowtimeForm({ ...showtimeForm, hall: e.target.value })}
                      className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${SC.border}`,
                        fontWeight: 700,
                      }}
                    >
                      <option value="Hall 1">Hall 1</option>
                      <option value="Hall 2">Hall 2</option>
                      <option value="Hall 3">Hall 3</option>
                      <option value="Hall 4">Hall 4</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                      Format
                    </label>
                    <select
                      value={showtimeForm.format}
                      onChange={(e) => setShowtimeForm({ ...showtimeForm, format: e.target.value as '2D' | '3D' | 'IMAX' | '4DX' })}
                      className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${SC.border}`,
                        fontWeight: 700,
                      }}
                    >
                      <option value="2D">2D</option>
                      <option value="3D">3D</option>
                      <option value="IMAX">IMAX</option>
                      <option value="4DX">4DX</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                      Standard Price (₫)
                    </label>
                    <input
                      type="number"
                      value={showtimeForm.price_standard}
                      onChange={(e) => setShowtimeForm({ ...showtimeForm, price_standard: parseInt(e.target.value) || 100000 })}
                      className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${SC.border}`,
                        fontWeight: 700,
                      }}
                      placeholder="100000"
                    />
                  </div>

                  <div>
                    <label className="block text-white/45 text-xs font-bold uppercase tracking-widest mb-2">
                      Premium Price (₫)
                    </label>
                    <input
                      type="number"
                      value={showtimeForm.price_premium}
                      onChange={(e) => setShowtimeForm({ ...showtimeForm, price_premium: parseInt(e.target.value) || 150000 })}
                      className="w-full rounded-2xl px-4 py-3 text-white outline-none"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: `1px solid ${SC.border}`,
                        fontWeight: 700,
                      }}
                      placeholder="150000"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveShowtime}
                  className="w-full py-3.5 rounded-2xl text-white"
                  style={{
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    background: `linear-gradient(135deg,${SC.red},#99101c)`,
                    boxShadow: '0 10px 32px rgba(232,25,44,0.38)',
                  }}
                >
                  Schedule Showtime
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </StaffPage>
    </StaffRouteGuard>
  );
}
