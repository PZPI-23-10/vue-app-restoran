  <template>
    <div class="profile-layout">
      <div class="profile-header">
        <div class="user-info">
          <h2>Привіт, {{ userName }}</h2>
        </div>
      </div>

      <div class="profile-content">
        <aside class="sidebar">
          <ul>
            <li><router-link to="/profile/info" active-class="active">Інфо акаунта</router-link></li>
            <li><router-link to="/profile/restaurants" active-class="active">Ресторани</router-link></li>
            <li v-if="hasModeration"><router-link to="/profile/moderation" active-class="active">Модерація</router-link></li>
          </ul>
        </aside>

        <section class="profile-details">
          <router-view />
        </section>
      </div>
    </div>
  </template>

  <script>
  import axios from 'axios'

  export default {
    name: 'ProfileLayout',
    data() {
      return {
        isAuthenticated: false,
        userName: '',
        restaurantsOwned: [],
        restaurantsModerating: []
      }
    },

    async mounted() {
      this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
      const userId = localStorage.getItem('userId')

      if (this.isAuthenticated && userId) {
        try {
          const response = await fetch('https://backend-restoran.onrender.com/api/Account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
          })

          const user = await response.json()

          this.userName = `${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`.trim()
          this.userEmail = user.email || ''
          this.restaurantsOwned = user.restaurantsOwned || []
          this.restaurantsModerating = user.restaurantsModerating || []
        } catch (error) {
          console.error('Помилка при завантаженні профілю:', error)
        }
      }
    },

    computed: {
      hasModeration() {
        return this.restaurantsModerating.length > 0
      }
    }
  }
  </script>

  <style scoped>
  .profile-layout {
    font-family: 'Segoe UI', sans-serif;
    padding: 32px 64px;
    background: #f9f9f9;
    box-sizing: border-box;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #d62d7e;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
  }

  .profile-content {
    display: flex;
    gap: 40px;
    max-width: 1400px;
    margin-left: 120px;
  }

  .profile-details {
    background: #fff;
    padding: 24px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    margin-left: 32px;
    width: 100%;
    max-width: 600px;
    box-sizing: border-box;
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-left: 120px;
    margin-bottom: 40px;
  }

  .sidebar {
    width: 240px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .sidebar-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 32px;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
  }

  .sidebar li {
    margin: 12px 0;
  }

  .sidebar a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
  }

  .sidebar a.active {
    font-weight: bold;
    color: #d62d7e;
  }

  .profile-details {
    flex: 1;
    background: #fff;
    padding: 24px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    margin-left: 32px;
  }

  .profile-body {
    display: flex;
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 80px;
  }

  .details {
    flex-grow: 1;
    background: white;
    padding: 32px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    min-width: 0;
  }
  </style>
