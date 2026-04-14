import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import routeConfigs from './routeConfigs'
import useGameSession from '../composables/useGameSession/useGameSession'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: routeConfigs.LOBBY,
    component: () => import('../views/Lobby.vue'),
  },
  {
    path: '/game',
    name: routeConfigs.GAME,
    component: () => import('../views/Game.vue'),
    beforeEnter: (_to, _from, next) => {
      const { session } = useGameSession()
      if (!session.value) {
        next({ name: routeConfigs.LOBBY })
      } else {
        next()
      }
    },
  },
  {
    path: '/:catchAll(.*)',
    name: routeConfigs.NOT_FOUND,
    component: () => import('../views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
