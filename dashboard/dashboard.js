// State Variables

let currentFilter = 'all';

// Statistics Functions

// Render dashboard statistics

function renderStats() {
  const bookings = getBookings();
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue: bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.totalCost, 0)
  };
  
  // Update stat cards
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-pending').textContent = stats.pending;
  document.getElementById('stat-confirmed').textContent = stats.confirmed;
  document.getElementById('stat-revenue').textContent = `$${stats.revenue}`;
  
  // Update filter tab counts
  document.getElementById('pending-count').textContent = stats.pending;
  document.getElementById('confirmed-count').textContent = stats.confirmed;
}

// Booking Rendering Functions

// Render bookings list based on current filter

function renderBookings() {
  const bookings = getBookings();
  const list = document.getElementById('bookings-list');
  
  // Filter bookings
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
          ? 'Bookings will appear here when you make reservations' 
          : `No ${currentFilter} bookings at the moment`}</p>
      </div>
    `;
    return;
  }
  
  // Render booking cards
  list.innerHTML = filtered.map((booking, index) => {
    const typeIcon = icons[booking.machineType] || icons.tractor;
    
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
                <span class="badge ${booking.status === 'confirmed' ? 'badge-confirmed' : 'badge-pending'}">
                  ${booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </span>
                <span class="booking-date-created">Booked ${new Date(booking.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="booking-price">
                ${icons.rupees}
                <span class="amount">
                  ${booking.hours}h × ${booking.ratePerHour} = ₹${Number(booking.totalCost).toLocaleString('en-IN')}
                </span>
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
                ` : ''}
                <button class="btn btn-danger btn-sm" onclick="cancelBooking('${booking.id}')">
                  ${icons.x} Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Booking Actions

// Confirm a pending booking

function confirmBooking(id) {
  updateBookingStatus(id, 'confirmed');
  showToast('Booking confirmed successfully!');
  renderStats();
  renderBookings();
}

// Cancel/delete a booking

function cancelBooking(id) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    deleteBooking(id);
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
  
  // Display user welcome message
  const user = getCurrentUser();
  if (user) {
    const welcomeEl = document.getElementById('user-welcome');
    welcomeEl.innerHTML = `Welcome, ${user.firstName}!`;
  }
  
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