const REPEAT_STORAGE_KEY = 'learn-vue-now:repeat-ids'

export function readRepeatQuestionIds(): string[] {
  const value = localStorage.getItem(REPEAT_STORAGE_KEY)

  if (!value) {
    return []
  }

  try {
    const parsedValue = JSON.parse(value)
    return Array.isArray(parsedValue) ? parsedValue.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function saveRepeatQuestionIds(questionIds: string[]): void {
  localStorage.setItem(REPEAT_STORAGE_KEY, JSON.stringify(questionIds))
}
