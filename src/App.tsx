import { useState } from 'react'
import './App.css'
import BreedList from './components/BreedList'

function App() {
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null)

  return (
    <div id="root">
      <h1>Dog Breed Viewer</h1>
      <p>Select a breed to view cute images</p>
      <BreedList onSelect={(id) => setSelectedBreed(id || null)} />

      {selectedBreed && (
        <p style={{ marginTop: '1rem' }}>
          Selected: <strong>{selectedBreed}</strong>
        </p>
      )}
    </div>
  )
}

export default App
