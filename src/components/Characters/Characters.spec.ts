import { describe, it, expect, vi } from 'vitest'
import createWrapper from '../../utils/createWrapper'
import Characters from './Characters.vue'
import { CARD_TYPES } from '../../constants'

vi.mock('./assets/gunslinger.png', () => ({ default: 'test-gunslinger.png' }))
vi.mock('./assets/gambler.png', () => ({ default: 'test-gambler.png' }))
vi.mock('./assets/headhunter.png', () => ({ default: 'test-headhunter.png' }))

const defaultProps = {
  HP: 100,
  ATK: 10,
  DEF: 5,
  SPD: 8,
  type: CARD_TYPES.CHARACTER,
}

describe('Characters.vue', () => {
  it.skip('should render all character stats correctly and use i18n for labels', () => {
    const props = {
      ...defaultProps,
      name: 'character.gunslinger',
    }

    const wrapper = createWrapper(Characters, props)

    expect(wrapper).toMatchSnapshot()

    const text = wrapper.text()

    expect(text).toContain(`T::hp::T: ${props.HP}`)
    expect(text).toContain(`T::atk::T: ${props.ATK}`)
    expect(text).toContain(`T::def::T: ${props.DEF}`)
    expect(text).toContain(`T::spd::T: ${props.SPD}`)
  })

  it.skip('should set the correct background image for "Gunslinger" based on the name prop', () => {
    const props = {
      ...defaultProps,
      name: 'character.gunslinger',
    }
    const wrapper = createWrapper(Characters, props)

    expect(wrapper).toMatchSnapshot()

    const characterDiv = wrapper.find('.character')

    expect(characterDiv.attributes('style')).toContain(
      'background-image: url("test-gunslinger.png")',
    )
  })

  it.skip('should set the correct background image for "Headhunter"', () => {
    const props = {
      ...defaultProps,
      name: 'character.headhunter',
    }
    const wrapper = createWrapper(Characters, props)

    expect(wrapper).toMatchSnapshot()

    const characterDiv = wrapper.find('.character')

    expect(characterDiv.attributes('style')).toContain(
      'background-image: url("test-headhunter.png")',
    )
  })

  it.skip('should render with "undefined" for missing optional props (ATK, DEF, SPD)', () => {
    const props = {
      name: 'character.gambler',
      HP: 50,
      type: CARD_TYPES.CHARACTER,
    }
    const wrapper = createWrapper(Characters, props)

    expect(wrapper).toMatchSnapshot()

    const text = wrapper.text()

    expect(wrapper.exists()).toBe(true)

    expect(text).toContain(`T::hp::T: ${props.HP}`)
    expect(text).toContain('T::atk::T: ')
    expect(text).toContain('T::def::T: ')
    expect(text).toContain('T::spd::T:')

    const characterDiv = wrapper.find('.character')
    expect(characterDiv.attributes('style')).toContain(
      'background-image: url("test-gambler.png")',
    )
  })
})
