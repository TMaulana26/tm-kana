import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NeoBrutalistLinkCard from '../NeoBrutalistLinkCard.vue'

describe('NeoBrutalistLinkCard.vue Component', () => {
  const defaultProps = {
    href: 'https://example.com/learn-hiragana',
    tagText: 'HIRAGANA',
    tagBg: 'bg-violet-300',
    title: 'Panduan Hiragana Tofugu',
    description: 'Panduan interaktif untuk belajar Hiragana.',
    learnMoreText: 'Pelajari Selengkapnya'
  }

  it('renders link, tag, title, description, and learn more text correctly', () => {
    const wrapper = mount(NeoBrutalistLinkCard, {
      props: defaultProps
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com/learn-hiragana')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')

    expect(wrapper.text()).toContain('HIRAGANA')
    expect(wrapper.text()).toContain('Panduan Hiragana Tofugu')
    expect(wrapper.text()).toContain('Panduan interaktif untuk belajar Hiragana.')
    expect(wrapper.text()).toContain('Pelajari Selengkapnya')
  })

  it('applies custom tag background class and dark mode styling classes', () => {
    const wrapper = mount(NeoBrutalistLinkCard, {
      props: defaultProps
    })

    const tag = wrapper.find('span')
    expect(tag.classes()).toContain('bg-violet-300')

    const link = wrapper.find('a')
    expect(link.classes()).toContain('dark:bg-slate-900')
    expect(link.classes()).toContain('dark:hover:bg-slate-800')
    expect(link.classes()).toContain('dark:hover:border-violet-400')
  })
})
