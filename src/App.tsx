import { useState } from 'react'
import './App.css'
import BreedList from './components/BreedList'
import BreedImages from './components/BreedImages'

function App() {
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null)

  return (
    <div id="root">
      <div className="app-container">
        <h1>Dog Breed Viewer</h1>
        <p>Select a breed to view cute images</p>
        
        <BreedList onSelect={(id) => setSelectedBreed(id || null)} />
        
        {selectedBreed && (
          <div className="images-section">
            <BreedImages breedId={selectedBreed} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
