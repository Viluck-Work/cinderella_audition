import type { AdminViewServerProps } from 'payload'

import './tasks.css'

import TasksClient from './TasksClient'

type SearchParams = Record<string, string | string[] | undefined>

const pickTask = (sp: SearchParams | undefined): string => {
  const raw = sp?.task
  const v = Array.isArray(raw) ? raw[0] : raw
  return v || 'news'
}

export default async function Tasks(props: AdminViewServerProps) {
  const sp = (props as unknown as { searchParams?: SearchParams }).searchParams
  const taskId = pickTask(sp)
  return <TasksClient taskId={taskId} />
}
