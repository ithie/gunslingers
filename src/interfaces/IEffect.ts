import IPlayer from './IPlayer'

export type Effect = (data: { own: IPlayer; opponent: IPlayer }) => void
