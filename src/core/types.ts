// Ein Bit, das entweder 0 oder 1 sein kann
export type Bit = 0 | 1

// Ein Würfel mit einer bestimmten Anzahl an Seiten und einem aktuellen Wert
export interface Die {
    sides: 4 | 6 | 8 | 10 | 12 | 20
    count: number
}

// Der gesamte Spielzustand
export interface GameState {
    bits: number,   //currency and score
    runYield: number,   // total bits per run
    dice: Die[],
    chaos: number,
    maxchaos: number,
    stability: Bit [],
    upgrades: Record<string, number>,
    cores: number,                      // meta currency
    prodMultiplier: number,
}