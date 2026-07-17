import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/test/mocks/server'
import { useCollaborators } from './useCollaborators'
import type { EventCollaborator } from '@/types/domain'

const API_URL = 'http://localhost:3000'

const collaboratorFixture: EventCollaborator = {
  id: 'collab-1',
  eventId: 'evt-1',
  collaboratorEmail: 'convidado@example.com',
  createdAt: '2026-07-10T12:00:00.000Z',
}

describe('useCollaborators', () => {
  it('loads the collaborators for an event', async () => {
    server.use(
      http.get(`${API_URL}/events/:id/collaborators`, () =>
        HttpResponse.json<EventCollaborator[]>([collaboratorFixture]),
      ),
    )

    const { result } = renderHook(() => useCollaborators('evt-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBeNull()
    expect(result.current.collaborators).toEqual([collaboratorFixture])
  })

  it('surfaces an error when the request fails', async () => {
    server.use(
      http.get(`${API_URL}/events/:id/collaborators`, () => new HttpResponse(null, { status: 500 })),
    )

    const { result } = renderHook(() => useCollaborators('evt-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).not.toBeNull()
  })

  it('refreshes the list after removing a collaborator', async () => {
    let listCalls = 0
    server.use(
      http.get(`${API_URL}/events/:id/collaborators`, () => {
        listCalls += 1
        return HttpResponse.json<EventCollaborator[]>(listCalls === 1 ? [collaboratorFixture] : [])
      }),
      http.delete(`${API_URL}/events/:id/collaborators/:collaboratorId`, () => new HttpResponse(null, { status: 204 })),
    )

    const { result } = renderHook(() => useCollaborators('evt-1'))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.collaborators).toHaveLength(1)

    await result.current.removeCollaborator('collab-1')

    await waitFor(() => expect(result.current.collaborators).toHaveLength(0))
  })

  it('regenerates the invite link and returns the new token', async () => {
    server.use(
      http.get(`${API_URL}/events/:id/collaborators`, () => HttpResponse.json<EventCollaborator[]>([])),
      http.post(`${API_URL}/events/:id/invite-token`, () =>
        HttpResponse.json({ id: 'evt-1', inviteToken: 'new-token' }),
      ),
    )

    const { result } = renderHook(() => useCollaborators('evt-1'))
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const token = await result.current.regenerateLink()

    expect(token).toBe('new-token')
  })
})
