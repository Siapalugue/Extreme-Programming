import type { Task } from "@/types/task"

const STORAGE_KEY = "taskeasy-tasks"

export function loadTasks(): Task[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }

    const tasks = JSON.parse(stored)
    return Array.isArray(tasks) ? tasks : []
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error)
    return []
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error)
  }
}

export function clearTasks(): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing tasks from localStorage:", error)
  }
}
