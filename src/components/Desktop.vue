<template>
  <div class="desktop">
    <!-- GNOME-Top-Bar -->
    <header class="top-bar">
      <div class="top-left">
        <span class="logo-dot"></span>
        <span class="activities">Activities</span>
      </div>

      <div class="top-center">
        <span>{{ timeString }}</span>
      </div>

      <div class="top-right">
        <span class="icon">🔊</span>
        <span class="icon">📡</span>
        <span class="user">👤</span>
      </div>
    </header>

    <!-- Desktop / Fensterfläche -->
    <main class="window-area">
      <WindowFrame
        v-for="w in windows"
        :key="w.id"
        :title="w.title"
        :x="w.x"
        :y="w.y"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import WindowFrame from "./windows/WindowFrame.vue";

interface GameWindow {
  id: number;
  title: string;
  x: number;
  y: number;
}

const windows = ref<GameWindow[]>([
  { id: 1, title: "Test Game", x: 80, y: 80 }
]);

const timeString = ref("");

let timer: number | undefined;

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
</script>

<style scoped>
.desktop {
  width: 100vw;
  height: 100vh;
  /* GNOME-artiger Hintergrund (leichtes Gradient) */
  background: radial-gradient(circle at top left, #4450a8 0%, #252a4f 45%, #161825 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #e5e9f0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* Top-Bar wie GNOME */
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

/* Drei Bereiche: links, center, rechts */
.top-left,
.top-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

/* center wirklich mittig */
.top-center {
  flex: 1;
  text-align: center;
  font-weight: 500;
}

/* kleine "GNOME"-Marke links */
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

/* Icons rechts */
.top-right .icon,
.top-right .user {
  padding: 2px 4px;
  border-radius: 6px;
}

.top-right .icon:hover,
.top-right .user:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* Fensterfläche */
.window-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  padding: 12px 16px;
}
</style>