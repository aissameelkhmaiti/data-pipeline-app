🎬 Data Pipelines Dashboard

A full-stack application for managing and processing movie-related data pipelines, including authentication, dashboards, and CRUD operations for movies, cinemas, and showtimes.

🚀 Tech Stack
Frontend

React (TypeScript)

Vite

ShadCN UI

Tailwind CSS

Backend

Node.js (TypeScript)

Express.js

Database

PostgreSQL

Testing

Vitest

DevOps

Docker & Docker Compose

📌 Features
🔐 Authentication

User signup & login

JWT-based authentication

Protected routes

📊 Dashboard

Overview of data (movies, cinemas, showtimes)

Clean UI with ShadCN components

🎬 CRUD Management

Movies (Create, Read, Update, Delete)

Cinemas

Showtimes

📂 Data Pipelines

Upload and process:

CSV files

JSON files

Integration with external APIs

Data transformation and storage in PostgreSQL

🧪 Testing

Unit and integration tests using Vitest

📁 Project Structure
project-root/
│
├── frontend/          # React + TypeScript app
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── backend/           # Node.js + TypeScript API
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── ...
│
├── docker/            # Docker configuration
├── docker-compose.yml
└── README.md
⚙️ Installation
1. Clone the repository
git clone https://github.com/your-username/datapipeline-dashboard.git
cd datapipeline-dashboard
2. Run with Docker (Recommended)
docker-compose up --build

App will be available at:

Frontend: http://localhost:5173

Backend: http://localhost:5000

3. Run manually (without Docker)
Backend
cd backend
npm install
npm run dev
Frontend
cd frontend
npm install
npm run dev
🔑 Environment Variables

Create a .env file in the backend:

PORT=5000
DATABASE_URL=postgresql://user:password@db:5432/datapipeline
JWT_SECRET=your_secret_key
📡 API Endpoints
Auth

POST /api/auth/register

POST /api/auth/login

Movies

GET /api/movies

POST /api/movies

PUT /api/movies/:id

DELETE /api/movies/:id

Cinemas & Showtimes

Similar CRUD endpoints

Data Pipelines

POST /api/upload/csv

POST /api/upload/json

GET /api/external-api

📂 File Upload

Supports CSV and JSON files

Uses Multer for file handling

Data is parsed and stored in PostgreSQL

🧪 Testing

Run tests with:

npm run test

Using Vitest for:

Unit tests

API testing

🐳 Docker Setup

Multi-container setup:

Frontend

Backend

PostgreSQL

Easy deployment and environment consistency

📈 Future Improvements

CI/CD integration (GitHub Actions)

Role-based access control (Admin/User)

Real-time notifications (WebSockets)

Data visualization (charts & analytics)

👨‍💻 Author

Aissame Elkhmaiti

Full Stack Developer (MERN, Laravel, Node.js, React)

⭐ Support

If you like this project, give it a ⭐ on GitHub!
