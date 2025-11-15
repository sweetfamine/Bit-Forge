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
        <span class="icon"><Settings :size="16"/></span>
        <span class="icon"><Trophy :size="16"/></span>
        <span class="user"><Power size="16"/></span>
      </div>
    </header>

    <!-- Hauptbereich -->
    <main class="window-area">
      <!-- Dock -->
      <nav class="dock">
        <button
          v-for="w in windows"
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
        @close="closeWindow(w.id)"
        @focus="focusWindow(w.id)"
        @update:position="updateWindowPosition(w.id, $event)"
      >
        <component :is="w.component"
        v-bind="w.type === 'dice forge' ? { dice: gamestate.dice } : {}"
        />
      </WindowFrame>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type Component } from "vue";
import WindowFrame from "./WindowFrame.vue";
import GameWindow from "./windows/GameWindow.vue";
import TaskManagerWindow from "./windows/TaskManagerWindow.vue";
import ShopWindow from "./windows/ShopWindow.vue";
import { gamestate } from "../store/gamestate";

type WindowType = "dice forge" | "task" | "shop" | "other";

interface OsWindow {
  id: string;
  title: string;
  type: WindowType;
  component: Component;
  x: number;
  y: number;
  visible: boolean;
  zIndex: number;
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
    visible: true,
    zIndex: 1
  },
  {
    id: "task",
    title: "Task-Manager",
    type: "task",
    component: TaskManagerWindow,
    x: 480,
    y: 120,
    visible: false,
    zIndex: 1
  },
  {
    id: "shop",
    title: "Shop",
    type: "shop",
    component: ShopWindow,
    x: 280,
    y: 220,
    visible: false,
    zIndex: 1
  }
]);

const visibleWindows = computed(() =>
  windows.value
    .filter((w) => w.visible)
    .sort((a, b) => a.zIndex - b.zIndex)
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
  win.visible = !win.visible;
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
  const maxZ = Math.max(...windows.value.map((w) => w.zIndex));
  const win = windows.value.find((w) => w.id === id);
  if (!win) return;
  win.zIndex = maxZ + 1;
};
</script>

<style scoped>
.desktop {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at top left, #6372e0 0%, #3d457a 45%, #393f63 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e5e9f0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.top-bar {
  height: 32px;
  background: rgba(15, 18, 30, 0.92);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 13px;
}

.top-left,
.top-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.top-center {
  flex: 1;
  text-align: center;
  font-weight: 500;
}

.logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #5e81ac;
}

.activities {
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
}

.activities:hover {
  background: rgba(255, 255, 255, 0.14);
}

.top-right .icon,
.top-right .user {
  padding: 2px 4px;
  border-radius: 6px;
}

.top-right .icon:hover,
.top-right .user:hover {
  background: rgba(255, 255, 255, 0.08);
}

.window-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  padding: 12px 16px;
}

.dock {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dock-icon {
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #e5e9f0;
  font-size: 11px;
}

.dock-icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(10, 14, 30, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.dock-icon.active .dock-icon-circle {
  outline: 2px solid #88c0d0;
}

.dock-label {
  max-width: 60px;
  text-align: center;
}
</style>