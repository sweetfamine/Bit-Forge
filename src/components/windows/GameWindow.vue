<template>
  <div class="window-inner">
    <div
      class="dice-box"
      @click="rollDiceNow"
      :class="{ active: isRolling }"
    >
      <!-- Vor dem ersten Wurf nur das Icon anzeigen -->
      <span v-if="currentValue === null" class="dice-text">🎲</span>

      <!-- Nach dem Wurf die Zahl anzeigen -->
      <span v-else class="dice-value">{{ currentValue }}</span>
    </div>

    <p>
      Press to roll the Dice!
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { roll } from "../../core/formulas";

const isRolling = ref(false);
const currentValue = ref<number | null>(null);

function rollDiceNow() {
  if (isRolling.value) return;

  isRolling.value = true;
  const result = roll();

  if (typeof result === "number") {
    currentValue.value = result;
  }

  setTimeout(() => {
    isRolling.value = false;
  }, 200);
}
</script>

<style scoped>
.window-inner h3 {
  margin: 0 0 6px;
  font-size: 13px;
}

.window-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.window-inner p {
  font-size: 12px;
  margin: 0 0 6px;
}

.dice-box {
  margin-top: 8px;
  width: 200px;
  height: 100px;
  background: #2e3440;
  border-radius: 10px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
  transition: transform 0.15s ease, background 0.2s ease;
}

.dice-box:hover {
  background: #3b4252;
}

.dice-box.active {
  transform: scale(0.9);
}

.dice-text {
  font-size: 50px;
}

.dice-value {
  font-size: 48px;
  font-weight: bold;
}
</style>