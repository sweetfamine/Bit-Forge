//balance einstellungen fürs chaos gain
export const Balance = {
    gainChaosBase: 0.012, //basis chaos gain pro wurf
    gainChaosScale: 0.020,  //skalierung des chaos gain basierend auf würfelergebnis

    gainExponent: 1.2,  //exponent für die reduzierung des bit gewinns durch chaos level
    minBitProdMultiplier: 0.25, //min. multiplikator für bit production
    safeRebootChaosThreshold: 0.8, //max chaos level für den safe reboot bonus
    safeRebootBonus: 0.2, //20% mehr Cores bei Safe Reboot
}