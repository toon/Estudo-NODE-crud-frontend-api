import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/parmoedas",
    name: "parmoedas",
    component: () => import("../views/ParMoedaListView.vue"),
  },
  {
    path: "/estrategias",
    name: "estrategias",
    component: () => import("../views/EstrategiaListView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
