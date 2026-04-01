import { computed, readonly, ref } from 'vue'

import { loadAllQuestions } from '@/entities/question/api/questionRepository'
import { TOPICS, type Question, type Topic, type TopicFilter } from '@/entities/question/model/types'
import { exportRepeatQuestionsToPdf } from '@/features/export-pdf/lib/exportRepeatQuestionsToPdf'
import { readRepeatQuestionIds, saveRepeatQuestionIds } from '@/features/repeat-mark/model/storage'
import { readSessionSnapshot, saveSessionSnapshot } from '@/features/session-progress/model/storage'
import { shuffle } from '@/shared/lib/shuffle'

const allQuestions = ref<Question[]>(loadAllQuestions())
const selectedTopic = ref<TopicFilter | null>(null)
const sessionQuestions = ref<Question[]>([])
const currentIndex = ref(0)
const repeatQuestionIds = ref<string[]>(readRepeatQuestionIds())
const constructorTopics = ref<Topic[]>([])
const isConstructorPanelOpen = ref(false)

const availableTopics = computed(() => [...TOPICS, 'CONSTRUCTOR'] as TopicFilter[])
const canStartConstructorMock = computed(() => constructorTopics.value.length > 0)
const topicLabels: Record<Topic, string> = {
  vue: 'Vue',
  nuxt: 'Nuxt',
  legend: 'Легенда',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  browser_networks: 'Браузер и сети',
}
const currentTopicTitle = computed(() => {
  if (selectedTopic.value === 'CONSTRUCTOR') {
    if (constructorTopics.value.length === 0) {
      return 'Конструктор Мока'
    }

    const names = constructorTopics.value.map((topic) => topicLabels[topic]).join(', ')
    return `Микс: ${names}`
  }

  if (selectedTopic.value && selectedTopic.value in topicLabels) {
    return topicLabels[selectedTopic.value as Topic]
  }

  return '—'
})

const currentQuestion = computed(() => sessionQuestions.value[currentIndex.value] ?? null)
const totalQuestions = computed(() => sessionQuestions.value.length)
const canGoPrev = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < sessionQuestions.value.length - 1)
const isCurrentRepeat = computed(() => {
  if (!currentQuestion.value) {
    return false
  }

  return repeatQuestionIds.value.includes(currentQuestion.value.id)
})

const repeatQuestions = computed(() => {
  const repeatSet = new Set(repeatQuestionIds.value)
  return allQuestions.value.filter((question) => repeatSet.has(question.id))
})

function persistSession(): void {
  if (!selectedTopic.value) {
    return
  }

  saveSessionSnapshot({
    selectedTopic: selectedTopic.value,
    currentQuestionId: currentQuestion.value?.id ?? null,
  })
}

function applyTopic(topic: Topic, preferredQuestionId?: string | null): void {
  selectedTopic.value = topic

  const source = allQuestions.value.filter((item) => item.topic === topic)
  sessionQuestions.value = source
  currentIndex.value = 0

  if (preferredQuestionId) {
    const restoredIndex = sessionQuestions.value.findIndex((question) => question.id === preferredQuestionId)
    if (restoredIndex >= 0) {
      currentIndex.value = restoredIndex
    }
  }

  persistSession()
}

function selectTopic(topic: TopicFilter): void {
  if (topic === 'CONSTRUCTOR') {
    selectedTopic.value = topic
    isConstructorPanelOpen.value = true
    sessionQuestions.value = []
    currentIndex.value = 0
    persistSession()
    return
  }

  applyTopic(topic)
}

function toggleConstructorTopic(topic: Topic): void {
  constructorTopics.value = constructorTopics.value.includes(topic)
    ? constructorTopics.value.filter((item) => item !== topic)
    : [...constructorTopics.value, topic]
}

function startConstructorMock(): void {
  if (constructorTopics.value.length === 0) {
    return
  }

  selectedTopic.value = 'CONSTRUCTOR'
  const selectedSet = new Set(constructorTopics.value)
  const source = allQuestions.value.filter((item) => selectedSet.has(item.topic))
  sessionQuestions.value = shuffle(source)
  currentIndex.value = 0
  isConstructorPanelOpen.value = false
  persistSession()
}

function closeConstructor(): void {
  isConstructorPanelOpen.value = false
  selectedTopic.value = null
  sessionQuestions.value = []
  currentIndex.value = 0
}

function prevQuestion(): void {
  if (canGoPrev.value) {
    currentIndex.value -= 1
    persistSession()
  }
}

function nextQuestion(): void {
  if (canGoNext.value) {
    currentIndex.value += 1
    persistSession()
  }
}

function toggleRepeat(questionId: string): void {
  const next = repeatQuestionIds.value.includes(questionId)
    ? repeatQuestionIds.value.filter((id) => id !== questionId)
    : [...repeatQuestionIds.value, questionId]

  repeatQuestionIds.value = next
  saveRepeatQuestionIds(next)
}

function toggleCurrentRepeat(): void {
  if (!currentQuestion.value) {
    return
  }

  toggleRepeat(currentQuestion.value.id)
}

function clearRepeatQuestions(): void {
  repeatQuestionIds.value = []
  saveRepeatQuestionIds([])
}

function exportRepeatPdf(): void {
  exportRepeatQuestionsToPdf(repeatQuestions.value)
}

function restoreSession(): void {
  const snapshot = readSessionSnapshot()
  if (!snapshot) {
    return
  }

  if (snapshot.selectedTopic === 'CONSTRUCTOR') {
    selectedTopic.value = 'CONSTRUCTOR'
    isConstructorPanelOpen.value = false
    sessionQuestions.value = []
    currentIndex.value = 0
    return
  }

  applyTopic(snapshot.selectedTopic, snapshot.currentQuestionId)
}

restoreSession()

export function useQuizStore() {
  return {
    allQuestions: readonly(allQuestions),
    baseTopics: TOPICS,
    availableTopics,
    constructorTopics,
    isConstructorPanelOpen: readonly(isConstructorPanelOpen),
    canStartConstructorMock,
    currentTopicTitle,
    selectedTopic: readonly(selectedTopic),
    sessionQuestions: readonly(sessionQuestions),
    currentQuestion,
    currentIndex,
    totalQuestions,
    canGoPrev,
    canGoNext,
    isCurrentRepeat,
    repeatQuestions,
    selectTopic,
    closeConstructor,
    toggleConstructorTopic,
    startConstructorMock,
    prevQuestion,
    nextQuestion,
    toggleCurrentRepeat,
    clearRepeatQuestions,
    exportRepeatPdf,
  }
}
