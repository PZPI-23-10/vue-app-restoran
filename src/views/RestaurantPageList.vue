<template>
  <div class="restaurant-page-content">
    <FilterButtons :onTagsChange="handleTagsChange" />

    <div class="restaurant-page-container">
      <div class="restaurant-list"><RestaurantList :restaurants="filteredRestaurants" />

      </div>

      <div class="restaurant-map">
        <RestaurantMap
          :selectedCity="currentCity"
          @restaurantsVisible="handleVisibleRestaurants"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FilterButtons from '../components/FilterButtons.vue'
import RestaurantList from '../components/RestaurantList.vue'
import RestaurantMap from '../components/RestaurantMap.vue'

export default {
  name: 'RestaurantPageList',
  props: {
    city: {
      type: String,
      default: 'Київ'
    }
  },
  components: {
    FilterButtons,
    RestaurantList,
    RestaurantMap
  },
  data() {
    return {
      visibleRestaurants: [],
      selectedTags: []  // выбранные теги
    }
  },
  computed: {
    currentCity() {
      return this.city || 'Київ'
    },
    filteredRestaurants() {
      if (this.selectedTags.length === 0) {
        return this.visibleRestaurants
      }

      return this.visibleRestaurants.filter(restaurant => {
        const restaurantTags = restaurant.tags.map(t => t.tag?.name)
        return this.selectedTags.every(tag => restaurantTags.includes(tag))
      })
    }
  },
  methods: {
    handleVisibleRestaurants(restaurants) {
      this.visibleRestaurants = restaurants
    },
    handleTagsChange(tags) {
      this.selectedTags = tags
    }
  }
}
</script>

<style scoped>
.restaurant-page-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: calc(100vh - 100px);
  overflow: hidden;
}

.filter-buttons {
  width: 100%;
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}

.restaurant-page-container {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.restaurant-list {
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  overflow-y: auto;
  max-height: calc(100% - 40px);
}

.restaurant-map {
  flex: 1.5;
  min-width: 400px;
  background-color: #e0e0e0;
  padding: 20px;
  border-radius: 8px;
  height: 100%;
}

@media (max-width: 768px) {
  .restaurant-page-container {
    flex-direction: column;
  }

  .restaurant-list,
  .restaurant-map {
    min-width: 100%;
  }
}
</style>
