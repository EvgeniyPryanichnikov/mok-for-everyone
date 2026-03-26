import type { TopicFilter } from '@/entities/question/model/types'

const SESSION_STORAGE_KEY = 'learn-vue-now:session'

interface SessionSnapshot {
  selectedTopic: TopicFilter
  currentQuestionId: string | null
}

const TOPIC_FILTER_SET = new Set<TopicFilter>(['vue', 'javascript', 'typescript', 'react', 'browser_networks', 'CONSTRUCTOR'])

function isTopicFilter(value: unknown): value is TopicFilter {
  return typeof value === 'string' && TOPIC_FILTER_SET.has(value as TopicFilter)
}

export function readSessionSnapshot(): SessionSnapshot | null {
  const value = localStorage.getItem(SESSION_STORAGE_KEY)

  if (!value) {
    return null
  }

  try {
    const parsedValue = JSON.parse(value) as Partial<SessionSnapshot>

    if (!isTopicFilter(parsedValue.selectedTopic)) {
      return null
    }

    const currentQuestionId =
      typeof parsedValue.currentQuestionId === 'string' || parsedValue.currentQuestionId === null
        ? parsedValue.currentQuestionId
        : null

    return {
      selectedTopic: parsedValue.selectedTopic,
      currentQuestionId,
    }
  } catch {
    return null
  }
}

export function saveSessionSnapshot(snapshot: SessionSnapshot): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot))
}
