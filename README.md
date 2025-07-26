# Live Steps API Backend

A Node.js Express backend with SQLite database for managing live step data for phone numbers.

## 🚀 Features

- **RESTful API** for live step data management
- **SQLite Database** with automatic table creation
- **CORS Enabled** for cross-origin requests
- **Clean Number Responses** - returns just the step count without JSON wrapper
- **UPSERT Support** - updates existing records instead of creating duplicates
- **Public Access** via tunneling services

## 📋 API Endpoints

### GET `/api/live-steps`
- **Description:** Get all records or filter by phone number
- **Query Parameters:** 
  - `phone_number` (optional): Filter by specific phone number
- **Response:**
  - With phone_number filter: `3000` (just the number)
  - Without filter: Full JSON with all records

### GET `/api/live-steps/1111111111`
- **Description:** Get steps for specific phone number (hardcoded endpoint)
- **Response:** `78998` (just the number)

### POST `/api/live-steps`
- **Description:** Create or update step record
- **Body:** `{"phone_number": "1234567890", "steps": 5000}`
- **Response:** Confirmation message

### GET `/health`
- **Description:** Health check endpoint
- **Response:** `{"status":"OK","timestamp":"..."}`

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/anshul3782/backendsetup.git
cd backendsetup

# Install dependencies
npm install

# Start the server
npm run dev
```

### Environment
- **Port:** 3000 (configurable)
- **Database:** SQLite file at `/Users/test/Desktop/backbone/identifier.sqlite`
- **Table:** `live_steps` (auto-created)

## 📊 Database Schema

```sql
CREATE TABLE live_steps (
  phone_number TEXT PRIMARY KEY,
  steps INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🚀 Usage Examples

### Get steps for a specific phone number
```bash
curl "https://your-api-url.com/api/live-steps?phone_number=3333333333"
# Response: 3000
```

### Update steps for a phone number
```bash
curl -X POST https://your-api-url.com/api/live-steps \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "1111111111", "steps": 90000}'
```

### Get all records
```bash
curl https://your-api-url.com/api/live-steps
```

## 🔧 Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `./start-api.sh` - Start server with persistent tunnel (development)
- `./keep-tunnel-alive.sh` - Keep tunnel running with auto-restart

### File Structure
```
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── README.md             # This file
├── .gitignore            # Git ignore rules
├── start-api.sh          # Startup script with tunnel
└── keep-tunnel-alive.sh  # Persistent tunnel script
```

## 🌐 Deployment

### Render Deployment
1. Connect this GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Configure environment variables if needed

### Environment Variables
- `PORT` - Server port (default: 3000)
- `DB_PATH` - SQLite database path (optional)

## 📝 Notes

- The API returns clean numbers (not JSON) when filtering by phone_number
- Database uses UPSERT (INSERT OR REPLACE) for phone_number updates
- CORS is enabled for cross-origin requests
- Server includes graceful shutdown handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License 