<template>
  <div class="filter-buttons-container">
    <div
      class="slider-wrapper"
      ref="scrollContainer"
      @wheel="handleWheel"
    >
      <button
        v-for="(tag, index) in tags"
        :key="tag.id"
        :class="['filter-btn', { selected: selectedTags.includes(tag.name) }]"
        @click="selectTag(tag.name)"
      >
        {{ tag.name }}
      </button>
    </div>

    <div class="bottom-line"></div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'FilterButtons',
  props: ['onTagsChange'],
  data() {
    return {
      tags: [],
      selectedTags: []
    }
  },
  mounted() {
    this.loadTags()
  },
  methods: {
    async loadTags() {
      try {
        const response = await axios.get('https://backend-restoran.onrender.com/api/tag')
        let tagsData = response.data.tags
        this.tags = tagsData.sort(() => Math.random() - 0.5)
      } catch (error) {
        console.error('Помилка при завантаженні тегів:', error)
      }
    },
    selectTag(tag) {
      if (this.selectedTags.includes(tag)) {
        this.selectedTags = this.selectedTags.filter(t => t !== tag)
      } else {
        this.selectedTags.push(tag)
      }
      this.onTagsChange(this.selectedTags)
    },
    handleWheel(event) {
      const container = this.$refs.scrollContainer
      container.scrollLeft += event.deltaY
    }
  }
}
</script>

<style scoped>
.filter-buttons-container {
  width: 100%;
  margin-top: 20px;
  box-sizing: border-box;
  position: relative;
}

.slider-wrapper {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px 20px;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
}

.slider-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.filter-btn {
  border: 1px solid black;
  border-radius: 12px;
  padding: 8px 16px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.filter-btn.selected {
  border: 1.5px solid #f55;
  color: #f55;
}

.bottom-line {
  width: 100%;
  height: 1px;
  background-color: black;
  margin-top: 10px;
}
</style>
