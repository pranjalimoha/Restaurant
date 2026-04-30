# How to Run the Restaurant Reservation App

# Prerequisites

# Install the following before running the project:
  - node -v
  - npm -v
  - git --version

# Recommended
  - Node.js: 22.x
  - npm: latest stable
  - Database: Railway MySQL

# Project Structure
Restaurant/
├── backend/
└── FrontEnd/

## Clone the Repository
git clone <your-repository-url>
cd Restaurant

##### Backend Setup ########
cd backend
npm install

# Create a .env file inside backend/
Get with one of the Devs to assist with your enviroments 

# Then generate Prisma client:
npx prisma generate

# Push schema to the database:
npx prisma db push

# Optional: seed starter data:
npm run db:seed

# Start backend:
npm run dev

# Expected output:
DB CONNECTED
Server running on http://0.0.0.0:5001

# Test backend:
curl http://localhost:5001/health

# Expected response:
"message": "Server is running",
"timestamp": "..."

##### Frontend Setup ########
cd FrontEnd
npm install

# Create a .env file inside FrontEnd
Get with one of the Devs to assist with your enviroments 
# Start Frontend
npm run dev

# Expected output:
http://localhost:5173

##### Testing the Guest Reservation Flow ########
Home Page → Continue as Guest → Search for date/time/guest count → Select available table option → Enter guest details → Submit reservation → Confirmation page

# A successful reservation should:
1. Create a row in reservations
2. Create one or more rows in reservation_tables
3. Show confirmation page with reservation details

##### Testing High-Traffic / Holding Fee Flow ########
Search → Select table → Enter guest details → Payment/Holding Fee page → Authorize Holding Fee → Confirmation page

# Expected database values:
requires_holding_fee = true
holding_fee_amount = 10.00
holding_fee_paid = true
status = CONFIRMED

# Testing Combined Table Flow
Choose a guest count that may require table combinations.

# Expected behavior:
The system shows table combinations like T3 + T4.
When selected, both tables are reserved.

# Expected database behavior:
reservations.tables_need_combining = true
reservation_tables contains multiple rows for the same reservation_id

#### Deployment Notes ####

# Railway backend URL:
https://restaurant-production-402f.up.railway.app

# Railway required variables:
DATABASE_URL=<Railway MySQL URL>
JWT_SECRET=<secret>

# Railway settings:
Build Command: npm run build
Start Command: npm start
Public domain port: 8080

# Backend scripts:
  "dev": "tsx watch src/server.ts",
  "build": "prisma generate && prisma db push",
  "start": "tsx src/server.ts",
  "postinstall": "prisma generate"
