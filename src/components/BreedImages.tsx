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
      setImages([])
      setLoading(false)
      setError(null)
      return
    }

    let mounted = true
    setLoading(true)
    setError(null)

    fetch(`https://dog.ceo/api/breed/${breedId}/images/random/3`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch images')
        return res.json()
      })
      .then((data) => {
        if (!mounted) return
        setImages(data.message || [])
      })
      .catch(() => {
        if (!mounted) return
        setError('Unable to load images. Please try again.')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

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
