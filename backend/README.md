# CCWeb Backend

Backend server for CCWeb admin panel application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Start the production server:
```bash
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check
- `GET /api/admin` - Admin panel endpoint

## Environment Variables

Create a `.env` file with the following:

```
PORT=5000
NODE_ENV=development
```
