<template>
  <div class="profile-restaurants">
    <div class="header">
      <h2>Мої ресторани</h2>
      <button @click="openCreateModal" class="create-btn">Створити ресторан</button>
    </div>

    <div v-if="restaurants.length === 0" class="no-restaurants">
      <p>Немає жодних ресторанів</p>
    </div>

    <div v-else class="restaurants-list">
      <div 
        v-for="restaurant in restaurants" 
        :key="restaurant.id" 
        class="restaurant-item"
        :class="{ moderator: restaurant.role === 'moderator' }"
      >
        <div class="restaurant-info">
          <img 
            v-if="restaurant.photos && restaurant.photos.length > 0" 
            :src="restaurant.photos[0]" 
            @error="handleImageError"
            alt="Фото ресторану" 
            class="restaurant-photo"
          />
          <div v-else class="no-photo">
            🍽️
          </div>
          <div class="restaurant-text">
            <h3>{{ restaurant.name }}</h3>
            <p v-if="restaurant.organization">{{ restaurant.organization }}</p>
            <div class="tags">
              <span v-for="tag in restaurant.tags || []" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
        <div class="restaurant-actions">
          <button @click="loadRestaurantDetails(restaurant.id)">Редагувати</button>
          <button 
            v-if="restaurant.role === 'owner'" 
            @click="deleteRestaurant(restaurant.id)"
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
    
    <RestaurantEdit 
      v-if="isEditMode" 
      :restaurant="restaurantToEdit" 
      @close="closeEdit"
      @save="editRestaurant"
    />

    <RestaurantInitModal
      :visible="showCreateModal"
      @close="showCreateModal = false"
      @created="handleRestaurantCreated"
    />
  </div>
</template>

<script>
import axios from 'axios'
import RestaurantInitModal from './RestaurantInitModal.vue'
import RestaurantCreate from '../views/RestaurantCreate.vue'
import RestaurantEdit from './RestaurantEdit.vue'

export default {
  name: 'ProfileRestaurants',
  components: { RestaurantInitModal, RestaurantCreate, RestaurantEdit },
  data() {
    return {
    restaurants: [],
    ownedRestaurants: [],
    moderatedRestaurants: [],
    isEditMode: false,
    showCreateModal: false,
    restaurantToEdit: null,
    }
  },
  methods: {
    openCreateModal() {
      this.showCreateModal = true
    },
    handleImageError(event) {
      event.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23f0f0f0"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40">🍽️</text></svg>';
    },

    async loadRestaurantDetails(restaurantId) {
          try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://backend-restoran.onrender.com/api/Restaurant/Get', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ RestaurantId: restaurantId })
            });

            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(`Ошибка сервера: ${res.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await res.json();
            console.log('Ответ сервера:', data);
            this.restaurantToEdit = data;
            this.isEditMode = true;
          } catch (error) {
            console.error('Не вдалося завантажити дані ресторану:', error);
          }
      },

    isOwner(restaurant) {
        const userId = localStorage.getItem('userId');
        return restaurant.ownerId === userId;
    },

    isModerator(restaurant) {
        const email = localStorage.getItem('email');
        return (restaurant.moderatorEmails || []).includes(email);
    },

  async editRestaurant(restaurant) {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'https://backend-restoran.onrender.com/api/Restaurant/Editing',
        {
          RestaurantId: restaurant.id,
          Name: restaurant.name,
          City: restaurant.city,
          Region: restaurant.region,
          Street: restaurant.street,
          Description: restaurant.description,
          Tags: restaurant.tags,
          Cuisine: restaurant.cuisine,
          PhotoUrl: restaurant.photoUrl,
          Email: restaurant.email,
          Layout: restaurant.layout,
          Schedule: restaurant.schedule,
          Dishes: restaurant.dishes,
          Organization: restaurant.organization,
          ModeratorEmails: restaurant.moderatorEmails
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Успешно обновлено:', response.data);
      // тут можно закрыть форму редактирования или обновить список ресторанов

    } catch (error) {
      console.error('Ошибка при сохранении данных ресторана:', error);
      console.error('Ответ от сервера:', error.response?.data);
    }
  },
    
    handleRestaurantCreated(newRestaurant) {
      this.restaurants.push(newRestaurant)
    },

    async deleteRestaurant(restaurantId) {
        try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Токен не знайдено')
        if (!restaurantId) throw new Error('ID ресторану не знайдено')

        await axios.request({
            method: 'DELETE',
            url: 'https://backend-restoran.onrender.com/api/Restaurant',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
            },
            data: { RestaurantId: restaurantId } // с большой буквы!
        })

        this.restaurants = this.restaurants.filter(r => r.id !== restaurantId)
        alert('Ресторан успішно видалено')

        } catch (error) {
        console.error('Помилка видалення:', error)
        alert('Помилка видалення: ' + (error.response?.data?.title || error.message))
        }
    },

    closeEdit() {
      this.isEditMode = false;
      this.selectedRestaurantId = null;
    },
  },
  async mounted() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.warn('userId отсутствует в localStorage');
    return;
  }

  try {
    const response = await axios.post(
      'https://backend-restoran.onrender.com/api/Account',
      { userId },
      { headers: { 'Content-Type': 'application/json' } }
    );

    this.restaurants = (response.data.restaurantsOwned || []).map(restaurant => ({
      ...restaurant,
      role: 'owner',
      photoUrl: restaurant.photoUrl || 'https://via.placeholder.com/150?text=No+Image'
    }));

  } catch (error) {
    console.error('Ошибка при загрузке ресторанов:', error);
  }
}
}
</script>

<style scoped>
.restaurant-item.moderator {
  border-left: 4px solid #4caf50; /* зелёная полоса */
}
.moderator-section h3 {
  margin-top: 24px;
  font-size: 20px;
  color: #4caf50;
}

.profile-restaurants {
  max-width: 1000px; /* увеличили ширину */
  margin: 0 auto;
  padding: 20px 30px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #fafafa;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap; /* чтобы кнопка не уходила с экрана */
  gap: 15px;
}

h2 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.create-btn {
  padding: 12px 24px;
  background: linear-gradient(45deg, #ff6f00, #d84315); /* градиент оранжево-красный */
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.create-btn:hover {
  background: linear-gradient(45deg, #d84315, #b71c1c);
}

.no-restaurants {
  text-align: center;
  margin-top: 60px;
  font-size: 1.3rem;
  color: #777;
}

.restaurants-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.restaurant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgb(0 0 0 / 0.12);
  transition: box-shadow 0.3s ease;
  flex-wrap: wrap;
}

.restaurant-item:hover {
  box-shadow: 0 5px 15px rgb(0 0 0 / 0.2);
}

.restaurant-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1 1 60%;
  min-width: 280px;
}

.restaurant-photo {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: contain; /* показываем полностью, без обрезки */
  background: #eee;
  padding: 6px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
}
.no-photo {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.restaurant-text {
  display: flex;
  flex-direction: column;
}

.restaurant-text h3 {
  margin: 0 0 6px 0;
  font-weight: 700;
  font-size: 1.4rem;
  color: #222;
}

.restaurant-organization {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #666;
  font-style: italic;
}

.tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  background-color: #ffe0b2; /* светло-оранжевый */
  color: #bf360c; /* темно-красный */
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  user-select: none;
}

.restaurant-actions {
  display: flex;
  gap: 12px;
  flex: 1 1 35%;
  justify-content: flex-end;
  min-width: 220px;
  flex-wrap: wrap;
}

.restaurant-actions button {
  background: linear-gradient(45deg, #d84315, #ff6f00);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
  min-width: 110px;
  white-space: nowrap;
}

.restaurant-actions button:hover {
  background: linear-gradient(45deg, #b71c1c, #d84315);
}

.edit-btn {
  background: linear-gradient(45deg, #f57c00, #ef6c00);
}

.edit-btn:hover {
  background: linear-gradient(45deg, #e65100, #bf360c);
}

.delete-btn {
  background: linear-gradient(45deg, #d84315, #b71c1c);
}

.delete-btn:hover {
  background: linear-gradient(45deg, #b71c1c, #7f0000);
}

/* Адаптив */

@media (max-width: 900px) {
  .profile-restaurants {
    padding: 20px 15px;
    max-width: 95vw;
  }
  
  .restaurant-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .restaurant-info {
    flex: none;
    width: 100%;
    margin-bottom: 12px;
  }
  
  .restaurant-actions {
    width: 100%;
    justify-content: flex-start;
    gap: 10px;
  }
  
  .restaurant-actions button {
    min-width: 45%;
  }
}

@media (max-width: 500px) {
  .restaurant-photo {
    width: 80px;
    height: 80px;
  }

  .restaurant-actions button {
    min-width: 100%;
  }
}
</style>