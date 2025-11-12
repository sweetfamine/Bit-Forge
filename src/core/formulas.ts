import { gamestate } from "../store/gamestate";
import { Balance } from "./balance";

// Berechnet den Bit-Gewinn basierend auf dem Würfelergebnis und dem aktuellen Chaos-Level
export function calculateBitGain(diceroll: number) {
    const exponent = Balance.gainExponent;
    const mult = Math.max(0, 1 - Math.pow(gamestate.chaos, exponent));
    const gain = Math.floor(diceroll * gamestate.prodMultiplier * mult);
    return gain;
}

// Berechnet wie hoch dein Chaos nach dem Wurf steigt
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

    if (manualReboot === true && chaos < Balance.safeRebootChaosThreshold)
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