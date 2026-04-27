import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import { Vehicle } from '../types'

interface VehicleCardProps {
  vehicle: Vehicle
  showReserve?: boolean
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80'

// Generic extra images to create a gallery if the vehicle doesn't have an images array
const EXTRA_IMAGES = [
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80'
]

export default function VehicleCard({ vehicle, showReserve = true }: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Use the vehicle's images array if available, otherwise build one from image_url + extras
  const gallery = vehicle.images && vehicle.images.length > 0
    ? vehicle.images
    : [vehicle.image_url || PLACEHOLDER, ...EXTRA_IMAGES]

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))
  }

  return (
    <div className="card-dark overflow-hidden group hover:border-accent/30 transition-all duration-300 hover:shadow-neon">
      {/* Image Gallery */}
      <div className="relative h-44 bg-bg-card2 overflow-hidden group/gallery">
        <img
          src={gallery[currentImageIndex]}
          alt={`${vehicle.brand} ${vehicle.model} - Photo ${currentImageIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER }}
        />
        
        {/* Gallery Controls */}
        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-200 z-10">
          <button 
            onClick={prevImage}
            className="p-1 rounded-full bg-black/50 text-white hover:bg-accent hover:text-black transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextImage}
            className="p-1 rounded-full bg-black/50 text-white hover:bg-accent hover:text-black transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Indicators */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {gallery.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-accent' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent pointer-events-none" />
        {vehicle.category && (
          <span className="absolute top-3 right-3 text-xs font-semibold bg-accent/20 text-accent border border-accent/30 rounded-full px-2.5 py-0.5 z-10">
            {vehicle.category}
          </span>
        )}
        {!vehicle.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 pointer-events-none">
            <span className="text-white/80 text-sm font-semibold">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-bg-card2 border border-white/10 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-white/40">{vehicle.brand}</p>
              <p className="text-sm font-semibold text-white leading-tight">{vehicle.model}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-accent font-bold text-lg">${vehicle.price_per_day}</p>
            <p className="text-white/30 text-xs">/day</p>
          </div>
        </div>

        {showReserve && vehicle.available && (
          <Link
            to={`/reserve/${vehicle.id}`}
            className="flex items-center justify-between w-full mt-4 bg-accent/10 hover:bg-accent text-accent hover:text-black rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 group/btn"
          >
            Reserve Now
            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  )
}
