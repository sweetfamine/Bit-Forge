import { calculateCoresOnReboot, checkForSafeReboot } from "../core/formulas";
import type { RunEndReason } from "../core/types";
import { gamestate } from "./gamestate"

// Beendet den aktuellen Run basierend auf dem angegebenen Grund
export function endRun(reason: RunEndReason)
{
    if (reason === 'manualReboot')
    {
        calculateCoresOnReboot(gamestate.bits, gamestate.chaos, true);
    }
    else if (reason === 'chaosOverflow')
    {
        calculateCoresOnReboot(gamestate.bits, gamestate.chaos, false);
    }

    resetrun();
}

// Setzt den Spielzustand für einen neuen Run zurück
export function resetrun() {
    gamestate.bits = 0
    gamestate.runYield = 0
    gamestate.dice = []
    gamestate.chaos = 0
    gamestate.stability = []

    gamestate.dice = [{ sides: 4, count: 1 }];
    gamestate.prodMultiplier = 1;
}