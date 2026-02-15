// src/views/create-poll.js
import { db } from '../firebase-config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function initCreatePoll(rootElement) {
    // Render the form
    rootElement.innerHTML = `
        <div class="card fade-in">
            <h2 style="text-align: center; margin-bottom: var(--space-md);">Create a New Poll</h2>
            
            <div class="input-group" style="margin-bottom: var(--space-md);">
                <label style="color: var(--text-secondary); display: block; margin-bottom: 5px;">Question</label>
                <input type="text" id="question" placeholder="E.g. What's the best programming language?" autofocus>
            </div>
            
            <label style="color: var(--text-secondary); display: block; margin-bottom: 5px;">Options</label>
            <div id="options-container">
                <input type="text" class="option-input" placeholder="Option 1" style="animation: fadeIn 0.3s ease;">
                <input type="text" class="option-input" placeholder="Option 2" style="animation: fadeIn 0.3s ease;">
            </div>
            
            <button id="add-option-btn" class="btn btn-secondary" style="margin-bottom: var(--space-lg); margin-top: var(--space-sm);">+ Add Option</button>
            
            <button id="create-btn" class="btn">Create Poll</button>
        </div>
    `;

    // Event Listeners
    const addOptionBtn = document.getElementById('add-option-btn');
    const optionsContainer = document.getElementById('options-container');
    const createBtn = document.getElementById('create-btn');
    const questionInput = document.getElementById('question');

    // Add new option input
    addOptionBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'option-input';
        input.placeholder = `Option ${optionsContainer.children.length + 1}`;
        input.style.animation = "fadeIn 0.3s ease";
        optionsContainer.appendChild(input);
        input.focus();
    });

    // Create Poll Logic
    createBtn.addEventListener('click', async () => {
        const question = questionInput.value.trim();
        const optionInputs = document.querySelectorAll('.option-input');
        const options = [];

        optionInputs.forEach(input => {
            const val = input.value.trim();
            if (val) options.push({ text: val, votes: 0 });
        });

        // Validation
        if (!question) {
            window.showToast("Please enter a question.", "error");
            questionInput.focus();
            return;
        }
        if (options.length < 2) {
            window.showToast("Please enter at least 2 options.", "error");
            return;
        }

        // Disable button to prevent double-submit
        createBtn.disabled = true;
        createBtn.textContent = "Creating...";

        try {
            const docRef = await addDoc(collection(db, "polls"), {
                question,
                options,
                createdAt: serverTimestamp()
            });
            window.showToast("Poll created successfully!", "success");
            // Redirect to poll view
            window.location.search = `?id=${docRef.id}`;
        } catch (error) {
            console.error("Error creating poll: ", error);
            window.showToast("Error creating poll: " + error.message, "error");
            createBtn.disabled = false;
            createBtn.textContent = "Create Poll";
        }
    });
}
