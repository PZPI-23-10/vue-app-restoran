<template>
  <MainFormRestaurant :restaurant="restaurant" />
</template>

<script setup>
import { defineProps } from 'vue'
import { ref } from 'vue'
import MainFormRestaurant from '../components/MainFormRestaurant.vue'

const props = defineProps({ id: String })

const restaurantData = [
  {
    id: 1,
    name: 'Пузата Хата',
    rating: 4,
    image: 'https://img.hotels24.ua/photos/r3/570x400/7382/138485.jpg', // или локально
    description: '«Пузата Хата» — це місце, де українська кухня оживає в кожній страві...',
    type: 'Українська',
    tags: ['Домашня', 'традиційна їжа', 'швидко', 'для всіх']
  }
]

const restaurant = ref(restaurantData.find(r => r.id === parseInt(props.id)))
</script>
