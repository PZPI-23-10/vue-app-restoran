<template>
  <div class="reviews-section">
    <h2>Відгуки</h2>
    <div v-if="reviews.length > 0">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div class="review-header">
          <span class="avatar">👤</span>
          <div class="review-info">
            <div class="review-author">{{ review.userId }}</div>
            <div class="review-rating">{{ getStars(review.rating ?? 5) }}</div>
          </div>
        </div>
        <div class="review-text">{{ review.comment }}</div>
      </div>
    </div>
    <div v-else class="no-reviews">Немає відгуків</div>
  </div>
</template>

<script setup>
const props = defineProps({
  reviews: Array
})

function getStars(rating) {
  const full = '★'.repeat(Math.floor(rating))
  const empty = '☆'.repeat(5 - Math.floor(rating))
  return full + empty
}
</script>

<style scoped>
.reviews-section {
  padding: 20px;
}
.review-card {
  border-left: 5px solid #00bcd4;
  padding: 10px 20px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.review-header {
  display: flex;
  align-items: center;
  gap: 15px;
}
.avatar {
  font-size: 30px;
}
.review-info {
  display: flex;
  flex-direction: column;
}
.review-author {
  font-weight: bold;
  font-size: 16px;
}
.review-rating {
  font-size: 18px;
  color: #ffc107;
}
.review-text {
  font-size: 15px;
  color: #333;
}
.no-reviews {
  font-size: 16px;
  color: #777;
  margin-top: 10px;
  padding: 10px;
  background: #f3f3f3;
  border-radius: 8px;
}
</style>
