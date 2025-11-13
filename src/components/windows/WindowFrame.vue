<template>
  <div
    class="window-frame"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div class="window-titlebar">
      <div class="title-left">
        <span class="window-title">{{ title }}</span>
      </div>
      <div class="title-right">

        <button class="window-btn close"></button>
      </div>
    </div>

    <div class="window-content">
      <slot>
        <p>Game-Window Placeholder</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  x: number;
  y: number;
}

defineProps<Props>();
</script>

<style scoped>
.window-frame {
  position: absolute;
  width: 260px;
  height: 170px;

  background: #171b2a;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.9);
  box-shadow:
    0 14px 30px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.02);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Header-Bar */
.window-titlebar {
  height: 26px;
  padding: 0 8px;
  background: linear-gradient(to bottom, #23293d, #181d2c);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.title-left {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}

.window-title {
  font-weight: 500;
}

/* Buttons rechts – GNOME-like farbige Punkte */
.title-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.window-btn {
  width: 11px;
  height: 11px;
  border-radius: 999px;
  border: none;
  padding: 0;
  cursor: pointer;
}

.window-btn.close {
  background: #bf616a;
}

.window-btn.min {
  background: #ebcb8b;
}

.window-btn.max {
  background: #a3be8c;
}

.window-btn:hover {
  filter: brightness(1.1);
}

/* Inhalt */
.window-content {
  flex: 1;
  padding: 10px;
  font-size: 12px;
  color: #eceff4;
}
</style>