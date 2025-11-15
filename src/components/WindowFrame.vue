<template>
  <div
    class="window-frame"
    :class="{ 'window-frame--restart': props.title === 'Neustart' }"
    :style="{
      left: props.x + 'px',
      top: props.y + 'px',
      zIndex: (props.zIndex ?? 1)
    }"
    @mousedown.stop="onFocus"
  >
    <div
      class="window-titlebar"
      @mousedown.stop.prevent="startDrag"
    >
      <div class="title-left">
        <span class="window-title">{{ props.title }}</span>
      </div>

      <div class="title-right">
        <button class="window-btn close" @click.stop="onClose"></button>
      </div>
    </div>

    <div class="window-content">
      <slot>
        <p>Fensterinhalt</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";

interface Props {
  title: string;
  x: number;
  y: number;
  zIndex?: number;
  draggable?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "focus"): void;
  (e: "update:position", value: { x: number; y: number }): void;
}>();

let dragging = false;
let offsetX = 0;
let offsetY = 0;

const onClose = () => emit("close");
const onFocus = () => emit("focus");

const onMouseMove = (event: MouseEvent) => {
  if (!dragging) return;

  let newX = event.clientX - offsetX;
  let newY = event.clientY - offsetY;

  const minX = -50;
  const minY = 0;
  const maxX = window.innerWidth - 120;
  const maxY = window.innerHeight - 60;

  newX = Math.min(Math.max(newX, minX), maxX);
  newY = Math.min(Math.max(newY, minY), maxY);

  emit("update:position", { x: newX, y: newY });
};

const stopDrag = () => {
  dragging = false;
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", stopDrag);
};

const startDrag = (event: MouseEvent) => {
  if (props.draggable === false) return;
  dragging = true;
  emit("focus");

  offsetX = event.clientX - props.x;
  offsetY = event.clientY - props.y;

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", stopDrag);
};

onBeforeUnmount(() => {
  stopDrag();
});
</script>

<style scoped>
.window-frame {
  position: absolute;
  width: 320px;
  height: 220px;
  background: #171b2a;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.9);
  box-shadow:
    0 14px 30px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.02);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #eceff4;
}

.window-frame--restart {
  width: 250px;
  height: 110px;
}

.window-frame--restart .window-titlebar {
  cursor: default;
}

.window-titlebar {
  height: 26px;
  padding: 0 8px;
  background: linear-gradient(to bottom, #23293d, #181d2c);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: move;
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

.window-btn:hover {
  filter: brightness(1.1);
}

.window-content {
  flex: 1;
  padding: 10px;
  font-size: 12px;
}
</style>