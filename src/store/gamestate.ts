import { reactive } from "vue";
import type { GameState, Bit, Die } from "../core/types";

// Speichert den GameState als reaktives Objekt
export const gamestate = reactive<GameState>({
    bits: 0 as number,
    runYield: 0 as number,
    dice: [{ sides: 4, count: 1 } as Die],
    chaos: 0 as number,
    maxChaos: 1 as number,
    stability: new Array(12).fill(1) as Bit[],
    upgrades: {},
    cores: 0 as number,
    prodMultiplier: 1 as number,
});