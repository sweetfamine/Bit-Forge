<template>
  <div class="window-inner">
    <h3>Task-Manager</h3>
    <ul>
      <li>Bits – {{ gameState.bits }}</li>
      <li>Cores – {{ gameState.cores }}</li>
      <li>Chaos – {{ gameState.chaos }}%</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { gamestate as gameState } from '../../store/gamestate'
</script>

<style scoped src="./TaskManagerWindow.css"></style>