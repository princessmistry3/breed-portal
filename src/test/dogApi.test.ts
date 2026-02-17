import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchBreeds } from '../api/dogApi'

describe('fetchBreeds', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })

  it('should fetch and transform breed data correctly', async () => {
    const mockResponse = {
      message: {
        affenpinscher: [],
        bulldog: ['boston', 'english', 'french'],
        terrier: ['american', 'australian'],
      },
      status: 'success',
    }

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const breeds = await fetchBreeds()

    expect(breeds).toHaveLength(6)
    expect(breeds[0].display).toBe('affenpinscher')
    expect(breeds.find((b) => b.display === 'american terrier')).toBeDefined()
    expect(breeds.find((b) => b.display === 'boston bulldog')).toBeDefined()
  })

  it('should sort breeds alphabetically', async () => {
    const mockResponse = {
      message: {
        zebra: [],
        apple: [],
        mango: [],
      },
      status: 'success',
    }

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const breeds = await fetchBreeds()

    expect(breeds[0].display).toBe('apple')
    expect(breeds[1].display).toBe('mango')
    expect(breeds[2].display).toBe('zebra')
  })

  it('should handle breeds with sub-breeds correctly', async () => {
    const mockResponse = {
      message: {
        bulldog: ['boston', 'english'],
      },
      status: 'success',
    }

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const breeds = await fetchBreeds()

    expect(breeds).toHaveLength(2)
    expect(breeds[0].id).toBe('bulldog/boston')
    expect(breeds[0].breed).toBe('bulldog')
    expect(breeds[0].subBreed).toBe('boston')
    expect(breeds[0].display).toBe('boston bulldog')
  })

  it('should throw error when fetch fails', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
    } as Response)

    await expect(fetchBreeds()).rejects.toThrow('Unable to load breed list')
  })
})
