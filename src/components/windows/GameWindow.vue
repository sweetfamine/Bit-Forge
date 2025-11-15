<template>
  <div class="window-inner">
    <!-- Großer Button: alle würfeln -->
    <button
      class="dice-button"
      @click="rollAll"
      :disabled="isRolling"
      :class="{ rolling: isRolling }"
    >
      <div class="dice-face">
        <template v-if="totalValue === null">
          <span class="pip pip-1"></span>
          <span class="pip pip-2"></span>
          <span class="pip pip-3"></span>
          <span class="pip pip-4"></span>
          <span class="pip pip-5"></span>
          <span class="pip pip-6"></span>
        </template>

        <span v-else class="dice-result">
          {{ totalValue }}
        </span>
      </div>
    </button>

    <!-- Einzelwürfel -->
    <div class="dice-list">
      <button
        v-for="(die, index) in dice"
        :key="index"
        class="small-die-button"
        @click="rollSingle(index)"
        :disabled="isRolling"
      >
        <div class="small-die-face">
          <span class="small-die-label">
            {{ die.count }}x d{{ die.sides }}
          </span>
          <span
            v-if="currentValues[index] !== null"
            class="small-die-result"
          >
            {{ currentValues[index] }}
          </span>
          <span
            v-else
            class="small-die-result small-die-result--placeholder"
          >
            —
          </span>
        </div>
      </button>
    </div>

    <p>
      Press to roll the Dice!
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Die } from "../../core/types"
import { useGameWindow } from "./GameWindow"

const props = defineProps<{
  dice?: Die[]
}>()

const {
  dice,
  isRolling,
  totalValue,
  currentValues,
  rollAll,
  rollSingle
} = useGameWindow(props)
</script>

<style scoped src="./GameWindow.css"></style>