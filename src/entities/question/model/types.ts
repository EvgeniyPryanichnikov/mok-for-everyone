export const TOPICS = ['vue', 'nuxt', 'javascript', 'typescript', 'react', 'browser_networks', 'legend'] as const

export type Topic = (typeof TOPICS)[number]
export type TopicFilter = Topic | 'CONSTRUCTOR'
export type QuestionLevel = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  topic: Topic
  question: string
  answer: string
  tags?: string[]
  level?: QuestionLevel
}
