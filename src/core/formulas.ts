import { gamestate } from "../store/gamestate";
import { Balance } from "./balance";
import { rollDice } from "./dice";
import { endRun } from "../store/runactions";
import type { Die } from "./types";

// Berechnet den Bit-Gewinn basierend auf dem Würfelergebnis und dem aktuellen Chaos-Level
export function calculateBitGain(diceroll: number) {
    const exponent = Balance.gainExponent;
    const mult = Math.max(Balance.minBitProdMultiplier, 1 - Math.pow(gamestate.chaos, exponent));
    let gain = Math.floor(diceroll * gamestate.prodMultiplier * mult);

    if (gain < 1) // min 1 Bit Gewinn
    {
        gain = 1;
    }

    return gain;
}

// Berechnet wie hoch dein Chaos nach dem Wurf steigt
// Basierend auf dem Würfelergebnis und der Anzahl der Seiten des Würfels
export function calculateChaosGain(diceroll: number, sides: number) {
    const base = Balance.gainChaosBase
    const scale = Balance.gainChaosScale
    const chaosGain = base + (diceroll / sides) * scale
    return chaosGain;
}

//Berechnet wie viele Cores du nach dem Reboot bekommst
// Berücksichtigt dabei ob es ein manueller Reboot war und ob der Safe Reboot Bonus greift
export function calculateCoresOnReboot(bits: number, chaos: number, manualReboot: boolean) {
    const baseCores = Math.floor(Math.log2(bits + 1))
    const chaosMultiplier = Math.floor(baseCores * chaos)
    const cores = Math.floor(baseCores + chaosMultiplier)

    let safeRebootBonus: number;

    checkForSafeReboot();
    if ( checkForSafeReboot() === true && manualReboot === true)
    {
        safeRebootBonus = Balance.safeRebootBonus
    }
    else
    {
        safeRebootBonus = 0
    }

    const totalCores = Math.floor(cores * (1 + safeRebootBonus))
    return totalCores;
}

// Prüft ob ein sicherer Reboot möglich ist basierend auf dem aktuellen Chaos-Level
export function checkForSafeReboot()
{
    let safeReboot = false;
    if (gamestate.chaos >= Balance.safeRebootChaosThreshold)
    {
        safeReboot = true;
    }
    else
    {
        safeReboot = false;
    }

    return safeReboot;
}

// einen einzelnen Die würfeln (unter Berücksichtigung von count)
// gibt die Summe aller Würfe für diesen Die zurück
export function rollSingleDie(die: Die): number
{
  let total = 0

  for (let i = 0; i < die.count; i++)
  {
    const result = rollDice(die.sides)

    if (!Number.isFinite(result))
    {
      continue
    }

    total += result

    // Bits
    const bitGain = calculateBitGain(result)
    gamestate.bits = Number(gamestate.bits) + bitGain

    // Chaos
    const chaosGain = calculateChaosGain(result, die.sides)
    gamestate.chaos = Math.min(gamestate.chaos + chaosGain, 1)

    // check for chaos overflow
    if (gamestate.chaos >= gamestate.maxChaos)
    {
      const RunEndReason = 'chaosOverflow'
      endRun(RunEndReason)
      break
    }
  }

  return total
}

// einen Würfel per Index im GameState würfeln
export function rollDieAtIndex(index: number)
{
  const die = gamestate.dice[index]

  if (!die)
  {
    return
  }

  return rollSingleDie(die)
}

// alle Würfel im GameState würfeln
export function rollAllDice()
{
  return gamestate.dice.map((die) => rollSingleDie(die))
}

// Funktion zum Rebooten des Spiels und Berechnen der gewonnenen Cores
export function manualReboot() {
  const RunEndReason = 'manualReboot';
  endRun(RunEndReason);
}