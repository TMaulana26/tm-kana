import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppLogo from '../AppLogo.vue'

describe('AppLogo.vue Component', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(AppLogo)

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBeTruthy()
    expect(img.classes()).toContain('animate-fade-in')
    expect(wrapper.classes()).toContain('h-8')
  })

  it('respects animated prop set to false', () => {
    const wrapper = mount(AppLogo, {
      props: {
        animated: false
      }
    })

    const img = wrapper.find('img')
    expect(img.classes()).not.toContain('animate-fade-in')
  })

  it('handles different size variants correctly', () => {
    const wrapperXs = mount(AppLogo, { props: { size: 'xs' } })
    expect(wrapperXs.classes()).toContain('h-6')

    const wrapperSm = mount(AppLogo, { props: { size: 'sm' } })
    expect(wrapperSm.classes()).toContain('h-7')

    const wrapperLg = mount(AppLogo, { props: { size: 'lg' } })
    expect(wrapperLg.classes()).toContain('h-12')

    const wrapperAuto = mount(AppLogo, { props: { size: 'auto' } })
    expect(wrapperAuto.classes()).toContain('h-full')
  })

  it('provides screen reader accessible label', () => {
    const wrapper = mount(AppLogo)
    expect(wrapper.find('span.sr-only').exists()).toBe(true)
  })
})
