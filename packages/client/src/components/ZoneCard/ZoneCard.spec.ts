import { describe, it, expect } from 'vitest'
import { DOMWrapper } from '@vue/test-utils'
import ZoneCard from './ZoneCard.vue'
import createWrapperUtil from '../../utils/createWrapper'

describe('ZoneCard', () => {
  it('should render 9 matrixItems in the grid container', () => {
    const wrapper = createWrapperUtil(ZoneCard, {
      zones: [],
    })

    expect(wrapper).toMatchSnapshot()

    const matrixItems: DOMWrapper<HTMLElement>[] = wrapper.findAll(
      '[class*="matrixItem"]',
    )

    expect(matrixItems).toHaveLength(9)
    expect(wrapper.find('.matrixContainer').exists()).toBe(true)
  })

  it('should have 8 items as "white" and the center item as "center" when zones is empty', () => {
    const wrapper = createWrapperUtil(ZoneCard, {
      zones: [],
    })

    expect(wrapper).toMatchSnapshot()

    const matrixItems: DOMWrapper<HTMLElement>[] = wrapper.findAll(
      '[class*="matrixItem"]',
    )

    const whiteItems = matrixItems.filter((item) =>
      item.classes().includes('white'),
    )
    const centerItem = matrixItems[4]

    expect(whiteItems).toHaveLength(8)
    expect(centerItem.classes()).toContain('center')
    expect(centerItem.classes()).not.toContain('white')
    expect(centerItem.classes()).not.toContain('black')
  })

  it('should render items as "black" if their index is included in the zones prop', () => {
    const zonesToTest = [0, 7]
    const wrapper = createWrapperUtil(ZoneCard, {
      zones: zonesToTest,
    })

    expect(wrapper).toMatchSnapshot()

    const matrixItems: DOMWrapper<HTMLElement>[] = wrapper.findAll(
      '[class*="matrixItem"]',
    )
    const blackItems = matrixItems.filter((item) =>
      item.classes().includes('black'),
    )

    expect(blackItems).toHaveLength(zonesToTest.length)
    expect(matrixItems[0].classes()).toContain('black')
    expect(matrixItems[1].classes()).toContain('white')
    expect(matrixItems[2].classes()).toContain('white')
    expect(matrixItems[3].classes()).toContain('white')
    expect(matrixItems[4].classes()).toContain('center')
    expect(matrixItems[5].classes()).toContain('white')
    expect(matrixItems[6].classes()).toContain('white')
    expect(matrixItems[7].classes()).toContain('white')
    expect(matrixItems[8].classes()).toContain('black')
  })

  it('should correctly handle a combination of black and white zones (0, 1, 3, 5)', () => {
    const zonesToTest = [0, 1, 3, 5]
    const wrapper = createWrapperUtil(ZoneCard, {
      zones: zonesToTest,
    })

    expect(wrapper).toMatchSnapshot()

    const matrixItems: DOMWrapper<HTMLElement>[] = wrapper.findAll(
      '[class*="matrixItem"]',
    )

    expect(
      matrixItems.filter((item) => item.classes().includes('black')),
    ).toHaveLength(4)

    expect(matrixItems[4].classes()).not.toContain('black')
    expect(matrixItems[4].classes()).toContain('center')
    expect(matrixItems[4].classes()).not.toContain('white')
    expect(matrixItems[6].classes()).toContain('black')
    expect(matrixItems[6].classes()).not.toContain('center')
    expect(matrixItems[6].classes()).not.toContain('white')

    expect(matrixItems[0].classes()).toContain('black')
    expect(matrixItems[0].classes()).not.toContain('white')
    expect(matrixItems[0].classes()).not.toContain('center')

    expect(matrixItems[2].classes()).toContain('white')
    expect(matrixItems[2].classes()).not.toContain('black')
  })

  it('should render 8 "white" elements and 0 "black" elements when zones includes index > 7', () => {
    const wrapper = createWrapperUtil(ZoneCard, {
      zones: [8, 9, 10],
    })

    expect(wrapper).toMatchSnapshot()

    const matrixItems: DOMWrapper<HTMLElement>[] = wrapper.findAll(
      '[class*="matrixItem"]',
    )

    const whiteItems = matrixItems.filter((item) =>
      item.classes().includes('white'),
    )
    const blackItems = matrixItems.filter((item) =>
      item.classes().includes('black'),
    )

    expect(whiteItems).toHaveLength(8)
    expect(blackItems).toHaveLength(0)
  })
})
