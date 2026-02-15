# LetsPoll

LetsPoll is a modern, real-time polling application designed for simplicity and speed. Creating a poll is as easy as typing a question and adding options—no account required. Share your poll instantly with a unique link and watch the results update in real-time as users vote.

## Features

- **Real-Time Updates**: Poll results update instantly for everyone without page refreshes, powered by Firestore.
- **Anonymous Voting**: Users can vote without creating an account, lowering the barrier to entry.
- **Responsive Design**: Fully responsive UI that works seamlessly on desktop, tablet, and mobile devices.
- **Clean & Modern UI**: A minimalist interface focused on usability and aesthetics.
- **Secure**: Basic vote validation to prevent multiple votes from the same browser session (stored locally).
- **Easy Sharing**: Generate a unique URL for each poll to share on social media or messaging apps.

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
