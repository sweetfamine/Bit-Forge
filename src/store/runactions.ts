import { calculateCoresOnReboot } from "../core/formulas";
import type { RunEndReason } from "../core/types";
import { gamestate } from "./gamestate"

let runIsEnding = false; // Verhindert mehrfaches Beenden eines Runs

// Beendet den aktuellen Run basierend auf dem angegebenen Grund
export function endRun(reason: RunEndReason)
{
    if (runIsEnding === true)
    {
    return;
    }

    runIsEnding = true;
    if (reason === 'manualReboot')
    {
        const coreGain = calculateCoresOnReboot(gamestate.bits, gamestate.chaos, true);
        gamestate.cores = Number(gamestate.cores) + coreGain;
    }
    else if (reason === 'chaosOverflow')
    {
        const coreGain = calculateCoresOnReboot(gamestate.bits, gamestate.chaos, false);
        gamestate.cores = Number(gamestate.cores) + coreGain;
    }

    resetrun();
    runIsEnding = false;
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