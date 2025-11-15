<template>
  <div class="window-inner">
    <div class="power-actions">
      <!-- Speichern -->
      <button class="power-btn" @click="">
        <Save />
      </button>

      <!-- Neustarten -->
      <button class="power-btn" @click="manualReboot">
        <RefreshCw />
      </button>

      <!-- Herunterfahren -->
      <button class="power-btn" @click="">
        <Power />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { manualReboot} from '../../core/formulas'
</script>

<style scoped src="./RestartWindow.css"></style>