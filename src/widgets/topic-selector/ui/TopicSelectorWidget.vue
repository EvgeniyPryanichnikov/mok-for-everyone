<script setup lang="ts">
import type { Topic, TopicFilter } from '@/entities/question/model/types'

defineProps<{
  topics: TopicFilter[]
  baseTopics: readonly Topic[]
  constructorTopics: Topic[]
  isConstructorPanelOpen: boolean
  canStartConstructorMock: boolean
  selectedTopic: TopicFilter | null
}>()

const emit = defineEmits<{
  selectTopic: [topic: TopicFilter]
  closeConstructor: []
  toggleConstructorTopic: [topic: Topic]
  startConstructorMock: []
}>()

const topicLabels: Record<TopicFilter, string> = {
  vue: 'Vue',
  nuxt: 'Nuxt',
  legend: 'Легенда',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  // react: 'React',
  browser_networks: 'Браузер и сети',
  CONSTRUCTOR: 'Конструктор Мока',
}
</script>

<template>
  <section class="panel">
    <h2 class="panel-title">Выбор темы</h2>
    <div class="chip-row">
      <button
        v-for="topic in topics"
        :key="topic"
        class="btn chip"
        :class="{
          active: selectedTopic === topic,
          'vue-chip': topic === 'vue',
          'nuxt-chip': topic === 'nuxt',
          'legend-chip': topic === 'legend',
          'javascript-chip': topic === 'javascript',
          'typescript-chip': topic === 'typescript',
          'constructor-chip': topic === 'CONSTRUCTOR',
          // 'react-chip': topic === 'react',
          'browser-networks-chip': topic === 'browser_networks',
        }"
        @click="emit('selectTopic', topic)"
      >
        {{ topicLabels[topic] }}
      </button>
    </div>

    <Transition name="constructor-panel">
      <div v-if="selectedTopic === 'CONSTRUCTOR' && isConstructorPanelOpen" class="constructor-box">
        <button class="constructor-close" @click="emit('closeConstructor')">×</button>
        <p class="muted constructor-caption">Выберите темы для микса:</p>
        <div class="chip-row">
          <button
            v-for="topic in baseTopics"
            :key="topic"
            class="btn chip"
              :class="{
                active: constructorTopics.includes(topic),
                'vue-chip': topic === 'vue',
                'nuxt-chip': topic === 'nuxt',
                'legend-chip': topic === 'legend',
                'javascript-chip': topic === 'javascript',
                'typescript-chip': topic === 'typescript',
                // 'react-chip': topic === 'react',
                'browser-networks-chip': topic === 'browser_networks',
              }"
            @click="emit('toggleConstructorTopic', topic)"
          >
            {{ topicLabels[topic] }}
            <span
              v-if="constructorTopics.includes(topic)"
              class="constructor-topic-remove"
              @click.stop="emit('toggleConstructorTopic', topic)"
            >
              ×
            </span>
          </button>
        </div>
        <button class="btn btn-primary constructor-start" :disabled="!canStartConstructorMock" @click="emit('startConstructorMock')">
          Собрать микс
        </button>
      </div>
    </Transition>
  </section>
</template>
