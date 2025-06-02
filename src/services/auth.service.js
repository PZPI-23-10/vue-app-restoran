class AuthService {
  getCurrentUser() {
    return {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      email: localStorage.getItem('email')
    }
  }

  getAuthHeader() {
    const token = localStorage.getItem('token');
    if (token) {
      return { 'Authorization': 'Bearer ' + token };
    }
    return {};
  }
}

export default new AuthService();
