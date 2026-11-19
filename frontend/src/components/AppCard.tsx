import { Link } from 'react-router-dom'
import { Star, Download, Folder, Edit, Eye } from 'lucide-react'
import { AppData } from '../types'

interface AppCardProps {
  app: AppData
  viewMode: 'grid' | 'list'
}

export default function AppCard({ app, viewMode }: AppCardProps) {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    
    return (
      <div className="stars">
        {Array(fullStars).fill(0).map((_, i) => (
          <span key={`full-${i}`} className="star">★</span>
        ))}
        {hasHalfStar && <span className="star">½</span>}
        {Array(emptyStars).fill(0).map((_, i) => (
          <span key={`empty-${i}`} className="star empty">★</span>
        ))}
      </div>
    )
  }

  const getSourceIcon = () => {
    switch (app.sourceType) {
      case 'playstore':
        return '📱'
      case 'website':
        return '🌐'
      default:
        return '📁'
    }
  }

  return (
    <div className={`card fade-in ${viewMode === 'list' ? 'flex' : ''}`}>
      {viewMode === 'grid' ? (
        <>
          {/* Ikona i obrazek */}
          <div className="mb-4">
            {app.icon && (
              <img
                src={app.icon}
                alt={app.name}
                className="w-20 h-20 rounded-xl object-cover mx-auto mb-3"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23333"/><text x="50" y="55" text-anchor="middle" fill="%23fff" font-size="40">{encodeURIComponent(getSourceIcon())}</text></svg>`
                }}
              />
            )}
          </div>
          
          {/* Nazwa i kategoria */}
          <h3 className="h3 text-lg mb-2 truncate">{app.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm bg-tertiary px-2 py-1 rounded">{app.category}</span>
            <span className="text-xs text-muted">{getSourceIcon()} {app.sourceType}</span>
          </div>
          
          {/* Opis */}
          <p className="text-sm text-muted mb-3 line-clamp-3">{app.description}</p>
          
          {/* Ocena */}
          <div className="rating mb-3">
            {renderStars(app.rating)}
            <span className="text-sm text-muted">({app.reviewsCount})</span>
          </div>
          
          {/* Tagi */}
          {app.tags.length > 0 && (
            <div className="mb-4">
              {app.tags.slice(0, 3).map(tag => (
                <span key={tag} className="tag tag-neon">{tag}</span>
              ))}
              {app.tags.length > 3 && (
                <span className="tag">+{app.tags.length - 3}</span>
              )}
            </div>
          )}
          
          {/* Link polecający */}
          {app.referralLink && (
            <div className="mb-3">
              <span className="text-xs bg-neon bg-opacity-20 text-neon px-2 py-1 rounded">
                Link polecający
              </span>
            </div>
          )}
          
          {/* Akcje */}
          <div className="flex justify-between items-center">
            <Link to={`/app/${app.id}`} className="btn btn-secondary btn-sm">
              <Eye size={16} /> Szczegóły
            </Link>
            <span className="text-xs text-muted">{app.version}</span>
          </div>
        </>
      ) : (
        <>
          {/* Widok listy */}
          <div className="flex-shrink-0 mr-4">
            {app.icon && (
              <img
                src={app.icon}
                alt={app.name}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23333"/><text x="50" y="55" text-anchor="middle" fill="%23fff" font-size="40">{encodeURIComponent(getSourceIcon())}</text></svg>`
                }}
              />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="h3 text-lg mb-1 truncate">{app.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm bg-tertiary px-2 py-1 rounded">{app.category}</span>
                  <span className="text-xs text-muted">{getSourceIcon()} {app.sourceType}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted mb-1">{app.version}</div>
                <div className="rating">
                  {renderStars(app.rating)}
                  <span className="text-sm text-muted">({app.reviewsCount})</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted mb-2 line-clamp-2">{app.description}</p>
            
            {app.tags.length > 0 && (
              <div className="mb-2">
                {app.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="tag tag-neon">{tag}</span>
                ))}
                {app.tags.length > 4 && (
                  <span className="tag">+{app.tags.length - 4}</span>
                )}
              </div>
            )}
            
            {app.referralLink && (
              <span className="text-xs bg-neon bg-opacity-20 text-neon px-2 py-1 rounded">
                Link polecający
              </span>
            )}
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <Link to={`/app/${app.id}`} className="btn btn-secondary btn-sm">
              <Eye size={16} /> Szczegóły
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
