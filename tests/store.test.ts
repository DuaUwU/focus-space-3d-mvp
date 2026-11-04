import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('persisted store data', () => {
  it('falls back to the default task list when stored JSON is not a task array', async () => {
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => key === 'fs-tasks' ? '{"unexpected":true}' : null,
      setItem: vi.fn()
    })

    const { useStore } = await import('../src/store')

    expect(Array.isArray(useStore.getState().tasks)).toBe(true)
    expect(useStore.getState().tasks).toHaveLength(2)
  })

  it('updates the in-memory journal if browser storage rejects a write', async () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => { throw new DOMException('Storage is full', 'QuotaExceededError') }
    })

    const { useStore } = await import('../src/store')

    expect(() => useStore.getState().setJournal('A note for today')).not.toThrow()
    expect(useStore.getState().journal).toBe('A note for today')
  })
})
