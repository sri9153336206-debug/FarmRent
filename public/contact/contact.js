/**
 * FarmRent - Contact Page JavaScript
 * Handles contact form submission
 * Author: FarmRent Development Team
 */

document.addEventListener('DOMContentLoaded', () => {
  // Contact form handler
  const contactForm = document.getElementById('contact-form');
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
      firstName: document.getElementById('contact-firstname').value.trim(),
      lastName: document.getElementById('contact-lastname').value.trim(),
      email: document.getElementById('contact-email').value.trim(),
      phone: document.getElementById('contact-phone').value.trim(),
      subject: document.getElementById('contact-subject').value,
      message: document.getElementById('contact-message').value.trim(),
      createdAt: new Date().toISOString()
    };
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    // Validate email
    if (!isValidEmail(formData.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // Store message in localStorage (in real app, this would send to server)
    const messages = JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES) || '[]');
    messages.push(formData);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    
    showToast('Message sent successfully! We\'ll get back to you soon.');
    
    // Reset form
    contactForm.reset();
  });
});