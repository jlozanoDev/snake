import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import App from './App.vue'

// Stub setInterval/clearInterval to prevent real timers during tests
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('App.vue — score label text (PR change)', () => {
  it('displays "Puntuación" as the score label', () => {
    const wrapper = mount(App)
    const scoreEl = wrapper.find('.score')
    expect(scoreEl.exists()).toBe(true)
    expect(scoreEl.text()).toContain('Puntuación')
  })

  it('does NOT display the old label text "Puntaje"', () => {
    const wrapper = mount(App)
    const scoreEl = wrapper.find('.score')
    expect(scoreEl.text()).not.toContain('Puntaje')
  })

  it('renders the initial score value of 0 inside the score element', () => {
    const wrapper = mount(App)
    const scoreEl = wrapper.find('.score')
    expect(scoreEl.find('strong').text()).toBe('0')
  })

  it('score label includes the score value wrapped in a <strong> element', () => {
    const wrapper = mount(App)
    const strong = wrapper.find('.score strong')
    expect(strong.exists()).toBe(true)
  })

  it('"Puntuación" label text appears before the numeric score value', () => {
    const wrapper = mount(App)
    const scoreEl = wrapper.find('.score')
    const fullText = scoreEl.text()
    const labelIndex = fullText.indexOf('Puntuación')
    const valueIndex = fullText.indexOf('0')
    expect(labelIndex).toBeLessThan(valueIndex)
  })

  // Regression test: verifies exact wording is preserved and not reverted
  it('score paragraph text matches "Puntuación 0" (regression)', () => {
    const wrapper = mount(App)
    const scoreEl = wrapper.find('.score')
    expect(scoreEl.text()).toBe('Puntuación 0')
  })
})