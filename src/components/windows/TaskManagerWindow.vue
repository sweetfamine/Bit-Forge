<template>
  <div class="window-inner">
    <h3>Task-Manager</h3>
    <ul>
      <li>Bits – {{ gamestate.bits }}</li>
      <li>Cores – {{ gamestate.cores }}</li>
      <li>Chaos – {{ Math.round(gamestate.chaos * 100) }}%</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { gamestate} from '../../store/gamestate'
</script>

<style scoped src="./TaskManagerWindow.css"></style>