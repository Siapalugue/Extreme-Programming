"use client"

import type { Task } from "@/types/task"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertCircle, ListTodo } from "lucide-react"

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length
  const todoTasks = tasks.filter((task) => task.status === "to-do").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const doneTasks = tasks.filter((task) => task.status === "done").length
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length

  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: ListTodo,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "To Do",
      value: todoTasks,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Completed",
      value: doneTasks,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.title === "Completed" && totalTasks > 0 && (
                <p className="text-xs text-gray-500 mt-1">{completionRate}% completion rate</p>
              )}
              {stat.title === "Total Tasks" && highPriorityTasks > 0 && (
                <p className="text-xs text-red-600 mt-1">{highPriorityTasks} high priority</p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
