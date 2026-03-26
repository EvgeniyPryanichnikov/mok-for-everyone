<script setup lang="ts">
import type { Question, QuestionLevel } from '@/entities/question/model/types'

defineProps<{
  repeatQuestions: Question[]
}>()

const emit = defineEmits<{
  exportPdf: []
  clearRepeat: []
}>()

const levelLabels: Record<QuestionLevel, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}
</script>

<template>
  <section class="panel">
    <h2 class="panel-title">Вопросы для повторения</h2>
    <p v-if="repeatQuestions.length === 0" class="muted">Пока нет отмеченных вопросов.</p>

    <div v-else class="repeat-list">
      <article v-for="question in repeatQuestions" :key="question.id" class="repeat-item">
        <div class="repeat-meta-row">
          <p class="muted">{{ question.topic.toUpperCase() }}</p>
          <span v-if="question.level" class="level-badge" :class="`level-${question.level}`">
            {{ levelLabels[question.level] }}
          </span>
        </div>
        <p><strong>{{ question.question }}</strong></p>
      </article>
    </div>

    <div class="toolbar" style="margin-top: 0.8rem">
      <button class="btn btn-outline" :disabled="repeatQuestions.length === 0" @click="emit('exportPdf')">
        Скачать PDF
      </button>
      <button class="btn btn-secondary" :disabled="repeatQuestions.length === 0" @click="emit('clearRepeat')">
        Очистить список
      </button>
    </div>
  </section>
</template>
