// hooks/useDebounce.ts

import { useState, useEffect } from 'react'

/**
 * Хук для задержки обновления значения (debounce)
 * Angular аналогия: как RxJS debounceTime оператор для Observable
 * 
 * @param value - значение которое нужно задержать
 * @param delay - задержка в миллисекундах
 * @returns задержанное значение
 * 
 * Пример использования:
 * const searchQuery = useDebounce(inputValue, 500)
 * // API вызов произойдет только через 500ms после окончания ввода
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}