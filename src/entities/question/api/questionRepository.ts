import type { Question } from '@/entities/question/model/types'

type JsonModule = Question[] | { default: Question[] }

const questionModules = import.meta.glob('@/data/questions/*.json', {
  eager: true,
}) as Record<string, JsonModule>

export function loadAllQuestions(): Question[] {
  return Object.values(questionModules)
    .flatMap((moduleValue) => ('default' in moduleValue ? moduleValue.default : moduleValue))
    .map((question) => ({
      ...question,
      tags: question.tags ?? [],
    }))
}
