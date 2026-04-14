import { describe, it, expect, vi } from 'vitest'
import ModificationCard from './ModificationCard.vue'
import useCard from '../Card/useCard'
import createWrapper from '../../utils/createWrapper'

vi.mock('../Card/useCard', () => ({
  default: vi.fn(),
}))

vi.mock('./assets/firm-grip.png', () => ({ default: 'mocked-firm-grip.png' }))
vi.mock('./assets/nimble-finger.png', () => ({
  default: 'mocked-nimble-finger.png',
}))
vi.mock('./assets/rode-faster.png', () => ({
  default: 'mocked-rode-faster.png',
}))
vi.mock('./assets/steel-vest.png', () => ({ default: 'mocked-steel-vest.png' }))
vi.mock('./assets/unleashed-rage.png', () => ({
  default: 'mocked-unleashed-rage.png',
}))

describe('ModificationCard', () => {
  const defaultProps = {
    name: 'Fester Griff',
    playerIndex: 1,
  }

  it('should render the component and set the correct background image based on name', () => {
    const wrapper = createWrapper(ModificationCard, defaultProps)

    const imageDiv = wrapper.find('.image')
    expect(imageDiv.exists()).toBe(true)
    expect(imageDiv.attributes('style')).toContain(
      'background-image: url("mocked-firm-grip.png")',
    )
  })

  it('should call the useCard composition function with correct props', () => {
    const useCardMock = vi.mocked(useCard)
    useCardMock.mockClear()

    createWrapper(ModificationCard, defaultProps)

    expect(useCardMock).toHaveBeenCalledTimes(1)
    expect(useCardMock).toHaveBeenCalledWith(
      defaultProps.playerIndex,
      false,
      defaultProps.name,
    )
  })

  it('should display only modifications that have a value greater than 0/defined', () => {
    const propsWithMods = {
      ...defaultProps,
      ATK: 5,
      DEF: 0,
      SPD: 3,
      hasEffect: true,
    }

    const wrapper = createWrapper(ModificationCard, propsWithMods)

    const modificationItems = wrapper.findAll('.item')

    expect(modificationItems).toHaveLength(2)

    expect(modificationItems[0].text()).toBe('T::atk::T 5')
    expect(modificationItems[1].text()).toBe('T::spd::T 3')
  })

  it('should handle all modification values being defined', () => {
    const propsWithAllMods = {
      ...defaultProps,
      ATK: 10,
      DEF: 5,
      SPD: 2,
    }

    const wrapper = createWrapper(ModificationCard, propsWithAllMods)
    const modificationItems = wrapper.findAll('.item')

    expect(modificationItems).toHaveLength(3)

    expect(modificationItems[0].text()).toBe('T::atk::T 10')
    expect(modificationItems[1].text()).toBe('T::def::T 5')
    expect(modificationItems[2].text()).toBe('T::spd::T 2')
  })

  it('should not display any modification items if no ATK, DEF, or SPD is provided', () => {
    const wrapper = createWrapper(ModificationCard, defaultProps)

    const modificationItems = wrapper.findAll('.item')
    expect(modificationItems).toHaveLength(0)
  })
})
