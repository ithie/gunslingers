import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import http from 'http'
import WebSocket from 'ws'
import IPlayer from '../../interfaces/src/IPlayer.ts'
import { SESSION_KEY } from './config.js'
import useSession from './useSession.js'
import routes from './routes'
import { Route } from './routes/types.js'

const app = express()
const port = 3000

interface ActiveGame {
  id: string
  activePlayer: number
  players: IPlayer[]
}

const activeGames: Record<string, ActiveGame> = {}

const { getMiddleware } = useSession(SESSION_KEY)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(getMiddleware())

const requireLogin = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    next()
  } else {
    res.status(401).json({ status: 'not authenticated' })
  }
}

routes.forEach(
  ({
    path,
    method,
    callback,
  }: {
    path: string
    method: string
    callback: Route
  }) => {
    console.log('INIT ROUTE', method, path, 'PROTECTED?:', callback?.protected)
    if (callback?.protected) {
      app[method ? method : 'get'](
        path,
        requireLogin,
        async (req: Request, res: Response) => {
          console.log(`${Date.now()}:${method.toUpperCase()}:${path}`)
          const response = await callback({ ...req.body, session: req.session })

          if (response.session) {
            req.session = { ...response.session }
          }

          res.status(response.status).json({ status: response.message })
        },
      )
    } else {
      app[method ? method : 'get'](
        path,
        async (req: Request, res: Response) => {
          console.log(`${Date.now()}:${method.toUpperCase()}:${path}`)
          const response = await callback({ ...req.body, session: req.session })

          if (response.session) {
            req.session = { ...response.session }
          }

          res.status(response.status).json({ status: response.message })
        },
      )
    }
  },
)

app.use('/games', requireLogin)
app.get('/games', (req: Request, res: Response) => {
  res.json(activeGames)
})

app.post('/games', (req: Request, res: Response) => {
  const hostUsername = req.session.user!.username

  const newGameId = `${crypto.randomUUID()}_${new Date().getMilliseconds}`

  const newGame: ActiveGame = {
    id: newGameId,
    players: [hostUsername],
    activePlayer: 0,
  }
  activeGames[newGameId] = newGame

  res.status(201).json({ message: 'Partie erstellt.', game: newGame })
})

const server = http.createServer(app)

/*

const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws, req) {
  //  const userId = authService.getUserId(req.headers.cookie);

  ws.on('message', function incoming(message) {
    console.log(`Nachricht vom Client: ${message}`)
  })

  // Beispiel für Server-Push (sendet an diesen bestimmten Client)
  // ws.send('Willkommen nach erfolgreicher Authentifizierung!');
})*/

// Starte den Server
server.listen(port, () => {
  console.log(`\n\n Kartenspiel-Server (TS) läuft auf http://localhost:${port}`)
})
