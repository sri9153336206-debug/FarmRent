// State Variables

let currentFilter = 'all';
let currentAdmin = null;

// Statistics Functions

// Render dashboard statistics for all bookings

function renderStats() {
  const bookings = getBookings();
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue: bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalCost, 0),
    users: users.filter(u => u.role !== USER_ROLES.ADMIN).length
  };
  
  // Update stat cards
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-pending').textContent = stats.pending;
  document.getElementById('stat-confirmed').textContent = stats.confirmed;
  document.getElementById('stat-cancelled').textContent = stats.cancelled;
  document.getElementById('stat-revenue').textContent = `₹${stats.revenue}`;
  document.getElementById('stat-users').textContent = stats.users;
  
  // Update filter tab counts
  document.getElementById('pending-count').textContent = stats.pending;
  document.getElementById('confirmed-count').textContent = stats.confirmed;
  document.getElementById('cancelled-count').textContent = stats.cancelled;
}

// Booking Rendering Functions

// Render all bookings list based on current filter

function renderBookings() {
  const bookings = getBookings();
  const list = document.getElementById('bookings-list');
  
  // Filter bookings by status
  const filtered = currentFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === currentFilter);
  
  // Sort by most recent first
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Show empty state if no bookings
  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        ${icons.calendar}
        <p>No bookings found</p>
        <p class="sub">${currentFilter === 'all' 
          ? 'No bookings have been made yet' 
          : `No ${currentFilter} bookings at the moment`}</p>
      </div>
    `;
    return;
  }
  
  // Render booking cards
  list.innerHTML = filtered.map((booking, index) => {
    const typeIcon = icons[booking.machineType] || icons.tractor;
    const statusClass = booking.status === 'confirmed' ? 'badge-confirmed' : 
                       booking.status === 'cancelled' ? 'badge-cancelled' : 'badge-pending';
    const statusLabel = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
    
    return `
      <div class="booking-card" style="animation-delay: ${index * 50}ms">
        <div class="booking-card-inner">
          <div class="booking-machine">
            <div class="booking-machine-icon">${typeIcon}</div>
            <div>
              <div class="booking-machine-name">${booking.machineName}</div>
              <div class="booking-machine-type">${booking.machineType}</div>
            </div>
          </div>
          <div class="booking-details">
            <div class="booking-header">
              <div class="booking-meta">
                <span class="badge ${statusClass}">${statusLabel}</span>
                <span class="booking-user">
                  ${icons.user}
                  ${booking.userName || booking.farmerName}
                </span>
                <span class="booking-date-created">Booked ${new Date(booking.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="booking-price">
                <span class="currency-symbol">₹</span>
                <span class="amount">${booking.totalCost}</span>
              </div>
            </div>
            <div class="booking-info-grid">
              <div class="booking-info-item">${icons.user}<span>${booking.farmerName}</span></div>
              <div class="booking-info-item">${icons.mail}<span>${booking.farmerEmail}</span></div>
              <div class="booking-info-item">${icons.phone}<span>${booking.farmerPhone}</span></div>
              <div class="booking-info-item">${icons.mapPin}<span>${booking.farmLocation}</span></div>
            </div>
            <div class="booking-footer">
              <div class="booking-schedule">
                <div class="booking-schedule-item date">${icons.calendar}<span>${formatFullDate(booking.bookingDate)}</span></div>
                <div class="booking-schedule-item time">${icons.clock}<span>${booking.startTime} - ${booking.endTime}</span></div>
              </div>
              <div class="booking-actions">
                ${booking.status === 'pending' ? `
                  <button class="btn btn-success btn-sm" onclick="confirmBooking('${booking.id}')">
                    ${icons.check} Confirm
                  </button>
                  <button class="btn btn-danger btn-sm" onclick="cancelBookingAdmin('${booking.id}')">
                    ${icons.x} Cancel
                  </button>
                ` : booking.status === 'confirmed' ? `
                  <button class="btn btn-danger btn-sm" onclick="cancelBookingAdmin('${booking.id}')">
                    ${icons.x} Cancel
                  </button>
                ` : `
                  <button class="btn btn-outline btn-sm" onclick="deleteBookingAdmin('${booking.id}')">
                    Delete
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Booking Actions (Admin)

//  Confirm a pending booking
 
function confirmBooking(id) {
  updateBookingStatus(id, 'confirmed');
  showToast('Booking confirmed successfully!');
  renderStats();
  renderBookings();
}

// Cancel a booking (set status to cancelled)

function cancelBookingAdmin(id) {
  if (confirm('Are you sure you want to cancel this booking? The user will be notified.')) {
    updateBookingStatus(id, 'cancelled');
    showToast('Booking cancelled');
    renderStats();
    renderBookings();
  }
}

// Delete a booking completely (only for cancelled bookings)

function deleteBookingAdmin(id) {
  if (confirm('Are you sure you want to permanently delete this booking?')) {
    deleteBooking(id);
    showToast('Booking deleted');
    renderStats();
    renderBookings();
  }
}

// Event Listeners

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  if (!isLoggedIn()) {
    showToast('Please login to access the admin panel', 'error');
    setTimeout(() => {
      window.location.href = '../login/login.html';
    }, 1500);
    return;
  }
  
  // Get current user
  currentAdmin = getCurrentUser();
  
  // Check if user is admin
  if (currentAdmin.role !== USER_ROLES.ADMIN) {
    showToast('Access denied. Admin privileges required.', 'error');
    setTimeout(() => {
      window.location.href = '../dashboard/dashboard.html';
    }, 1500);
    return;
  }
  
  // Display admin welcome message
  const welcomeEl = document.getElementById('admin-welcome');
  welcomeEl.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
    Admin: ${currentAdmin.firstName}
  `;
  
  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Update tab states
      document.querySelectorAll('.filter-tab').forEach(t => {
        t.classList.remove('active', 'btn-primary');
        t.classList.add('btn-outline');
      });
      tab.classList.remove('btn-outline');
      tab.classList.add('active', 'btn-primary');
      
      // Update filter and re-render
      currentFilter = tab.dataset.filter;
      renderBookings();
    });
  });
  
  // Initial render
  renderStats();
  renderBookings();
});