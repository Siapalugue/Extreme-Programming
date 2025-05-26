"use client"

import { useState, useEffect } from "react"
import { TaskForm } from "@/components/task-form"
import { TaskList } from "@/components/task-list"
import { TaskStats } from "@/components/task-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Task, TaskStatus } from "@/types/task"
import { loadTasks, saveTasks } from "@/lib/storage"

export default function TaskManagementApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = loadTasks()
    setTasks(savedTasks)
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task)),
    )
    setEditingTask(null)
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
    if (editingTask?.id === id) {
      setEditingTask(null)
    }
  }

  const startEditing = (task: Task) => {
    setEditingTask(task)
  }

  const cancelEditing = () => {
    setEditingTask(null)
  }

  // Sort tasks by priority (high -> medium -> low) and then by creation date
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const filterTasksByStatus = (status: TaskStatus) => sortedTasks.filter((task) => task.status === status)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">TaskEasy</h1>
          <p className="text-gray-600">Lightweight task management for agile teams</p>
        </div>

        {/* Stats Overview */}
        <TaskStats tasks={tasks} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{editingTask ? "Edit Task" : "Create New Task"}</CardTitle>
                <CardDescription>
                  {editingTask ? "Update the task details below" : "Add a new task to your workflow"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TaskForm
                  onSubmit={editingTask ? (data) => updateTask(editingTask.id, data) : addTask}
                  initialData={editingTask || undefined}
                  onCancel={editingTask ? cancelEditing : undefined}
                />
              </CardContent>
            </Card>
          </div>

          {/* Task Lists */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Manage your tasks by status. Tasks are sorted by priority.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
                    <TabsTrigger value="to-do">To Do ({filterTasksByStatus("to-do").length})</TabsTrigger>
                    <TabsTrigger value="in-progress">
                      In Progress ({filterTasksByStatus("in-progress").length})
                    </TabsTrigger>
                    <TabsTrigger value="done">Done ({filterTasksByStatus("done").length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4">
                    <TaskList
                      tasks={sortedTasks}
                      onEdit={startEditing}
                      onDelete={deleteTask}
                      onStatusChange={(id, status) => updateTask(id, { status })}
                    />
                  </TabsContent>

                  <TabsContent value="to-do" className="mt-4">
                    <TaskList
                      tasks={filterTasksByStatus("to-do")}
                      onEdit={startEditing}
                      onDelete={deleteTask}
                      onStatusChange={(id, status) => updateTask(id, { status })}
                    />
                  </TabsContent>

                  <TabsContent value="in-progress" className="mt-4">
                    <TaskList
                      tasks={filterTasksByStatus("in-progress")}
                      onEdit={startEditing}
                      onDelete={deleteTask}
                      onStatusChange={(id, status) => updateTask(id, { status })}
                    />
                  </TabsContent>

                  <TabsContent value="done" className="mt-4">
                    <TaskList
                      tasks={filterTasksByStatus("done")}
                      onEdit={startEditing}
                      onDelete={deleteTask}
                      onStatusChange={(id, status) => updateTask(id, { status })}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
