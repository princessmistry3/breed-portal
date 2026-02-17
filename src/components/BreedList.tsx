import { useEffect, useState } from 'react'
import type { BreedItem } from '../api/dogApi'
import { fetchBreeds } from '../api/dogApi'

type Props = {
  onSelect?: (breedId: string) => void
}

export default function BreedList({ onSelect }: Props) {
  const [breeds, setBreeds] = useState<BreedItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetchBreeds()
      .then((b) => {
        if (!mounted) return
        setBreeds(b)
        setError(null)
      })
      .catch(() => {
        if (!mounted) return
        setError('Unable to load breed list. Please try again later.')
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <p>Loading breeds...</p>
  if (error) return <p role="alert">{error}</p>
  if (!breeds || breeds.length === 0) return <p>No breeds found.</p>

  return (
    <div className="breed-list-container">
      <label htmlFor="breed-select">Choose a breed:</label>
      <select
        id="breed-select"
        className="breed-select"
        onChange={(e) => onSelect && onSelect(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          select a breed
        </option>
        {breeds.map((b) => (
          <option key={b.id} value={b.id}>
            {b.display}
          </option>
        ))}
      </select>
    </div>
  )
}
