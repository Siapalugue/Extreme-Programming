// Test utilities for supporting TDD practices
import type { Task, TaskPriority, TaskStatus } from "@/types/task"

export function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: crypto.randomUUID(),
    title: "Test Task",
    description: "Test Description",
    priority: "medium" as TaskPriority,
    status: "to-do" as TaskStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockTasks(count: number): Task[] {
  return Array.from({ length: count }, (_, index) =>
    createMockTask({
      title: `Task ${index + 1}`,
      priority: ["low", "medium", "high"][index % 3] as TaskPriority,
      status: ["to-do", "in-progress", "done"][index % 3] as TaskStatus,
    }),
  )
}

// Helper function to validate task data
export function validateTask(task: Partial<Task>): string[] {
  const errors: string[] = []

  if (!task.title || task.title.trim().length === 0) {
    errors.push("Title is required")
  }

  if (task.title && task.title.length > 100) {
    errors.push("Title must be less than 100 characters")
  }

  if (task.description && task.description.length > 500) {
    errors.push("Description must be less than 500 characters")
  }

  const validPriorities: TaskPriority[] = ["low", "medium", "high"]
  if (task.priority && !validPriorities.includes(task.priority)) {
    errors.push("Priority must be low, medium, or high")
  }

  const validStatuses: TaskStatus[] = ["to-do", "in-progress", "done"]
  if (task.status && !validStatuses.includes(task.status)) {
    errors.push("Status must be to-do, in-progress, or done")
  }

  return errors
}
