'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Delete, Equal } from 'lucide-react'

type CalcButton = {
  label: string | React.ReactNode
  value: string
  type: 'number' | 'operator' | 'action' | 'equals'
  span?: number
}

const MAX_DISPLAY = 16

export function Calculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [operator, setOperator] = useState<string | null>(null)
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [justCalculated, setJustCalculated] = useState(false)

  const inputDigit = useCallback(
    (digit: string) => {
      if (waitingForOperand) {
        setDisplay(digit)
        setWaitingForOperand(false)
        setJustCalculated(false)
        return
      }
      if (justCalculated) {
        setDisplay(digit)
        setExpression('')
        setJustCalculated(false)
        return
      }
      setDisplay((prev) =>
        prev === '0' ? digit : prev.length < MAX_DISPLAY ? prev + digit : prev
      )
    },
    [waitingForOperand, justCalculated]
  )

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.') && display.length < MAX_DISPLAY) {
      setDisplay((prev) => prev + '.')
    }
  }, [waitingForOperand, display])

  const clear = useCallback(() => {
    setDisplay('0')
    setExpression('')
    setOperator(null)
    setPrevValue(null)
    setWaitingForOperand(false)
    setJustCalculated(false)
  }, [])

  const backspace = useCallback(() => {
    if (justCalculated || waitingForOperand) return
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'))
  }, [justCalculated, waitingForOperand])

  const toggleSign = useCallback(() => {
    setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev))
  }, [])

  const percentage = useCallback(() => {
    const value = parseFloat(display)
    if (!isNaN(value)) {
      setDisplay(String(value / 100))
    }
  }, [display])

  const calculate = useCallback(
    (a: number, b: number, op: string): number => {
      switch (op) {
        case '+': return a + b
        case '−': return a - b
        case '×': return a * b
        case '÷': return b !== 0 ? a / b : NaN
        default: return b
      }
    },
    []
  )

  const handleOperator = useCallback(
    (nextOp: string) => {
      const inputValue = parseFloat(display)

      if (prevValue !== null && operator && !waitingForOperand) {
        const result = calculate(prevValue, inputValue, operator)
        const resultStr = isNaN(result)
          ? 'Error'
          : parseFloat(result.toPrecision(12)).toString()
        setDisplay(resultStr)
        setExpression(`${resultStr} ${nextOp}`)
        setPrevValue(isNaN(result) ? null : result)
      } else {
        setExpression(`${display} ${nextOp}`)
        setPrevValue(inputValue)
      }

      setWaitingForOperand(true)
      setOperator(nextOp)
      setJustCalculated(false)
    },
    [display, prevValue, operator, waitingForOperand, calculate]
  )

  const handleEquals = useCallback(() => {
    const inputValue = parseFloat(display)

    if (prevValue !== null && operator) {
      const result = calculate(prevValue, inputValue, operator)
      const resultStr = isNaN(result)
        ? 'Error'
        : parseFloat(result.toPrecision(12)).toString()
      setExpression(`${prevValue} ${operator} ${display} =`)
      setDisplay(resultStr)
      setPrevValue(null)
      setOperator(null)
      setWaitingForOperand(false)
      setJustCalculated(true)
    }
  }, [display, prevValue, operator, calculate])

  const buttons: CalcButton[] = [
    { label: 'AC', value: 'AC', type: 'action' },
    { label: '+/−', value: '+/-', type: 'action' },
    { label: '%', value: '%', type: 'action' },
    { label: '÷', value: '÷', type: 'operator' },
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '×', value: '×', type: 'operator' },
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '−', value: '−', type: 'operator' },
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '+', value: '+', type: 'operator' },
    { label: '0', value: '0', type: 'number', span: 2 },
    { label: '.', value: '.', type: 'number' },
    { label: <Equal className="size-4" />, value: '=', type: 'equals' },
  ]

  const handleButton = (btn: CalcButton) => {
    if (btn.type === 'number') {
      if (btn.value === '.') inputDecimal()
      else inputDigit(btn.value)
    } else if (btn.type === 'operator') {
      handleOperator(btn.value)
    } else if (btn.type === 'equals') {
      handleEquals()
    } else if (btn.type === 'action') {
      if (btn.value === 'AC') clear()
      else if (btn.value === '+/-') toggleSign()
      else if (btn.value === '%') percentage()
    }
  }

  const displayFontSize =
    display.length > 12 ? 'text-xl' : display.length > 8 ? 'text-2xl' : 'text-3xl'

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
        {/* Display */}
        <div className="px-5 py-4 bg-muted/30 border-b border-border min-h-[90px] flex flex-col items-end justify-end">
          <p className="text-xs text-muted-foreground h-4 mb-1 truncate w-full text-right">
            {expression || '\u00A0'}
          </p>
          <p
            className={cn(
              'font-mono font-semibold text-foreground transition-all truncate w-full text-right',
              displayFontSize
            )}
            aria-live="polite"
            aria-label={`Calculator display: ${display}`}
          >
            {display}
          </p>
        </div>

        {/* Backspace row */}
        <div className="px-4 pt-3 flex justify-end">
          <button
            onClick={backspace}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Backspace"
          >
            <Delete className="size-4" />
          </button>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2 p-4 pt-1">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => handleButton(btn)}
              className={cn(
                'h-12 rounded-xl text-sm font-semibold transition-all active:scale-95 select-none',
                btn.span === 2 && 'col-span-2',
                btn.type === 'equals'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : btn.type === 'operator'
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
                    : btn.type === 'action'
                      ? 'bg-muted text-muted-foreground hover:bg-muted/70'
                      : 'bg-background text-foreground hover:bg-muted border border-border'
              )}
              aria-label={typeof btn.label === 'string' ? btn.label : btn.value}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
