export const TOPICS = ['vue', 'javascript', 'typescript', 'react', 'browser_networks'] as const

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
