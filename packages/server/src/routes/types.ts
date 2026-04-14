export type RouteResponse = Promise<{
  status: 500 | 401 | 400 | 200
  message: string
  session?: {
    user?: {
      id: string
      name: string
    }
  }
}>

export type Route<T = unknown> = ((request: T) => RouteResponse) & {
  protected?: boolean
}
