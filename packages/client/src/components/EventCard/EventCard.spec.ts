import { describe, it, expect, vi } from 'vitest'
import EventCard from './EventCard.vue'
import useCard from '../Card/useCard'
import createWrapperUtil from '../../utils/createWrapper'

vi.mock('../Card/useCard', () => ({
  default: vi.fn(),
}))

const baseProps = {
  playerIndex: 0,
  name: 'Standard-Event',
}

const createWrapper = (props: Record<string, any> = {}) => {
  return createWrapperUtil(EventCard, props, baseProps)
}

const useCardMock = useCard as unknown as ReturnType<typeof vi.fn>

describe('EventCard.vue', () => {
  it('should call useCard composable with correct props on mount', () => {
    createWrapper({
      playerIndex: 1,
      hasEffect: true,
      name: 'TestName',
    })

    expect(useCardMock).toHaveBeenCalledTimes(1)
    expect(useCardMock).toHaveBeenCalledWith(1, true, 'TestName')
  })

  it('should display the translated ruleLabel if provided', () => {
    const wrapper = createWrapper({ ruleLabel: 'EVENT_RULE_EFFECT' })

    expect(wrapper).toMatchSnapshot()

    const ruleDiv = wrapper.find('[data-testid="rule-label"]')

    expect(ruleDiv.exists()).toBe(true)
    expect(ruleDiv.text()).toBe('T::EVENT_RULE_EFFECT::T')
  })

  it('should NOT display the ruleLabel div if ruleLabel is undefined', () => {
    const wrapper = createWrapper({ ruleLabel: undefined })

    expect(wrapper).toMatchSnapshot()

    const ruleDiv = wrapper.find('.container > div:first-child')
    expect(ruleDiv.exists()).toBe(false)
  })

  it('should display only ATK and SPD modifications when DEF is missing', () => {
    const wrapper = createWrapper({ ATK: 5, SPD: -2, DEF: undefined })

    expect(wrapper).toMatchSnapshot()

    const items = wrapper.findAll('.item')

    expect(items.length).toBe(2)

    expect(items[0].text()).toBe('ATK 5')

    expect(items[1].text()).toBe('SPD -2')
  })

  it('should display no modification items if ATK, DEF, and SPD are all undefined', () => {
    const wrapper = createWrapper({
      ATK: undefined,
      DEF: undefined,
      SPD: undefined,
    })

    expect(wrapper).toMatchSnapshot()

    const items = wrapper.findAll('.item')

    expect(items.length).toBe(0)
  })

  it('should display all three modifications if all are provided', () => {
    const wrapper = createWrapper({ ATK: 1, DEF: 2, SPD: 3 })
    const items = wrapper.findAll('.item')

    expect(wrapper).toMatchSnapshot()

    expect(items.length).toBe(3)
    expect(items[0].text()).toBe('ATK 1')
    expect(items[1].text()).toBe('DEF 2')
    expect(items[2].text()).toBe('SPD 3')
  })
})
