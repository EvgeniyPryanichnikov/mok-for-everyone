<script setup lang="ts">
import { computed, ref } from 'vue'

import type { Topic } from '@/entities/question/model/types'

type ListQuestion = {
  id: string
  topic: Topic
  question: string
}

const props = defineProps<{
  topics: readonly Topic[]
  allQuestions: readonly ListQuestion[]
}>()

const topicLabels: Record<Topic, string> = {
  vue: 'Vue',
  nuxt: 'Nuxt',
  legend: 'Легенда',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  browser_networks: 'Браузер и сети',
}

const activeTopic = ref<Topic | null>(props.topics[0] ?? null)
const isOpen = ref(false)

const groupedByTopic = computed(() => {
  const map = new Map<Topic, ListQuestion[]>()
  for (const topic of props.topics) {
    map.set(topic, [])
  }

  for (const question of props.allQuestions) {
    if (!map.has(question.topic)) continue
    map.get(question.topic)!.push(question)
  }

  return map
})

const activeQuestions = computed(() => {
  if (!activeTopic.value) return []
  return groupedByTopic.value.get(activeTopic.value) ?? []
})

function selectTopic(topic: Topic): void {
  activeTopic.value = topic
}

function toggleOpen(): void {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <section class="panel">
    <div class="list-panel-header" @click="toggleOpen">
      <h2 class="panel-title list-panel-title">
        Вопросы списками
      </h2>
      <button
        class="btn list-panel-toggle"
        type="button"
        @click.stop="toggleOpen"
      >
        {{ isOpen ? 'Свернуть' : 'Развернуть' }}
      </button>
    </div>

    <Transition name="list-panel">
      <div v-if="isOpen">
        <div class="list-tabs-row">
          <button
            v-for="topic in topics"
            :key="topic"
            class="btn chip list-tab-chip"
            :class="{
              active: activeTopic === topic,
              'vue-chip': topic === 'vue',
              'nuxt-chip': topic === 'nuxt',
              'legend-chip': topic === 'legend',
              'javascript-chip': topic === 'javascript',
              'typescript-chip': topic === 'typescript',
              'browser-networks-chip': topic === 'browser_networks',
            }"
            type="button"
            @click="selectTopic(topic)"
          >
            {{ topicLabels[topic] }}
          </button>
        </div>

        <div v-if="activeTopic" class="list-questions-wrap">
          <div class="list-questions-header">
            <h3 class="list-questions-title">
              Все вопросы по теме:
              <span class="panel-title-topic" :class="`panel-title-topic-${activeTopic}`">
                {{ topicLabels[activeTopic] }}
              </span>
            </h3>
            <p class="muted list-questions-count">
              {{ activeQuestions.length }} {{ activeQuestions.length === 1 ? 'вопрос' : 'вопросов' }}
            </p>
          </div>

          <ol class="list-questions">
            <li v-for="question in activeQuestions" :key="question.id" class="list-question-item">
              <span class="list-question-index"></span>
              <div class="list-question-content">
                <p class="list-question-text">
                  {{ question.question }}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </Transition>
  </section>
</template>

