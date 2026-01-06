// Storage Keys

const STORAGE_KEYS = {
  MACHINES: 'farm_machines',
  BOOKINGS: 'farm_bookings',
  USERS: 'farm_users',
  CURRENT_USER: 'farm_current_user',
  MESSAGES: 'farm_messages'
};

// Default Machine Data

const defaultMachines = [
  {
    id: '1',
    name: 'PowerTrac 450',
    type: 'tractor',
    power: '45 HP',
    capacity: '2.5 ton lifting',
    image: '/images/modern_field_tractor.jpg',
    dailyRate: 400,
    availableDates: ['2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-10', '2026-01-11', '2026-01-12'],
    description: 'Versatile utility tractor perfect for plowing, tilling, and general farm work. Features power steering and comfortable cabin.'
  },
  {
    id: '2',
    name: 'Eicher 650',
    type: 'tractor',
    power: '65 HP',
    capacity: '4 ton lifting',
    image: '/images/heavy_duty_tractor.jpg',
    dailyRate: 500,
    availableDates: ['2026-01-06', '2026-01-08', '2026-01-10', '2026-01-12', '2026-01-14'],
    description: 'Heavy-duty tractor with enhanced horsepower for demanding agricultural tasks. Ideal for large-scale operations.'
  },
  {
    id: '3',
    name: 'HarvestMax 9000',
    type: 'harvester',
    power: '350 HP',
    capacity: '12,000 L grain tank',
    image: '/images/combine_harvester_pro.png',
    dailyRate: 1500,
    availableDates: ['2026-01-07', '2026-01-08', '2026-01-09', '2026-01-15', '2026-01-16'],
    description: 'State-of-the-art combine harvester with GPS guidance and automated grain handling. Maximum efficiency for harvest season.'
  },
  {
    id: '4',
    name: 'GrainPro 7500',
    type: 'harvester',
    power: '280 HP',
    capacity: '9,500 L grain tank',
    image: '/images/harvester.jpg',
    dailyRate: 1000,
    availableDates: ['2026-01-06', '2026-01-07', '2026-01-11', '2026-01-12', '2026-01-13'],
    description: 'Reliable combine harvester with excellent fuel efficiency. Perfect for medium to large farms.'
  },
  {
    id: '5',
    name: 'SeedMaster Pro',
    type: 'seeder',
    power: 'PTO driven',
    capacity: '24-row precision',
    image: '/images/filed_plowing_equipment.jpg',
    dailyRate: 300,
    availableDates: ['2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-10', '2026-01-11'],
    description: 'Precision seeder with variable rate technology. Ensures optimal seed placement and spacing for maximum yield.'
  },
  {
    id: '6',
    name: 'PlantPro 18',
    type: 'seeder',
    power: 'PTO driven',
    capacity: '18-row standard',
    image: '/images/specialized_seeder.jpeg',
    dailyRate: 200,
    availableDates: ['2026-01-08', '2026-01-09', '2026-01-10', '2026-01-14', '2026-01-15', '2026-01-16'],
    description: 'Economical seeder option for small to medium farms. Easy to operate and maintain.'
  }
];

// Utility Functions
function calculateHours(startTime, endTime) {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const start = startH + startM / 60;
  const end = endH + endM / 60;

  return Math.max(end - start, 0);
}



// SVG Icons

const icons = {
  tractor: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="17" cy="17" r="3"/><circle cx="7" cy="17" r="3"/><path d="M5 17H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h2"/><path d="M14 17H10"/><path d="M19 10V5a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v5"/><path d="M5 8h14"/><path d="m18 10 2 5"/></svg>`,
  harvester: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  seeder: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  gauge: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
  package: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  rupees: `<svg fill="#000000" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M18,7H15.79a5.49,5.49,0,0,0-1-2H18a1,1,0,0,0,0-2H7A1,1,0,0,0,7,5h3.5a3.5,3.5,0,0,1,3.15,2H7A1,1,0,0,0,7,9h7a3.5,3.5,0,0,1-3.45,3H7a.7.7,0,0,0-.14,0,.65.65,0,0,0-.2,0,.69.69,0,0,0-.19.1l-.12.07,0,0a.75.75,0,0,0-.14.17,1.1,1.1,0,0,0-.09.14.61.61,0,0,0,0,.18A.65.65,0,0,0,6,13s0,0,0,0a.7.7,0,0,0,0,.14.65.65,0,0,0,0,.2.69.69,0,0,0,.1.19s0,.08.07.12l6,7a1,1,0,0,0,1.52-1.3L9.18,14H10.5A5.5,5.5,0,0,0,16,9h2a1,1,0,0,0,0-2Z"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  login: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>`,
  logout: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  userPlus: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>`,
  dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  send: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
  lock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
};

// Storage Functions

// Get all machines from localStorage
function getMachines() {
  const stored = localStorage.getItem(STORAGE_KEYS.MACHINES);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(defaultMachines));
    return defaultMachines;
  }
  return JSON.parse(stored);
}

// Get all bookings from localStorage
function getBookings() {
  const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  return stored ? JSON.parse(stored) : [];
}

// Save a new booking to localStorage

function saveBooking(machineId, formData) {
  const machines = getMachines();
  const machine = machines.find(m => m.id === machineId);
  if (!machine) throw new Error('Machine not found');

  const hours = calculateHours(formData.startTime, formData.endTime);

  if (hours <= 0) {
    throw new Error('Invalid time selection');
  }

  const booking = {
    id: Date.now().toString(),
    machineId,
    machineName: machine.name,
    machineType: machine.type,
    farmerName: formData.farmerName,
    farmerEmail: formData.farmerEmail,
    farmerPhone: formData.farmerPhone,
    farmLocation: formData.farmLocation,
    bookingDate: formData.bookingDate,
    startTime: formData.startTime,
    endTime: formData.endTime,
    hours,
    ratePerHour: machine.dailyRate,
    totalCost: hours * machine.dailyRate,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

  return booking;
}


// Update booking status

function updateBookingStatus(bookingId, status) {
  const bookings = getBookings();
  const updatedBookings = bookings.map(b => 
    b.id === bookingId ? { ...b, status } : b
  );
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));
}

// Delete a booking and restore machine availability

function deleteBooking(bookingId) {
  const bookings = getBookings();
  const booking = bookings.find(b => b.id === bookingId);
  
  if (booking) {
    // Restore availability
    const machines = getMachines();
    const updatedMachines = machines.map(m => {
      if (m.id === booking.machineId) {
        return {
          ...m,
          availableDates: [...m.availableDates, booking.bookingDate].sort()
        };
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(updatedMachines));
  }
  
  const updatedBookings = bookings.filter(b => b.id !== bookingId);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings));
}

// Authentication Functions

// Check if user is logged in

function isLoggedIn() {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER) !== null;
}

// Get current logged in user

function getCurrentUser() {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
}

// Logout current user

function logout() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  showToast('Logged out successfully');
  setTimeout(() => window.location.href = '../homepage/index.html', 1000);
}

// Utility Functions

// Format date for display (short format)

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

// Format date for display (full format)

function formatFullDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Show toast notification

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    ${type === 'success' ? icons.check : icons.x}
    <span>${message}</span>
  `;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Initialize mobile menu functionality

function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      mobileMenuBtn.innerHTML = mobileNav.classList.contains('open') ? icons.close : icons.menu;
    });
  }
}

// Update navigation based on login status

function updateNavigation() {
  const user = getCurrentUser();
  const loginLinks = document.querySelectorAll('.nav-login-link');
  const logoutLinks = document.querySelectorAll('.nav-logout-link');
  const userNames = document.querySelectorAll('.nav-user-name');
  
  loginLinks.forEach(link => {
    link.style.display = user ? 'none' : 'flex';
  });
  
  logoutLinks.forEach(link => {
    link.style.display = user ? 'flex' : 'none';
  });
  
  userNames.forEach(el => {
    if (user) {
      el.textContent = user.firstName;
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  });
}

// Form Validation

// Validate email format

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number format

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// Validate password strength
function isValidPassword(password) {
  return password.length >= 6;
}

// Initialize mobile menu on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  updateNavigation();
});