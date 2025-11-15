import { ref, computed, watch } from 'vue'
import type { Die } from '../../core/types'
import { rollAllDice, rollDieAtIndex } from '../../core/formulas'

interface GameWindowProps
{
  dice?: Die[]
}

export function useGameWindow(props: GameWindowProps)
{
  const isRolling = ref(false)
  const currentValues = ref<(number | null)[]>([])
  const lastRollMode = ref<'all' | 'single' | null>(null)
  const lastRolledIndex = ref<number | null>(null)

  // computed-Wrapper, damit du im Template einfach "dice" benutzen kannst
  const dice = computed(() => props.dice ?? [])

  // Reagiere auf Änderungen der Dice-Prop
  watch(
    () => props.dice,
    (diceList) =>
    {
      const list = diceList ?? []
      currentValues.value = list.map(() => null)
      lastRollMode.value = null
      lastRolledIndex.value = null
    },
    { immediate: true, deep: true }
  )

  // Anzeige der Würfelliste (falls du sie mal im Template nutzen willst)
  const diceDisplay = computed(() =>
  {
    const list = props.dice ?? []

    if (list.length === 0)
    {
      return '—'
    }

    return list
      .map((d) => `${d.count}d${d.sides}`)
      .join(' + ')
  })

  // Gesamtergebnis des letzten Wurfs
  const totalValue = computed(() =>
  {
    if (lastRollMode.value === null)
    {
      return null
    }

    // letzter Wurf: alle Würfel
    if (lastRollMode.value === 'all')
    {
      const values = currentValues.value.filter(
        (v): v is number => typeof v === 'number'
      )

      if (values.length === 0)
      {
        return null
      }

      return values.reduce((sum, v) => sum + v, 0)
    }

    // letzter Wurf: einzelner Würfel
    if (lastRollMode.value === 'single')
    {
      if (lastRolledIndex.value === null)
      {
        return null
      }

      const value = currentValues.value[lastRolledIndex.value]

      return typeof value === 'number' ? value : null
    }

    return null
  })

  function rollAll()
  {
    if (isRolling.value)
    {
      return
    }

    isRolling.value = true

    const results = rollAllDice()

    currentValues.value = results.map((r) =>
      typeof r === 'number' && Number.isFinite(r) ? r : null
    )

    lastRollMode.value = 'all'
    lastRolledIndex.value = null

    setTimeout(() =>
    {
      isRolling.value = false
    }, 200)
  }

  function rollSingle(index: number)
  {
    if (isRolling.value)
    {
      return
    }

    isRolling.value = true

    const result = rollDieAtIndex(index)

    if (typeof result === 'number' && Number.isFinite(result))
    {
      currentValues.value[index] = result
      lastRollMode.value = 'single'
      lastRolledIndex.value = index
    }

    setTimeout(() =>
    {
      isRolling.value = false
    }, 200)
  }

  return {
    dice,
    diceDisplay,
    isRolling,
    totalValue,
    currentValues,
    rollAll,
    rollSingle,
  }
}