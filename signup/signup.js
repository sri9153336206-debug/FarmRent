document.addEventListener('DOMContentLoaded', () => {
  // Check if already logged in
  if (isLoggedIn()) {
    window.location.href = '../dashboard/dashboard.html';
    return;
  }
  
  // Signup form handler
  const signupForm = document.getElementById('signup-form');
  
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('signup-firstname').value.trim();
    const lastName = document.getElementById('signup-lastname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const terms = document.getElementById('terms').checked;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !password || !confirm) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // Validate password length
    if (!isValidPassword(password)) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    
    // Check password confirmation
    if (password !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    
    // Check terms agreement
    if (!terms) {
      showToast('Please agree to the Terms of Service', 'error');
      return;
    }
    
    // Get existing users or create empty array
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      showToast('An account with this email already exists', 'error');
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      phone,
      password,
      createdAt: new Date().toISOString()
    };
    
    // Save user to localStorage
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    showToast('Account created successfully! Please login.');
    
    // Redirect to login page after short delay
    setTimeout(() => {
      window.location.href = '../login/login.html';
    }, 1500);
  });
});