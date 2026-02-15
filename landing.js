
export function initLanding(rootElement) {
    rootElement.innerHTML = `
        <!-- Hero Section -->
        <section class="hero-section" style="
            text-align: center; 
            padding: 6rem 1rem; 
            max-width: 900px; 
            margin: 0 auto;
            background: var(--gradient-hero);
            border-radius: var(--radius-lg);
            margin-bottom: 4rem;
        ">
            <h1 class="fade-in" style="
                font-size: 3.5rem; 
                font-weight: 800; 
                line-height: 1.1; 
                margin-bottom: 1.5rem; 
                color: var(--text-main);
                letter-spacing: -2px;
            ">
                Make Decisions Together — <span style="
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                ">Let's Poll</span>
            </h1>
            <p class="fade-in" style="
                font-size: 1.25rem; 
                color: var(--text-secondary); 
                margin-bottom: 3rem; 
                max-width: 600px; 
                margin-left: auto; 
                margin-right: auto;
                line-height: 1.6;
            ">
                Create polls, share links, and watch results update live as people vote.
            </p>
            
            <div class="fade-in" style="animation-delay: 0.2s;">
                <button id="hero-create-btn" class="btn" style="
                    padding: 1rem 3rem; 
                    font-size: 1.1rem;
                    border-radius: var(--radius-full);
                ">
                    Create a Poll
                </button>
            </div>
        </section>

        <!-- Features Section -->
        <section style="
            padding: 2rem 1rem 6rem; 
            max-width: 1100px; 
            margin: 0 auto;
        ">
            <div style="
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
                gap: 2.5rem;
            ">
                <!-- Feature 1 -->
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Create in seconds</h3>
                    <p style="color: var(--text-secondary); line-height: 1.6;">Start a poll with a question and options instantly. No complicated setup required.</p>
                </div>

                <!-- Feature 2 -->
                <div class="feature-card">
                    <div class="feature-icon">🔗</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Share anywhere</h3>
                    <p style="color: var(--text-secondary); line-height: 1.6;">Send your poll link to friends, teams, or communities via WhatsApp, Slack, or Email.</p>
                </div>

                <!-- Feature 3 -->
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Live results</h3>
                    <p style="color: var(--text-secondary); line-height: 1.6;">Watch votes update in real time — no refresh needed. Perfect for meetings and events.</p>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="app-footer">
            <p class="footer-text">LetsPoll — Create. Share. Vote.</p>
        </footer>
    `;

    // Event Listeners
    document.getElementById('hero-create-btn').addEventListener('click', () => {
        window.location.search = '?page=create';
    });
}
