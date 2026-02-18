import { useEffect, useState } from 'react'

type Props = {
  breedId: string | null
}

export default function BreedImages({ breedId }: Props) {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!breedId) {
      return
    }

    let mounted = true
    
    const fetchImages = async () => {
      setLoading(true)
      setError(null)
      setImages([])

      try {
        const res = await fetch(`https://dog.ceo/api/breed/${breedId}/images/random/3`)
        if (!res.ok) throw new Error('Failed to fetch images')
        const data = await res.json()
        
        if (!mounted) return
        setImages(data.message || [])
      } catch {
        if (!mounted) return
        setError('Unable to load images. Please try again.')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchImages()

    return () => {
      mounted = false
    }
  }, [breedId])

  if (loading) return <p className="loading-text">Loading images...</p>

  if (error) return <p className="error-text" role="alert">{error}</p>

  if (images.length === 0) return <p>No images found for this breed.</p>

  return (
    <div className="images-container">
      <div className="images-grid">
        {images.map((url, index) => (
          <div key={url} className="image-card">
            <img
              src={url}
              alt={`Dog ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
