# LetsPoll

LetsPoll is a modern, real-time polling application designed for simplicity and speed. Creating a poll is as easy as typing a question and adding options—no account required. Share your poll instantly with a unique link and watch the results update in real-time as users vote.

## Features

- **Real-Time Updates**: Poll results update instantly for everyone without page refreshes, powered by Firestore.
- **Anonymous Voting**: Users can vote without creating an account, lowering the barrier to entry.
- **Responsive Design**: Fully responsive UI that works seamlessly on desktop, tablet, and mobile devices.
- **Clean & Modern UI**: A minimalist interface focused on usability and aesthetics.
- **Secure**: Basic vote validation to prevent multiple votes from the same browser session (stored locally).
- **Easy Sharing**: Generate a unique URL for each poll to share on social media or messaging apps.

## Safety & Integrity

To ensure fair voting while maintaining ease of use, LetsPoll implements several mechanisms:

### Fairness & Anti-Abuse
1.  **Browser Fingerprinting (LocalStorage)**:
    -   When a user votes, a unique flag (`voted_{pollId}`) is stored in their browser's LocalStorage. This prevents casual users from refreshing the page to vote multiple times.
2.  **Server-Side User Verification (Firestore Transaction)**:
    -   The application uses Firebase Authentication (Anonymous) to assign a unique User ID (UID) to every visitor.
    -   Votes are recorded in a sub-collection `polls/{pollId}/votes/{uid}`.
    -   A Firestore Rules ensuring that even if a user clears their LocalStorage, the server checks if their UID has already voted on this poll before accepting a new vote.

### Edge Case Handling
-   **Race Conditions**:
    -   Used Firestore Transactions (`runTransaction`) to handle simultaneous votes. The server reads the current vote count, increments it, and writes it back atomically. This prevents vote counts from being overwritten if two users vote at the exact same millisecond.
-   **Poll Not Found**:
    -   If a user navigates to a non-existent or deleted poll ID, the app gracefully displays a "Poll Not Found" message and redirects them to create a new one.
-   **Invalid Inputs**:
    -   Creation form requires a non-empty question and at least two options.
    -   Prevents submission of empty votes or invalid option indexes.
-   **Optimistic UI Updates**:
    -   The UI updates immediately upon voting for a snappy experience, while the server verifies the vote in the background. If the server rejects the vote (e.g., duplicate), the UI is rolled back and an error is shown.

### Known Limitations & Future Improvements
While functional, there are areas for enhancement:
1.  **IP-Based Rate Limiting**:
    -   **Current Limitation**: Users can technically vote again by opening an Incognito window (which generates a new Anonymous UID).
    -   **Improvement**: Implement Cloud Functions to track IP addresses and limit votes per IP/subnet to make abuse harder.
2.  **Poll Expiry**:
    -   **Current Limitation**: Polls remain open indefinitely.
    -   **Improvement**: Add an "Expires At" timestamp field to allow creators to set a duration (e.g., 24 hours), after which voting is disabled.
3.  **Strict Security Rules**:
    -   **Current Limitation**: The current implementation relies partly on client-side logic.
    -   **Improvement**: Deploy comprehensive `firestore.rules` to enforce data validation (e.g., `request.resource.data.options.size() >= 2`) directly at the database level.
4.  **Option Editing**:
    -   **Current Limitation**: Polls cannot be edited once created.
    -   **Improvement**: Add an "Edit" mode for the creator (protected by a unique admin token or link).

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES Modules).
- **Backend**: Firebase (Firestore, Authentication).
- **Hosting**: Static hosting (GitHub Pages, Netlify, Vercel, or Firebase Hosting).

## Project Structure

```bash
LetsPoll/
├── index.html          # Main entry point
├── style.css           # Global styles and themes
└── src/
    ├── app.js          # Main application logic and routing
    ├── firebase-config.js # Firebase initialization
    └── views/          # Page components
        ├── create-poll.js
        ├── landing.js
        └── view-poll.js
```

## Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/LetsPoll.git
    cd LetsPoll
    ```

2.  **Set up Firebase:**
    -   Create a project in the [Firebase Console](https://console.firebase.google.com/).
    -   Enable **Firestore Database** and **Authentication** (Anonymous).
    -   Copy your web app's configuration.

3.  **Configure the App:**
    -   Open `src/firebase-config.js`.
    -   Replace the `firebaseConfig` object with your own credentials.

4.  **Run Locally:**
    -   Since the project uses ES Modules, you need to serve it over HTTP/HTTPS (not `file://`).
    -   You can use a simple static server like Python's `http.server` or the VS Code Live Server extension.
    
    Using Python:
    ```bash
    python3 -m http.server
    # Open http://localhost:8000 in your browser
    ```
