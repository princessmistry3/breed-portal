export type BreedItem = {
  id: string
  breed: string
  subBreed?: string
  display: string
}

const API_BASE = 'https://dog.ceo/api'

export async function fetchBreeds(): Promise<BreedItem[]> {
  const response = await fetch(`${API_BASE}/breeds/list/all`)
  if (!response.ok) throw new Error('Unable to load breed list. Please try again later.')
  const json = await response.json()
  const breedList: BreedItem[] = []
  for (const [breedName, subBreeds] of Object.entries<Record<string, string[]>>(json.message)) {
    if (Array.isArray(subBreeds) && subBreeds.length > 0) {
      for (const subBreed of subBreeds) {
        breedList.push({
          id: `${breedName}/${subBreed}`,
          breed: breedName,
          subBreed: subBreed,
          display: `${subBreed} ${breedName}`,
        })
      }
    } else {
      breedList.push({ id: breedName, breed: breedName, display: breedName })
    }
  }
  breedList.sort((a, b) => a.display.localeCompare(b.display))
  return breedList
}

export function getBreedImagesUrl(breedId: string, imageCount = 3) {
  return `${API_BASE}/breed/${breedId}/images/random/${imageCount}`
}
