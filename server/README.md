# Backend Setup

## 1. Environment Variables
Create a `.env` file in the `server/` directory with the following content:

```
PORT=5000
DATABASE_URL=your_neondb_connection_string_here
```
Replace `your_neondb_connection_string_here` with your actual NeonDB connection string.

## 2. Install Dependencies
```
npm install
```

## 3. Run the Server
```
npm run dev
```

The server will start on the port specified in `.env` (default: 5000). 