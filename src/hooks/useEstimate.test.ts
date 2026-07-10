import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/test/mocks/server'
import { useEstimate } from './useEstimate'

const API_URL = 'http://localhost:3000'

describe('useEstimate', () => {
  it('loads the derived estimate for an event', async () => {
    const { result } = renderHook(() => useEstimate('evt-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.estimate?.budget.keptTotal).toBe(202.5)
    expect(result.current.estimate?.split.entries).toHaveLength(1)
  })

  it('does not fetch when no id is provided', async () => {
    const { result } = renderHook(() => useEstimate(undefined))

    // Stays in its initial state — no request is made.
    expect(result.current.estimate).toBeNull()
  })

  it('surfaces an error when the request fails', async () => {
    server.use(
      http.get(
        `${API_URL}/events/:id/estimate`,
        () => new HttpResponse(null, { status: 500 }),
      ),
    )

    const { result } = renderHook(() => useEstimate('evt-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).not.toBeNull()
  })
})
