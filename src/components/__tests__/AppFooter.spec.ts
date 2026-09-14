import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from '../AppFooter.vue'
import { APP_VERSION, GITHUB_REPO_URL } from '@/constants/appInfo'

describe('AppFooter.vue Component', () => {
  it('renders correctly with dynamic version badge and github link', () => {
    const wrapper = mount(AppFooter)

    // Check version is displayed
    expect(APP_VERSION).toMatch(/^v\d+\.\d+\.\d+$/)
    expect(wrapper.text()).toContain(APP_VERSION)

    // Check GitHub link and attributes
    const githubLink = wrapper.find('a')
    expect(githubLink.exists()).toBe(true)
    expect(githubLink.attributes('href')).toBe(GITHUB_REPO_URL)
    expect(githubLink.attributes('target')).toBe('_blank')
    expect(githubLink.attributes('rel')).toContain('noopener')
  })

  it('emits openFeedback when feedback button is clicked', async () => {
    const wrapper = mount(AppFooter)
    const feedbackBtn = wrapper.find('button')
    expect(feedbackBtn.exists()).toBe(true)
    expect(feedbackBtn.text()).toContain('Feedback & Bugs')

    await feedbackBtn.trigger('click')
    expect(wrapper.emitted('openFeedback')).toBeTruthy()
  })
})
