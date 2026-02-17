import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BreedList from '../components/BreedList'
import * as dogApi from '../api/dogApi'

vi.mock('../api/dogApi')

describe('BreedList', () => {
  it('should show loading state initially', () => {
    vi.mocked(dogApi.fetchBreeds).mockImplementation(
      () => new Promise(() => {})
    )

    render(<BreedList />)
    expect(screen.getByText('Loading breeds...')).toBeInTheDocument()
  })

  it('should display breeds after successful fetch', async () => {
    const mockBreeds = [
      { id: 'labrador', breed: 'labrador', display: 'labrador' },
      { id: 'poodle', breed: 'poodle', display: 'poodle' },
    ]

    vi.mocked(dogApi.fetchBreeds).mockResolvedValueOnce(mockBreeds)

    render(<BreedList />)

    await waitFor(() => {
      expect(screen.getByText('labrador')).toBeInTheDocument()
      expect(screen.getByText('poodle')).toBeInTheDocument()
    })
  })

  it('should display error message on fetch failure', async () => {
    vi.mocked(dogApi.fetchBreeds).mockRejectedValueOnce(new Error('Network error'))

    render(<BreedList />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Unable to load breed list. Please try again later.'
      )
    })
  })

  it('should call onSelect when a breed is selected', async () => {
    const mockBreeds = [
      { id: 'labrador', breed: 'labrador', display: 'labrador' },
      { id: 'poodle', breed: 'poodle', display: 'poodle' },
    ]

    vi.mocked(dogApi.fetchBreeds).mockResolvedValueOnce(mockBreeds)

    const onSelectMock = vi.fn()
    render(<BreedList onSelect={onSelectMock} />)

    await waitFor(() => {
      expect(screen.getByText('labrador')).toBeInTheDocument()
    })

    const select = screen.getByLabelText('Choose a breed:')
    await userEvent.selectOptions(select, 'labrador')

    expect(onSelectMock).toHaveBeenCalledWith('labrador')
  })

  it('should show message when no breeds found', async () => {
    vi.mocked(dogApi.fetchBreeds).mockResolvedValueOnce([])

    render(<BreedList />)

    await waitFor(() => {
      expect(screen.getByText('No breeds found.')).toBeInTheDocument()
    })
  })
})
