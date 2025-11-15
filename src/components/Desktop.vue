<template>
  <div class="desktop">
    <!-- Top-Bar -->
    <header class="top-bar">
      <div class="top-left">
        <span class="logo-dot"></span>
        <span class="activities">Bit Forge OS</span>
      </div>

      <div class="top-center">
        <span>{{ timeString }}</span>
      </div>

      <div class="top-right">
        <span class="icon" @click="toggleWindow('options')">
          <Settings :size="16" />
        </span>
        <span class="icon" @click="toggleWindow('achievements')">
          <Trophy :size="16" />
        </span>
        <span class="user" @click="toggleWindow('restart')">
          <Power :size="16" />
        </span>
      </div>
    </header>

    <!-- Abdunkelung, wenn Restart-Fenster offen ist -->
    <div
      v-if="isRestartOpen"
      class="overlay"
      @click="toggleWindow('restart')"
    ></div>

    <!-- Hauptbereich -->
    <main class="window-area">
      <!-- Dock -->
      <nav class="dock">
        <button
          v-for="w in dockWindows"
          :key="w.id"
          class="dock-icon"
          :class="{ active: w.visible }"
          @click="toggleWindow(w.id)"
        >
          <div class="dock-icon-circle">
            <span v-if="w.type === 'dice forge'"><Gamepad2 :size="29" /></span>
            <span v-else-if="w.type === 'task'"><ChartSpline :size="24" /></span>
            <span v-else-if="w.type === 'shop'"><ShoppingBasket :size="29" /></span>
            <span v-else>📦</span>
          </div>
          <span class="dock-label">{{ w.title }}</span>
        </button>
      </nav>

      <!-- Fenster -->
      <WindowFrame
        v-for="w in visibleWindows"
        :key="w.id"
        :title="w.title"
        :x="w.x"
        :y="w.y"
        :z-index="w.zIndex"
        :draggable="w.id !== 'restart'"
        @close="closeWindow(w.id)"
        @focus="focusWindow(w.id)"
        @update:position="updateWindowPosition(w.id, $event)"
      >
        <component
          :is="w.component"
          v-bind="w.type === 'dice forge' ? { dice: gamestate.dice } : {}"
        />
      </WindowFrame>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type Component } from "vue";
import { gamestate } from "../store/gamestate";
import WindowFrame from "./WindowFrame.vue";
import GameWindow from "./windows/GameWindow.vue";
import TaskManagerWindow from "./windows/TaskManagerWindow.vue";
import ShopWindow from "./windows/ShopWindow.vue";
import OptionsWindow from "./windows/OptionsWindow.vue";
import AchievementsWindow from "./windows/AchievementsWindow.vue";
import RestartWindow from "./windows/RestartWindow.vue";

type WindowType =
  | "dice forge"
  | "task"
  | "shop"
  | "options"
  | "achievements"
  | "restart"
  | "other";

interface OsWindow {
  id: string;
  title: string;
  type: WindowType;
  component: Component;
  x: number;
  y: number;
  visible: boolean;
  zIndex: number;
  inDock: boolean;
}

const timeString = ref("");
let timer: number | undefined;

const windows = ref<OsWindow[]>([
  {
    id: "dice forge",
    title: "Dice Forge",
    type: "dice forge",
    component: GameWindow,
    x: 120,
    y: 90,
    visible: false,
    zIndex: 1,
    inDock: true
  },
  {
    id: "task",
    title: "Task-Manager",
    type: "task",
    component: TaskManagerWindow,
    x: 480,
    y: 120,
    visible: false,
    zIndex: 1,
    inDock: true
  },
  {
    id: "shop",
    title: "Shop",
    type: "shop",
    component: ShopWindow,
    x: 280,
    y: 220,
    visible: false,
    zIndex: 1,
    inDock: true
  },
  {
    id: "options",
    title: "Optionen",
    type: "options",
    component: OptionsWindow,
    x: 420,
    y: 160,
    visible: false,
    zIndex: 1,
    inDock: false
  },
  {
    id: "achievements",
    title: "Achievements",
    type: "achievements",
    component: AchievementsWindow,
    x: 360,
    y: 140,
    visible: false,
    zIndex: 1,
    inDock: false
  },
  {
    id: "restart",
    title: "Bit Forge OS",
    type: "restart",
    component: RestartWindow,
    x: 0,
    y: 0,
    visible: false,
    zIndex: 1,
    inDock: false
  }
]);

const dockWindows = computed(() =>
  windows.value.filter((w) => w.inDock)
);

const visibleWindows = computed(() =>
  windows.value
    .filter((w) => w.visible)
    .sort((a, b) => a.zIndex - b.zIndex)
);

const isRestartOpen = computed(
  () => windows.value.find((w) => w.id === "restart")?.visible === true
);

const updateTime = () => {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  timeString.value = `${h}:${m}`;
};

onMounted(() => {
  updateTime();
  timer = window.setInterval(updateTime, 60_000);
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});

const updateWindowPosition = (id: string, pos: { x: number; y: number }) => {
  const win = windows.value.find((w) => w.id === id);
  if (!win) return;
  win.x = pos.x;
  win.y = pos.y;
};

const toggleWindow = (id: string) => {
  const win = windows.value.find((w) => w.id === id);
  if (!win) return;

  if (id === "restart" && win.visible) {
    win.visible = false;
    return;
  }

  win.visible = !win.visible;

  if (win.visible && win.id === "restart") {
    const frameWidth = 250;
    const frameHeight = 85;

    win.x = window.innerWidth / 2 - frameWidth / 2;
    win.y = window.innerHeight / 2 - frameHeight / 2;

    windows.value.forEach((w) => {
      if (w.id !== "restart") {
        w.zIndex = 100;
      }
    });

    win.zIndex = 1000;
  }

  if (win.visible) {
    focusWindow(id);
  }
};

const closeWindow = (id: string) => {
  const win = windows.value.find((w) => w.id === id);
  if (!win) return;
  win.visible = false;
};

const focusWindow = (id: string) => {
  if (isRestartOpen.value && id !== "restart") {
    return;
  }

  const maxZ = Math.max(...windows.value.map((w) => w.zIndex));
  const win = windows.value.find((w) => w.id === id);
  if (!win) return;
  win.zIndex = maxZ + 1;
};
</script>

<style scoped src="./Desktop.css"></style>