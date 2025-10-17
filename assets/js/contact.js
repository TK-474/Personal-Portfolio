export function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitButton = contactForm?.querySelector('button[type="submit"]');
  
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable form and show loading state
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }
    
    if (formStatus) {
      formStatus.textContent = 'Sending your message...';
      formStatus.className = 'mt-3 text-sm text-blue-600 dark:text-blue-400';
    }

    try {
      const formData = new FormData(contactForm);
      
      // Add honeypot field for spam protection
      formData.append('_subject', 'New message from portfolio contact form');
      formData.append('_replyto', formData.get('email'));
      
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        if (formStatus) {
          formStatus.textContent = 'Thank you! I\'ll get back to you soon.';
          formStatus.className = 'mt-3 text-sm text-green-600 dark:text-green-400';
        }
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      if (formStatus) {
        formStatus.textContent = 'Sorry, there was an error. Please email me directly at talalkhan213@gmail.com';
        formStatus.className = 'mt-3 text-sm text-red-600 dark:text-red-400';
      }
    } finally {
      // Re-enable form
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send';
      }
    }
  });
}


