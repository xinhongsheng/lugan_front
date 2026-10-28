declare module '@ant-design-vue/pro-layout' {
  import type { DefineComponent, Plugin } from 'vue'

  export function getMenuData(routes: unknown[]): { menuData: unknown[] }
  export function clearMenuItem<T>(menus: T): T

  const ProLayout: DefineComponent<object, object, unknown> & Plugin
  export const PageContainer: DefineComponent<object, object, unknown> & Plugin
  export default ProLayout
}
