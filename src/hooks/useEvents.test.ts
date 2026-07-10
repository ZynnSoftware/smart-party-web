import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/test/mocks/server'
import { useEvents } from './useEvents'

const API_URL = 'http://localhost:3000'

describe('useEvents', () => {
  it('loads the events with their totals', async () => {
    const { result } = renderHook(() => useEvents())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.events).toHaveLength(1)
    expect(result.current.events[0].estimatedTotal).toBe(254.4)
  })

  it('surfaces an error when the request fails', async () => {
    server.use(
      http.get(`${API_URL}/events`, () => new HttpResponse(null, { status: 500 })),
    )

    const { result } = renderHook(() => useEvents())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).not.toBeNull()
    expect(result.current.events).toHaveLength(0)
  })
})
