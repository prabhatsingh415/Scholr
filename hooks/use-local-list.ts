"use client"

import { useEffect, useState } from "react"

type Getter<T> = () => T[]
type Adder<T, I> = (input: I) => T
type Updater<T> = (id: string, updates: Partial<T>) => T | null
type Deleter = (id: string) => void

export function useLocalList<T, I>(get: Getter<T>, add: Adder<T, I>, update: Updater<T>, remove: Deleter) {
  const [items, setItems] = useState<T[]>([])
  useEffect(() => {
    setItems(get())
  }, [get])

  const refresh = () => setItems(get())

  const create = (input: I) => {
    const created = add(input)
    refresh()
    return created
  }

  const patch = (id: string, updates: Partial<T>) => {
    const res = update(id, updates)
    refresh()
    return res
  }

  const destroy = (id: string) => {
    remove(id)
    refresh()
  }

  return { items, refresh, create, patch, destroy }
}
