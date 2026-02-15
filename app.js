// src/app.js
import { initCreatePoll } from './views/create-poll.js?v=2';
import { initViewPoll } from './views/view-poll.js?v=2';
import { initLanding } from './views/landing.js?v=2';
import { auth } from './firebase-config.js';
import { signInAnonymously } from 'firebase/auth';

const appElement = document.getElementById('app');

// Router Logic
// ?id=xyz -> View Poll
// ?page=create -> Create Poll
// No params -> Landing Page

async function init() {
    try {
        // Authenticate anonymously first
        await signInAnonymously(auth);
        console.log("Authenticated as:", auth.currentUser.uid);

        const params = new URLSearchParams(window.location.search);
        const pollId = params.get('id');
        const page = params.get('page');

        if (pollId) {
            initViewPoll(appElement, pollId);
        } else if (page === 'create') {
            initCreatePoll(appElement);
        } else {
            initLanding(appElement);
        }
    } catch (error) {
        console.error("Initialization Failed:", error);
        appElement.innerHTML = `
            <div class="card" style="text-align: center;">
                <h2 style="color: var(--error)">Connection Error</h2>
                <p>Could not connect to voting services. Please check your internet connection or configuration.</p>
                <br>
                <small style="color: var(--text-secondary)">${error.message}</small>
            </div>
        `;
    }
}

// Global Toast Helper
window.showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

init();
