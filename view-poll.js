// src/views/view-poll.js
import { db, auth } from '../firebase-config.js';
import { doc, onSnapshot, updateDoc, increment, collection, setDoc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';

export function initViewPoll(rootElement, pollId) {
    const pollRef = doc(db, "polls", pollId);
    let unsubscribe;

    // Loading State
    rootElement.innerHTML = `
        <div class="card" style="text-align: center; padding: 4rem;">
            <div class="spinner"></div>
            <p style="color: var(--text-secondary)">Loading Poll...</p>
        </div>
    `;

    // Real-time Listener
    unsubscribe = onSnapshot(pollRef, async (docSnap) => {
        if (!docSnap.exists()) {
            rootElement.innerHTML = `
                <div class="card" style="text-align: center;">
                    <h2 style="color: var(--error)">Poll Not Found</h2>
                    <p>This poll does not exist or has been deleted.</p>
                    <br>
                    <a href="/" class="btn btn-secondary">Create New Poll</a>
                </div>
            `;
            return;
        }

        const pollData = docSnap.data();

        // Fairness Check: Has this user already voted?
        // 1. Check LocalStorage (Fast, but easily bypassed)
        const localVoted = localStorage.getItem(`voted_${pollId}`);

        // 2. Check Firestore "votes" subcollection (Robust, tied to Auth UID)
        let serverVoted = false;
        if (auth.currentUser) {
            try {
                const voteSnap = await getDoc(doc(db, "polls", pollId, "votes", auth.currentUser.uid));
                serverVoted = voteSnap.exists();
            } catch (e) {
                console.log("Could not verify vote status:", e);
            }
        }

        const hasVoted = localVoted || serverVoted;

        renderPoll(rootElement, pollData, pollId, hasVoted, unsubscribe);
    }, (error) => {
        console.error("Error fetching poll:", error);
        rootElement.innerHTML = `
            <div class="card">
                <h2 style="color: var(--error)">Error</h2>
                <p>Could not load poll data.</p>
                <small>${error.message}</small>
            </div>
        `;
    });
}

function renderPoll(rootElement, data, pollId, hasVoted, unsubscribe) {
    if (hasVoted) {
        renderResults(rootElement, data, pollId);
    } else {
        renderVotingForm(rootElement, data, pollId);
    }
}

function renderVotingForm(rootElement, data, pollId) {
    const optionsHtml = data.options.map((opt, index) => `
        <label class="option-card" style="
            display: flex; 
            align-items: center; 
            padding: 1rem; 
            margin-bottom: 0.5rem; 
            border: 1px solid var(--border); 
            border-radius: var(--radius-md); 
            cursor: pointer;
            transition: background 0.2s;
        ">
            <input type="radio" name="poll-option" value="${index}" style="margin-right: 1rem; transform: scale(1.2);">
            <span style="font-weight: 500;">${opt.text}</span>
        </label>
    `).join('');

    rootElement.innerHTML = `
        <div class="card fade-in">
            <h1>${data.question}</h1>
            <div style="margin-bottom: var(--space-lg);">
                ${optionsHtml}
            </div>
            <button id="vote-btn" class="btn">Submit Vote</button>
            <div style="margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1rem; text-align: center;">
                 <button id="share-btn" class="btn btn-secondary" style="width: auto;">🔗 Share Poll</button>
             </div>
        </div>
    `;

    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Highlight selection logic if we wanted custom styles, but native radio works fine
        });
    });

    // Vote Logic
    document.getElementById('vote-btn').addEventListener('click', async () => {
        const selected = document.querySelector('input[name="poll-option"]:checked');
        if (!selected) {
            window.showToast("Please select an option!", "error");
            return;
        }

        const index = parseInt(selected.value);
        const btn = document.getElementById('vote-btn');
        btn.disabled = true;
        btn.textContent = "Voting...";

        try {
            // Anti-Abuse: Use Transaction to ensure atomic vote + user record
            if (!auth.currentUser) throw new Error("Not authenticated");

            await runTransaction(db, async (transaction) => {
                const pollRef = doc(db, "polls", pollId);
                const voteRef = doc(db, "polls", pollId, "votes", auth.currentUser.uid);

                // Double check server side in transaction
                const voteDoc = await transaction.get(voteRef);
                if (voteDoc.exists()) {
                    throw new Error("You have already voted!");
                }
                const pollDoc = await transaction.get(pollRef);
                if (!pollDoc.exists()) throw new Error("Poll does not exist!");

                const newData = pollDoc.data();
                newData.options[index].votes = (newData.options[index].votes || 0) + 1;

                transaction.update(pollRef, { options: newData.options });
                transaction.set(voteRef, {
                    optionIndex: index,
                    timestamp: serverTimestamp()
                });
            });

            // Optimistic Update / Local Storage
            localStorage.setItem(`voted_${pollId}`, 'true');
            window.showToast("Vote cast successfully!", "success");

            // The snapshot listener will trigger re-render of Results view automatically

        } catch (error) {
            console.error("Vote failed:", error);
            window.showToast(error.message, "error");
            btn.disabled = false;
            btn.textContent = "Submit Vote";

            // If error was "already voted", force reload to show results
            if (error.message.includes("already voted")) {
                localStorage.setItem(`voted_${pollId}`, 'true');
                // Trigger re-fetch/render logic if needed, but error toast is good enough for now
            }
        }
    });

    setupShareButton();
}

function renderResults(rootElement, data, pollId) {
    const totalVotes = data.options.reduce((acc, opt) => acc + (opt.votes || 0), 0);

    const resultsHtml = data.options.map((opt) => {
        const votes = opt.votes || 0;
        const percent = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);

        return `
            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                    <strong>${opt.text}</strong>
                    <span>${votes} votes (${percent}%)</span>
                </div>
                <div style="
                    background: var(--bg-input); 
                    height: 10px; 
                    border-radius: var(--radius-lg); 
                    overflow: hidden;
                    position: relative;
                ">
                    <div style="
                        background: linear-gradient(90deg, var(--primary), var(--accent)); 
                        width: ${percent}%; 
                        height: 100%; 
                        transition: width 0.5s cubic-bezier(0, 0, 0.2, 1);
                    "></div>
                </div>
            </div>
        `;
    }).join('');

    rootElement.innerHTML = `
        <div class="card fade-in">
            <h1>${data.question}</h1>
            <div style="margin-bottom: 2rem;">
                ${resultsHtml}
            </div>
            <p style="text-align: center; color: var(--text-secondary); margin-bottom: 2rem;">Total Votes: ${totalVotes}</p>
             <div style="text-align: center; border-top: 1px solid var(--border); padding-top: 1rem;">
                 <button id="share-btn" class="btn btn-secondary" style="width: auto;">🔗 Share Poll</button>
                 <a href="/" class="btn btn-secondary" style="width: auto; margin-left: 1rem; border: none;">+ Create New</a>
             </div>
        </div>
    `;

    setupShareButton();
}

function setupShareButton() {
    const btn = document.getElementById('share-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                window.showToast("Link copied to clipboard!", "success");
            }).catch(() => {
                window.showToast("Could not copy link", "error");
            });
        });
    }
}
