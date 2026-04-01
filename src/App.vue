<script setup lang="ts">
import { useQuizStore } from '@/app/store/quizStore'
import QuestionCardWidget from '@/widgets/question-card/ui/QuestionCardWidget.vue'
import ReviewPanelWidget from '@/widgets/review-panel/ui/ReviewPanelWidget.vue'
import TopicSelectorWidget from '@/widgets/topic-selector/ui/TopicSelectorWidget.vue'
import ListQuestionsWidget from '@/widgets/list-questions/ui/ListQuestionsWidget.vue'

const store = useQuizStore()
const {
  availableTopics,
  baseTopics,
  allQuestions,
  constructorTopics,
  isConstructorPanelOpen,
  canStartConstructorMock,
  currentTopicTitle,
  selectedTopic,
  currentQuestion,
  currentIndex,
  totalQuestions,
  canGoPrev,
  canGoNext,
  isCurrentRepeat,
  repeatQuestions,
} = store
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>МОКнуть можно каждого ✔</h1>
      <p>Выберите тему, отвечайте на вопросы и сохраняйте то, что нужно повторить.</p>
    </header>

    <main class="app-main">
      <TopicSelectorWidget
        :topics="availableTopics"
        :base-topics="baseTopics"
        :constructor-topics="constructorTopics"
        :is-constructor-panel-open="isConstructorPanelOpen"
        :can-start-constructor-mock="canStartConstructorMock"
        :selected-topic="selectedTopic"
        @select-topic="store.selectTopic"
        @close-constructor="store.closeConstructor"
        @toggle-constructor-topic="store.toggleConstructorTopic"
        @start-constructor-mock="store.startConstructorMock"
      />

      <QuestionCardWidget
        :topic-title="currentTopicTitle"
        :current-question="currentQuestion"
        :current-index="currentIndex"
        :total-questions="totalQuestions"
        :can-go-prev="canGoPrev"
        :can-go-next="canGoNext"
        :is-current-repeat="isCurrentRepeat"
        @prev="store.prevQuestion"
        @next="store.nextQuestion"
        @toggle-repeat="store.toggleCurrentRepeat"
      />

      <ReviewPanelWidget
        :repeat-questions="repeatQuestions"
        @export-pdf="store.exportRepeatPdf"
        @clear-repeat="store.clearRepeatQuestions"
      />

      <ListQuestionsWidget :topics="baseTopics" :all-questions="allQuestions" />
    </main>
  </div>
</template>
