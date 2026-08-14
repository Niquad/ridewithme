import { useState, useMemo } from 'react'
import {
  MOCK_VEHICLES,
  filterVehicles,
  formatPrice,
  getVehicleById,
  type ListingType,
} from '@ridewithme/shared'
import './App.css'

const FILTER_TABS: { label: string; value: ListingType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Buy', value: 'buy' },
  { label: 'Rent', value: 'rent' },
  { label: 'Lease', value: 'lease' },
  { label: 'Auction', value: 'auction' },
]

const ACTION_LABEL: Record<ListingType, string> = {
  buy: 'Buy Now',
  rent: 'Rent This',
  lease: 'Lease This',
  auction: 'Place Bid',
}

function App() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<ListingType | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const vehicles = useMemo(() => {
    return filterVehicles(MOCK_VEHICLES, {
      query: query || undefined,
      listingType: activeFilter === 'all' ? undefined : activeFilter,
    })
  }, [query, activeFilter])

  const selectedVehicle = selectedId ? getVehicleById(MOCK_VEHICLES, selectedId) : undefined

  if (selectedVehicle) {
    return (
      <div className="app">
        <button className="back-btn" onClick={() => setSelectedId(null)}>
          ← Back to marketplace
        </button>
        <div className="detail">
          <img className="detail-image" src={selectedVehicle.imageUrl} alt={`${selectedVehicle.make} ${selectedVehicle.model}`} />
          <div className="detail-body">
            <span className={`badge badge-${selectedVehicle.listingType}`}>{selectedVehicle.listingType}</span>
            <h1 className="detail-title">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</h1>
            <p className="detail-price">{formatPrice(selectedVehicle.price, selectedVehicle.listingType)}</p>

            <div className="spec-grid">
              <div className="spec">
                <span className="spec-label">Mileage</span>
                <span className="spec-value">{selectedVehicle.mileage.toLocaleString()} mi</span>
              </div>
              <div className="spec">
                <span className="spec-label">Location</span>
                <span className="spec-value">{selectedVehicle.location}</span>
              </div>
              <div className="spec">
                <span className="spec-label">Year</span>
                <span className="spec-value">{selectedVehicle.year}</span>
              </div>
              <div className="spec">
                <span className="spec-label">Type</span>
                <span className="spec-value">{selectedVehicle.listingType}</span>
              </div>
            </div>

            <button className="action-btn">{ACTION_LABEL[selectedVehicle.listingType]}</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Ride<span>WithMe</span></h1>
        <input
          className="search"
          type="text"
          placeholder="Search make, model, year..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      <div className="tabs">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`tab ${activeFilter === tab.value ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid">
        {vehicles.map((v) => (
          <div className="vehicle-card" key={v.id} onClick={() => setSelectedId(v.id)}>
            <img src={v.imageUrl} alt={`${v.make} ${v.model}`} />
            <div className="vehicle-info">
              <h3>{v.year} {v.make} {v.model}</h3>
              <p className="price">{formatPrice(v.price, v.listingType)}</p>
              <p className="meta">{v.mileage.toLocaleString()} mi · {v.location}</p>
              <span className={`badge badge-${v.listingType}`}>{v.listingType}</span>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && <p className="empty">No vehicles match your search.</p>}
      </div>
    </div>
  )
}

export default App
