export default function TripCardSkeleton() {
  return (
    <div className="trip-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-line" style={{ width: '60%' }}></div>
      <div className="skeleton skeleton-line" style={{ width: '40%' }}></div>
      <div className="skeleton skeleton-line" style={{ width: '90%' }}></div>
      <div className="skeleton-card-actions">
        <div className="skeleton skeleton-btn"></div>
        <div className="skeleton skeleton-btn"></div>
      </div>
    </div>
  );
}
