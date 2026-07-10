import { afterEach, describe, expect, it, vi } from 'vitest'
import { copyText } from './clipboard'

describe('copyText', () => {
  afterEach(() => vi.restoreAllMocks())

  it('uses the Clipboard API in a secure context', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('isSecureContext', true)
    Object.assign(navigator, { clipboard: { writeText } })

    const result = await copyText('hello')

    expect(result).toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello')
  })

  it('falls back to execCommand when the Clipboard API is unavailable', async () => {
    vi.stubGlobal('isSecureContext', false)
    Object.assign(navigator, { clipboard: undefined })
    const execCommand = vi.fn().mockReturnValue(true)
    Object.assign(document, { execCommand })

    const result = await copyText('fallback')

    expect(result).toBe(true)
    expect(execCommand).toHaveBeenCalledWith('copy')
  })
})
