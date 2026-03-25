// Client-Side Form Submission Feedback
// Disables the submit button and changes text to "Loading..." 
// to prevent double submissions and provide visual feedback.

document.querySelector('form').addEventListener('submit', function() {
    var btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Loading...';
});
