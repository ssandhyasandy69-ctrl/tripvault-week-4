import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TripCard from '../components/TripCard';
import TripCardSkeleton from '../components/TripCardSkeleton';
import TripForm from '../components/TripForm';

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load trips';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const openCreateForm = () => {
    setEditingTrip(null);
    setShowForm(true);
  };

  const openEditForm = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTrip(null);
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      if (editingTrip) {
        await api.put(`/trips/${editingTrip._id}`, formData);
        toast.success('Trip updated');
      } else {
        await api.post('/trips', formData);
        toast.success('Trip created');
      }
      closeForm();
      await fetchTrips();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save trip';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (trip) => {
    const confirmed = window.confirm(`Delete "${trip.title}"? This can't be undone.`);
    if (!confirmed) return;

    try {
      await api.delete(`/trips/${trip._id}`);
      toast.success('Trip deleted');
      await fetchTrips();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete trip';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Welcome, {user?.name} 👋</h1>
          <p>Here are your travel memories</p>
        </div>
        <div className="dashboard-header-actions">
          <button onClick={openCreateForm}>+ Create Trip</button>
        </div>
      </header>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <div className="trip-grid">
          <TripCardSkeleton />
          <TripCardSkeleton />
          <TripCardSkeleton />
        </div>
      ) : trips.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-icon">🧳</p>
          <p>You haven't added any trips yet. Start your journey!</p>
          <button onClick={openCreateForm}>Create your first trip</button>
        </div>
      ) : (
        <div className="trip-grid">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TripForm
          initialTrip={editingTrip}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          submitting={submitting}
        />
      )}
    </div>
  );
}
