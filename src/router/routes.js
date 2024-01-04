
const routes = [
  { path: '/', component: () => import('pages/IndexPage.vue') },
  { path: '/popup', component: () => import('pages/Popup.vue') },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
