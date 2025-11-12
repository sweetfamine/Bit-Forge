// Würfelt einen Würfel mit der angegebenen Anzahl an Seiten
export function rollDice(die: number): number {
    const sides = Number(die);
    if (!Number.isFinite(sides) || sides < 1) return 0;
    return Math.floor(Math.random() * sides) + 1;
}

// Fügt die angegebene Anzahl an Bits zum aktuellen Bit-Wert hinzu
export function gainBits(currentBits: number, amount: number): number {
    return currentBits + amount;
}