<template>
  <ProfileLayout />
</template>

<script>
import ProfileLayout from '../components/ProfileLayout.vue'

export default {
  name: 'ProfilePage',
  components: { ProfileLayout }
}
</script>


<style scoped>
.profile-page {
  padding: 32px;
  font-family: 'Segoe UI', sans-serif;
  background: #f8f8f8;
  min-height: 100vh;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.avatar {
  background-color: #d62d7e;
  color: white;
  width: 72px;
  height: 72px;
  font-size: 28px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info h2 {
  margin: 0;
  font-size: 24px;
}

.user-info p {
  color: #666;
  margin-top: 4px;
}

.profile-body {
  display: flex;
  gap: 40px;
}

.sidebar {
  width: 220px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 16px;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.sidebar a:hover {
  color: #d62d7e;
}

.details {
  flex-grow: 1;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.details p {
  margin: 12px 0;
}

.not-authenticated {
  color: red;
  font-weight: bold;
}
</style>
