// State Variables

let currentFilter = 'all';
let selectedMachine = null;

// Machine Rendering Functions


// Render machines grid based on current filter
 
function renderMachines() {
  const machines = getMachines();
  const grid = document.getElementById('machines-grid');
  
  // Filter machines based on current filter
  const filtered = currentFilter === 'all' 
    ? machines 
    : machines.filter(m => m.type === currentFilter);
  
  // Show empty state if no machines
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        ${icons.tractor}
        <p>No machines available in this category</p>
      </div>
    `;
    return;
  }
  
  // Render machine cards

  grid.innerHTML = filtered.map((machine, index) => {
    const hasAvailability = machine.availableDates.length > 0;
    const typeLabels = { tractor: 'Tractor', harvester: 'Harvester', seeder: 'Seeder' };
    
    return `
      <div class="card" style="animation-delay: ${index * 100}ms">
        <div class="card-image">
          <img src="${machine.image}" alt="${machine.name}" loading="lazy">
          <div class="card-badges">
            <span class="badge badge-primary">${typeLabels[machine.type]}</span>
            <span class="badge ${hasAvailability ? 'badge-confirmed' : 'badge-pending'}">
              ${hasAvailability ? `${machine.availableDates.length} dates` : 'Unavailable'}
            </span>
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${machine.name}</h3>
          <p class="card-description">${machine.description}</p>
          <div class="card-specs">
            <div class="card-spec">${icons.gauge}<span>${machine.power}</span></div>
            <div class="card-spec">${icons.package}<span>${machine.capacity}</span></div>
          </div>
        </div>
        <div class="card-footer">
          <div class="card-price">
            <span class="currency-symbol">₹</span>
            <span class="amount">${machine.dailyRate}</span>
            <span class="period">/hour</span>
          </div>
          ${!isAdmin() ? `
          <button class="btn btn-accent book-btn" ${!hasAvailability ? 'disabled' : ''}
                  onclick="handleBookClick('${machine.id}')">
            ${icons.calendar} Book Now
          </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Update machine counts in filter buttons

function updateFilterCounts() {
  const machines = getMachines();
  const counts = {
    all: machines.length,
    tractor: machines.filter(m => m.type === 'tractor').length,
    harvester: machines.filter(m => m.type === 'harvester').length,
    seeder: machines.filter(m => m.type === 'seeder').length
  };
  
  document.querySelectorAll('.filter-btn .count').forEach(el => {
    const type = el.closest('.filter-btn').dataset.filter;
    el.textContent = counts[type];
  });
}

// Booking Functions

// Handle book button click - check login status first

function handleBookClick(machineId) {
  // Check if user is logged in
  if (!isLoggedIn()) {
    showLoginAlert();
    return;
  }
  
  // Open booking modal
  openBookingModal(machineId);
}

// Show login required alert


function showLoginAlert() {
  // Create alert if it doesn't exist
  let alert = document.getElementById('login-alert');
  if (!alert) {
    alert = document.createElement('div');
    alert.id = 'login-alert';
    alert.className = 'login-alert';
    alert.innerHTML = `
      <div class="login-alert-content">
        <div class="login-alert-icon">
          ${icons.lock}
        </div>
        <h3 class="login-alert-title">Login Required</h3>
        <p class="login-alert-text">Please login to book a machine. Create an account or sign in to continue.</p>
        <div class="login-alert-buttons">
          <button class="btn btn-outline" onclick="closeLoginAlert()">Cancel</button>
          <a href="../login/login.html" class="btn btn-accent">Login</a>
        </div>
      </div>
    `;
    document.body.appendChild(alert);
  }
  
  alert.classList.add('open');
}

// Close login alert

function closeLoginAlert() {
  const alert = document.getElementById('login-alert');
  if (alert) {
    alert.classList.remove('open');
  }
}

// Open booking modal for a specific machine

function openBookingModal(machineId) {
  const machines = getMachines();
  selectedMachine = machines.find(m => m.id === machineId);
  if (!selectedMachine) return;
  
  const modal = document.getElementById('booking-modal');
  const preview = document.getElementById('machine-preview');
  const dateSelect = document.getElementById('booking-date');
  
  // Populate machine preview
  preview.innerHTML = `
    <img src="${selectedMachine.image}" alt="${selectedMachine.name}">
    <div class="machine-preview-info">
      <h4>${selectedMachine.name}</h4>
      <p>${selectedMachine.power} • ${selectedMachine.capacity}</p>
      <div class="machine-preview-price">
        <span class="currency-symbol">₹</span>
        <span class="amount">${selectedMachine.dailyRate}</span>
        <span class="period">/hour</span>
      </div>
    </div>
  `;
  
  // Populate available dates
  dateSelect.innerHTML = '<option value="">Choose an available date</option>' +
    selectedMachine.availableDates.map(d => 
      `<option value="${d}">${formatDate(d)}</option>`
    ).join('');
  
  // Pre-fill user data if logged in
  const user = getCurrentUser();
  if (user) {
    document.getElementById('farmer-name').value = `${user.firstName} ${user.lastName}`;
    document.getElementById('farmer-email').value = user.email;
    document.getElementById('farmer-phone').value = user.phone || '';
  }
  
  modal.classList.add('open');
}

// Close booking modal

function closeBookingModal() {
  document.getElementById('booking-modal').classList.remove('open');
  document.getElementById('booking-form').reset();
  selectedMachine = null;
}

// Scroll to machines section

function scrollToMachines() {
  document.getElementById('machines-section').scrollIntoView({ behavior: 'smooth' });
}

// Event Listeners

document.addEventListener('DOMContentLoaded', () => {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Update button states
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-outline');
      });
      btn.classList.remove('btn-outline');
      btn.classList.add('active', 'btn-primary');
      
      // Update filter and re-render
      currentFilter = btn.dataset.filter;
      renderMachines();
    });
  });
  
  // Close modal on backdrop click
  document.getElementById('booking-modal').addEventListener('click', (e) => {
    if (e.target.id === 'booking-modal') {
      closeBookingModal();
    }
  });
  
  // Booking form submission
  document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!selectedMachine) return;
    
    // Collect form data
    const formData = {
      farmerName: document.getElementById('farmer-name').value.trim(),
      farmerEmail: document.getElementById('farmer-email').value.trim(),
      farmerPhone: document.getElementById('farmer-phone').value.trim(),
      farmLocation: document.getElementById('farm-location').value.trim(),
      bookingDate: document.getElementById('booking-date').value,
      startTime: document.getElementById('start-time').value,
      endTime: document.getElementById('end-time').value
    };
    
    // Validate date selection
    if (!formData.bookingDate) {
      showToast('Please select a date', 'error');
      return;
    }
    
    // Validate form fields
    if (!formData.farmerName || !formData.farmerEmail || !formData.farmerPhone || !formData.farmLocation) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    // Validate email
    if (!isValidEmail(formData.farmerEmail)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    try {
      // Save booking
      saveBooking(selectedMachine.id, formData);
      showToast('Booking submitted successfully!');
      closeBookingModal();
      renderMachines();
      updateFilterCounts();
    } catch (error) {
      showToast('Failed to submit booking', 'error');
      console.error('Booking error:', error);
    }
  });
  
  // Initial render
  renderMachines();
  updateFilterCounts();
   // Apply role-based UI
  applyRoleBasedUI();
});

// Apply role-based UI rendering
// Hides booking elements for admin users

function applyRoleBasedUI() {
  const userIsAdmin = isAdmin();
  
  // Update navigation visibility based on role
  const dashboardLinks = document.querySelectorAll('a[href*="dashboard"]');
  const adminLinks = document.querySelectorAll('.nav-admin-link');
  
  if (userIsAdmin) {
    // Hide Dashboard link for admins (they use Admin Panel instead)
    dashboardLinks.forEach(link => {
      if (!link.href.includes('admin')) {
        link.style.display = 'none';
      }
    });
    // Show Admin link
    adminLinks.forEach(link => link.style.display = 'flex');
  } else if (isLoggedIn()) {
    // Regular users: show dashboard, hide admin
    dashboardLinks.forEach(link => link.style.display = 'flex');
    adminLinks.forEach(link => link.style.display = 'none');
  }
}