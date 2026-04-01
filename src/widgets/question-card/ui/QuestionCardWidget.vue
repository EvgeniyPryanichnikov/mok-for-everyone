<script setup lang="ts">
import { ref, watch } from 'vue'

import type { Question, QuestionLevel } from '@/entities/question/model/types'

const props = defineProps<{
  topicTitle: string
  currentQuestion: Question | null
  currentIndex: number
  totalQuestions: number
  canGoPrev: boolean
  canGoNext: boolean
  isCurrentRepeat: boolean
}>()

const emit = defineEmits<{
  prev: []
  next: []
  toggleRepeat: []
}>()

const levelLabels: Record<QuestionLevel, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const isAnswerVisible = ref(false)

watch(
  () => props.currentQuestion?.id,
  () => {
    isAnswerVisible.value = false
  },
)
</script>

<template>
  <section class="panel">
    <h2 class="panel-title">
      Вопросы по теме:
      <span
        class="panel-title-topic"
        :class="currentQuestion ? `panel-title-topic-${currentQuestion.topic}` : ''"
      >
        {{ topicTitle }}
      </span>
    </h2>

    <div v-if="currentQuestion">
      <div class="question-meta-row">
        <p class="muted">Вопрос {{ currentIndex + 1 }} из {{ totalQuestions }}</p>
        <span v-if="currentQuestion.level" class="level-badge" :class="`level-${currentQuestion.level}`">
          {{ levelLabels[currentQuestion.level] }}
        </span>
      </div>
      <p class="question-text">{{ currentQuestion.question }}</p>
      <button class="btn btn-answer-toggle" @click="isAnswerVisible = !isAnswerVisible">
        {{ isAnswerVisible ? 'Скрыть ответ' : 'Показать ответ' }}
      </button>
      <div v-if="isAnswerVisible" class="answer-wrap">
        <div v-if="currentQuestion.topic !== 'legend'" class="ai-note">
          <span class="ai-note-icon">!</span>
          <span class="ai-note-text">Ответ сгенерирован ИИ</span>
        </div>
        <p class="answer-text"><strong>Ответ:</strong> {{ currentQuestion.answer }}</p>
      </div>

      <div class="toolbar">
        <button class="btn btn-secondary" :disabled="!canGoPrev" @click="emit('prev')">Назад</button>
        <button class="btn btn-next-vue" :disabled="!canGoNext" @click="emit('next')">Вперед</button>
        <button
          class="btn repeat-action"
          :class="isCurrentRepeat ? 'btn-danger' : 'btn-repeat-soft'"
          @click="emit('toggleRepeat')"
        >
          <span class="repeat-label-desktop">
            {{ isCurrentRepeat ? 'Убрать из повторения' : 'Необходимо повторить' }}
          </span>
          <span class="repeat-label-mobile">
            {{ isCurrentRepeat ? 'Убрать' : 'В повтор' }}
          </span>
        </button>
      </div>
    </div>

    <p v-else class="muted">Выберите тему, чтобы начать.</p>
  </section>
</template>
