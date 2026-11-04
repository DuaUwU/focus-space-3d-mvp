import { describe, expect, it } from 'vitest'
import config from '../vite.config'

describe('GitHub Pages deployment', () => {
  it('uses the repository subpath as Vite base', () => {
    expect(config.base).toBe('/focus-space-3d-mvp/')
  })
})
