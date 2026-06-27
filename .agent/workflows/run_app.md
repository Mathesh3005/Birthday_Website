---
description: How to run the ShopZone application locally
---
# Run ShopZone

Follow these steps to run the full stack application.

## Prerequisites
- MongoDB running locally or a valid URI in `.env`
- Node.js installed

## Steps

1. **Start Backend Server**
   Open a terminal and run:
   ```bash
   cd d:\project\project30\server
   npm run dev
   ```
   Server will start on [http://localhost:5000](http://localhost:5000).

2. **Start Frontend Server**
   Open a *new* terminal and run:
   ```bash
   cd d:\project\project30\client
   npm run dev
   ```
   Application will be available at [http://localhost:3000](http://localhost:3000).

## Troubleshooting
- If frontend fails, ensure backend is running.
- If database connection fails, check your MongoDB instance.
