<template>
  <div>
    <h1>Bit Forge Idle</h1>
    <p>Bits: {{ gamestate.bits }}</p>
    <p>Chaos: {{ gamestate.chaos }}</p>
    <p>Cores: {{ gamestate.cores }}</p>
    <button @click="roll">Würfeln</button>
    <button @click="reboot">Reboot</button>
  </div>
</template>

<script setup lang="ts">
import { gamestate } from './store/gamestate'
import { rollDice } from './core/dice'
import { calculateBitGain, calculateChaosGain, calculateCoresOnReboot } from './core/formulas';
import { Balance } from './core/balance';

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

  const bitGain = calculateBitGain(result);
  const chaosGain = calculateChaosGain(result, die.sides);
  gamestate.bits = Number(gamestate.bits) + bitGain;
  gamestate.chaos = Math.min(gamestate.chaos + chaosGain, 1);
}

// Funktion zum Rebooten des Spiels und Berechnen der gewonnenen Cores
function reboot() {
  let safeReboot = false;

    if (gamestate.chaos >= Balance.safeRebootChaosThreshold)
    {
        safeReboot = true;
    }
    else
    {
        safeReboot = false;
    }

    const coreGain = calculateCoresOnReboot(gamestate.bits, gamestate.chaos, safeReboot);
    gamestate.cores = Number(gamestate.cores) + coreGain;

    // Reset des Spielzustands
    gamestate.bits = 0;
    gamestate.runYield = 0;
    gamestate.dice = [{ sides: 4, count: 1 }];
    gamestate.chaos = 0;
    gamestate.maxchaos = 100;
}
</script>

