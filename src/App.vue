<template>
  <div>
    <h1>Bit Forge Idle</h1>
    <p>Bits: {{ gamestate.bits }}</p>
    <p>Chaos: {{ gamestate.chaos }}</p>
    <p>Cores: {{ gamestate.cores }}</p>
    <button @click="roll">Würfeln</button>
    <button @click="manualReboot">Reboot</button>
  </div>
</template>

<script setup lang="ts">
import { gamestate } from './store/gamestate'
import { rollDice } from './core/dice'
import { calculateBitGain, calculateChaosGain} from './core/formulas';
import { endRun } from './store/runactions';

// Funktion zum Würfeln des ersten Würfels und Hinzufügen des Ergebnisses zu den Bits
function roll() {
  const die = gamestate.dice[0];
  if (!die)
  {
    return;
  }

  const result = rollDice(die.sides);

  if (!Number.isFinite(result))
  {
    return;
  }

  // Bits
  const bitGain = calculateBitGain(result);
  gamestate.bits = Number(gamestate.bits) + bitGain;

  // Chaos
  const chaosGain = calculateChaosGain(result, die.sides);
  gamestate.chaos = Math.min(gamestate.chaos + chaosGain, 1);

  //check for chaos overflow
  if (gamestate.chaos >= gamestate.maxChaos)
  {
    const RunEndReason = 'chaosOverflow';
    endRun(RunEndReason);
  }
}

// Funktion zum Rebooten des Spiels und Berechnen der gewonnenen Cores
function manualReboot() {
  const RunEndReason = 'manualReboot';
  endRun(RunEndReason);
}

</script>

