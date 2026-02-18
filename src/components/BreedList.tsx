import { useEffect, useState } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import type { BreedItem } from '../api/dogApi'
import { fetchBreeds } from '../api/dogApi'

type Props = {
  onSelect?: (breedId: string) => void
}

export default function BreedList({ onSelect }: Props) {
  const [breeds, setBreeds] = useState<BreedItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBreed, setSelectedBreed] = useState<BreedItem | null>(null)
  const [query, setQuery] = useState('')

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

  const filteredBreeds =
    query === ''
      ? breeds || []
      : (breeds || []).filter((breed) =>
          breed.display.toLowerCase().includes(query.toLowerCase())
        )

  const handleChange = (breed: BreedItem | null) => {
    setSelectedBreed(breed)
    if (onSelect) {
      onSelect(breed?.id || null)
    }
  }

  if (loading) return <p>Loading breeds...</p>
  if (error) return <p role="alert">{error}</p>
  if (!breeds || breeds.length === 0) return <p>No breeds found.</p>

  return (
    <div className="breed-list-container">
      <Combobox value={selectedBreed} onChange={handleChange} onClose={() => setQuery('')}>
        <div className="combobox-wrapper">
          <ComboboxInput
            className="breed-select"
            displayValue={(breed: BreedItem | null) => breed?.display || ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for a breed..."
          />
          <ComboboxButton className="combobox-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="combobox-icon"
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className="combobox-options"
        >
          {filteredBreeds.length === 0 ? (
            <div className="combobox-option no-results">No breeds found</div>
          ) : (
            filteredBreeds.map((breed) => (
              <ComboboxOption
                key={breed.id}
                value={breed}
                className="combobox-option"
              >
                {breed.display}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </Combobox>
    </div>
  )
}
