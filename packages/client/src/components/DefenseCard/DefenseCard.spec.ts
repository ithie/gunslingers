import { describe, it, expect, vi } from 'vitest'
import DefenseCard from './DefenseCard.vue'
import useCard from '../Card/useCard'
import createWrapper from '../../utils/createWrapper'

vi.mock('../Card/useCard', () => ({
  default: vi.fn(),
}))

describe('DefenseCard', () => {
  const defaultProps = {
    playerIndex: 1,
    name: 'Shield',
    hasEffect: false,
    ruleLabel: 'standardDefense',
  }

  it('should render the component and display the ruleLabel text using the global mock', () => {
    const wrapper = createWrapper(DefenseCard, defaultProps)

    expect(wrapper).toMatchSnapshot()

    const ruleLabelDiv = wrapper.find('div.container > div')
    expect(ruleLabelDiv.exists()).toBe(true)
    expect(ruleLabelDiv.text()).toBe(`T::${defaultProps.ruleLabel}::T`)
    expect(ruleLabelDiv.classes()).not.toContain('long-text')
  })

  it('should apply the "long-text" class if ruleLabel includes "timeDistortion"', () => {
    const longTextProps = {
      ...defaultProps,
      ruleLabel: 'timeDistortion_effect',
    }

    const wrapper = createWrapper(DefenseCard, longTextProps)

    expect(wrapper).toMatchSnapshot()

    const ruleLabelDiv = wrapper.find('div.container > div')
    expect(ruleLabelDiv.classes()).toContain('long-text')
    expect(ruleLabelDiv.text()).toBe(`T::${longTextProps.ruleLabel}::T`)
  })

  it('should not show the ruleLabel div if ruleLabel prop is missing', () => {
    const noRuleLabelProps = {
      playerIndex: 1,
      name: 'GenericCard',
      hasEffect: true,
    }

    const wrapper = createWrapper(DefenseCard, noRuleLabelProps)

    expect(wrapper).toMatchSnapshot()

    const ruleLabelDiv = wrapper.find('div.container > div')
    expect(ruleLabelDiv.exists()).toBe(false)
  })

  it('should call the useCard composition function with correct props', () => {
    const useCardMock = vi.mocked(useCard)

    useCardMock.mockClear()

    createWrapper(DefenseCard, defaultProps)

    expect(useCardMock).toHaveBeenCalledTimes(1)
    expect(useCardMock).toHaveBeenCalledWith(
      defaultProps.playerIndex,
      defaultProps.hasEffect,
      defaultProps.name,
    )
  })
})
