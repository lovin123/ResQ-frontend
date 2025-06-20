# ResQ Frontend

This is the React frontend for the ResQ Disaster Response Dashboard.

## Features

- Create and view disaster events
- View social media posts and resources related to a disaster
- Submit and verify disaster reports with images
- Real-time updates via WebSockets

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)
- Backend API (see `.env` setup below)

## Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the project root with the following content:

   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

   - Change the URL if your backend runs elsewhere.

4. **Start the development server**
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
frontend/
  public/           # Static files
  src/              # React source code
    App.js          # Main app component
    ...
  package.json      # Project metadata and scripts
  .env              # Environment variables (not committed)
```

## Environment Variables

- `REACT_APP_API_BASE_URL`: The base URL of your backend API (e.g., `http://localhost:5000`).

## Usage

- **Create Disaster:** Fill out the form and click "Create Disaster".
- **View Disasters:** Click a disaster to see details, social media, and resources.
- **Submit Report:** Enter report content and image URL, then submit.
- **Verify Image:** Click "Verify Image" to check the authenticity of an image for the selected disaster.

## Notes

- Make sure your backend server is running and accessible at the URL specified in `.env`.
- For real-time updates, the backend must support WebSockets (Socket.IO).

## License

MIT
