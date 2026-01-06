document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in
  if (isLoggedIn()) {
    window.location.href = '../dashboard/dashboard.html';
    return;
  }
  
  // Login form handler
  const loginForm = document.getElementById('login-form');
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Validate email format
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // Validate password
    if (!password) {
      showToast('Please enter your password', 'error');
      return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    // Find user by email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store current user session
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      
      showToast('Login successful! Welcome back, ' + user.firstName);
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = '../dashboard/dashboard.html';
      }, 1000);
    } else {
      showToast('Invalid email or password. Please try again.', 'error');
    }
  });
});