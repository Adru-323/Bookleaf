# Bookleaf
# BookLeaf – Author Support & Communication Portal

Hi! This is my submission for the BookLeaf Publishing Full-Stack Developer technical assignment.

I built this application to make communication between authors and the BookLeaf support team easier. Authors can check their book and royalty details, raise support tickets, and communicate with the admin team. Admins can manage tickets, respond to queries, and track their status.

## Project Links

- **Live Application:** https://bookleaf-1-nell.onrender.com
- **GitHub Repository:** https://github.com/Adru-323/Bookleaf

## Technologies I Used

While building this project, I used the following technologies:

- **Frontend:** React.js, Vite, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcryptjs, HTTP-only cookies
- **API Requests:** Axios
- **Real-time Communication:** Socket.IO
- **Deployment:** Render

## What I Have Built

### Author Dashboard

An author can log in and access their own dashboard.

Some of the features include:

- View personal book details.
- Check ISBN, publication status, and MRP.
- Track total copies sold.
- View royalty earned, royalty paid, and pending royalty.
- Search books using their title or ISBN.
- Raise a support ticket for a book or a general query.
- View previously submitted tickets.
- Reply to messages from the admin team.

### Admin Dashboard

I also created a separate dashboard for administrators.

Admins can:

- View support tickets submitted by authors.
- Check ticket details and author information.
- View ticket priority and category.
- Reply to author queries.
- Change ticket status (Open, In Progress, Resolved, Closed).
- Receive and send ticket messages in real time.

### Authentication and Access Control

I used JWT-based authentication with HTTP-only cookies.

Passwords are hashed using bcryptjs before being stored in MongoDB. I also added role-based access so that authors can access only their own information, while administrators can manage tickets across authors.

## How I Structured the Project

I kept the frontend and backend in separate folders so that both can be developed and maintained independently.

```text
Bookleaf/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── utils/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── config.js
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

The frontend communicates with the backend through REST APIs. MongoDB stores user, book, and ticket information. Socket.IO is used for real-time ticket conversations.

## Running the Project Locally

To run the project on your machine, follow these steps.

### Step 1: Clone the repository

```bash
git clone https://github.com/Adru-323/Bookleaf.git
cd Bookleaf
```

### Step 2: Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=8080
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
SECRET_CODE=your_jwt_secret
DEMO_PASSWORD=your_demo_password
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm start
```

### Step 3: Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:8080
```

Start the frontend:

```bash
npm run dev
```

The application will be available at:

`http://localhost:5173`

## Demo Login Details

I have used the provided sample dataset to create demo accounts for testing the application.

**Author Login**

```text
Email: priya.sharma@email.com
Password: bookleaf123
```

Other author accounts from the sample dataset can also be used.

**Admin Login**

```text
Email: admin@bookleaf.com
Password: bookleaf123
```

These credentials are intended only for testing the deployed application.

## API Routes

The following are the main API endpoints used in the application.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Author/Admin login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/books/my-books` | Get author's books |
| POST | `/api/tickets` | Create a ticket |
| GET | `/api/tickets/my-tickets` | Get author's tickets |
| GET | `/api/tickets` | Get all tickets (Admin) |
| GET | `/api/tickets/:ticketId` | Get ticket details |
| POST | `/api/tickets/:ticketId/replies` | Send a reply |
| PATCH | `/api/tickets/:ticketId/status` | Update ticket status (Admin) |

Protected routes require authentication, and access is checked according to the user's role.

## A Few Things I Would Like to Improve

There are still some areas I would like to work on further:

- Add AI-based ticket classification and automatic priority suggestions.
- Generate response drafts using the BookLeaf Knowledge Base.
- Add internal notes and ticket assignment for administrators.
- Improve ticket filtering and sorting.
- Add more automated tests and API documentation.
- Improve error monitoring and production logging.

I prioritised getting the main author and admin workflows working first, including authentication, ticket management, and real-time communication.

## Developer

**Adarsh Salunkhe**

GitHub: https://github.com/Adru-323

Thank you for taking the time to review my project!
