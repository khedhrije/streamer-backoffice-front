import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layout/AppLayout.vue";

const routes = [
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "/",
        name: "dashboard",
        exact: true,
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          breadcrumb: [{ parent: "Dashboard", label: "Sales Dashboard" }]
        }
      },
      {
        path: "/programs",
        name: "programs",
        component: () => import("@/views/pages/Programs.vue"),
        meta: {
          breadcrumb: [{ parent: "Content", label: "Programs" }]
        }
      },
      {
        path: "programs/:ID",
        name: "programDetails",
        component: () => import("@/views/pages/Program.vue"),
        meta: {
          breadcrumb: [{ parent: "Content", label: "Program Details" }]
        }
      },
      {
        path: "/medias",
        name: "medias",
        component: () => import("@/views/pages/Medias.vue"),
        meta: {
          breadcrumb: [{ parent: "Content", label: "Medias" }]
        }
      },
      {
        path: "medias/:ID",
        name: "mediaDetails",
        component: () => import("@/views/pages/Media.vue"),
        meta: {
          breadcrumb: [{ parent: "Content", label: "Media Details" }]
        }
      },
      {
        path: "/audios",
        name: "audios",
        component: () => import("@/views/pages/Audios.vue"),
        meta: {
          breadcrumb: [{ parent: "Content", label: "Audios" }]
        }
      },
      {
        path: "/categories",
        name: "categories",
        component: () => import("@/views/pages/Categories.vue"),
        meta: {
          breadcrumb: [{ parent: "Classification", label: "Categories" }]
        }
      },
      {
        path: "/tags",
        name: "tags",
        component: () => import("@/views/pages/Tags.vue"),
        meta: {
          breadcrumb: [{ parent: "Classification", label: "Tags" }]
        }
      },
      {
        path: "/homepages",
        name: "homepages",
        component: () => import("@/views/pages/Homepages.vue"),
        meta: {
          breadcrumb: [{ parent: "Classification", label: "Homepages" }]
        }
      },
      {
        path: "/blocks",
        name: "blocks",
        component: () => import("@/views/pages/Blocks.vue"),
        meta: {
          breadcrumb: [{ parent: "Classification", label: "Blocks" }]
        }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/pages/Login.vue")
  },
  {
    path: "/error",
    name: "error",
    component: () => import("@/views/pages/Error.vue")
  },
  {
    path: "/notfound",
    name: "notfound",
    component: () => import("@/views/pages/NotFound.vue")
  },
  {
    path: "/wizard",
    name: "wizard",
    component: () => import("@/views/pages/Wizard.vue")
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 };
  }
});

export default router;
