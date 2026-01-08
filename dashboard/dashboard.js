// State Variables

let currentFilter = 'all';
let currentUser = null;

// Statistics Functions

// Render dashboard statistics for current user

function renderStats() {
  // Get only the current user's bookings
  const bookings = getUserBookings(currentUser.id);
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };
  
  // Update stat cards
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-pending').textContent = stats.pending;
  document.getElementById('stat-confirmed').textContent = stats.confirmed;
  document.getElementById('stat-cancelled').textContent = stats.cancelled;
  
  // Update filter tab counts
  document.getElementById('pending-count').textContent = stats.pending;
  document.getElementById('confirmed-count').textContent = stats.confirmed;

  document.getElementById('cancelled-count').textContent = stats.cancelled;
}

// Booking Rendering Functions

// Render bookings list based on current filter (user's bookings only)

function renderBookings() {
  // Get only the current user's bookings
  const bookings = getUserBookings(currentUser.id);
  const list = document.getElementById('bookings-list');
  
  // Filter bookings b status
  const filtered = currentFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === currentFilter);
  
  // Show empty state if no bookings
  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        ${icons.calendar}
        <p>No bookings found</p>
        <p class="sub">${currentFilter === 'all' 
          ? 'You haven\'t made any bookings yet. Browse our machines to get started!' 
          : `You don't have any ${currentFilter} bookings at the moment`}</p>
        <a href="../homepage/index.html" class="btn btn-accent" style="margin-top: 1rem;">Browse Machines</a>
      </div>
    `;
    return;
  }
  
  // Render simplified booking cards (Machine Name, Date/Time, Status only)
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
                <span class="badge ${statusClass}">
                  ${statusLabel}
                </span>
              </div>
              <div class="booking-price">
                <span class="currency-symbol">₹</span>
                <span class="amount">${booking.totalCost}</span>
              </div>
            <div class="booking-footer">
              <div class="booking-schedule">
                <div class="booking-schedule-item date">${icons.calendar}<span>${formatFullDate(booking.bookingDate)}</span></div>
                <div class="booking-schedule-item time">${icons.clock}<span>${booking.startTime} - ${booking.endTime}</span></div>
              </div>
              <div class="booking-actions">
                ${booking.status === 'pending' ? `
                  <button class="btn btn-danger btn-sm" onclick="cancelBooking('${booking.id}')">
                    ${icons.x} Cancel
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Booking Actions

// Cancel/delete a booking (user can only cancel their own bookings)

function cancelBooking(id) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    // Update status to cancelled instead of deleting
    updateBookingStatus(id, 'cancelled');
    showToast('Booking cancelled');
    renderStats();
    renderBookings();
  }
}

// Event Listeners

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  if (!isLoggedIn()) {
    showToast('Please login to access the dashboard', 'error');
    setTimeout(() => {
      window.location.href = '../login/login.html';
    }, 1500);
    return;
  }
  
  // Get current user
  currentUser = getCurrentUser();
  
  // Redirect admin to admin panel
  if (currentUser.role === USER_ROLES.ADMIN) {
    window.location.href = '../admin/admin.html';
    return;
  }
  
  // Display user welcome message
  const welcomeEl = document.getElementById('user-welcome');
  welcomeEl.innerHTML = `Welcome, ${currentUser.firstName}!`;
  
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