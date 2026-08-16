/**
 * Prompts a confirmation dialog when the user tries to close the tab,
 * reload the page, or navigate away.
 */
window.addEventListener('beforeunload', (event) => {
    // 
    event.preventDefault();
    
    // 
    event.returnValue = '';
});
