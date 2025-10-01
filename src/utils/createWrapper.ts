import { shallowMount, type MountingOptions } from '@vue/test-utils'
import { type Component } from 'vue'

const mockGlobal = {
  mocks: {
    $t: (msg: string) => `T::${msg}::T`,
  },
}

export default (
  component: Component,
  props: Record<string, any> = {},
  baseProps?: MountingOptions<any>['props'],
) => {
  return shallowMount(component, {
    props: { ...baseProps, ...props },
    global: mockGlobal,
  })
}
