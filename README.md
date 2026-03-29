# 🛒 POS Updater Server - NestJS API

> A robust and secure API built to manage Point of Sale (POS) system updates, ensuring cash registers are always running the latest version with strict hardware validation.

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%230074c1.svg?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## 📋 About the Project

This server acts as the central controller for the **POS Updater** (a C# desktop client). It solves the critical challenge of software distribution in retail environments, guaranteeing that cash registers download the latest system versions silently, autonomously, and securely.

### ✨ Key Features

- **🔒 Hardware Authentication (Device ID):** Access and refresh tokens are strictly bound to the machine's physical ID, preventing unauthorized system usage on unregistered computers.
- **🔄 Token Management (Access & Refresh):** A complete authentication flow using JWT, ensuring the updater runs seamlessly in the background without requiring daily manual logins.
- **📊 Real-Time Dashboarding (Google Sheets):** Automatically synchronizes update logs directly into a Google Spreadsheet, providing the business team with a live view of POS versions across all stores.
- **📦 Update Traceability:** Logs exactly which machine (`deviceName`) downloaded which system version into the MongoDB database, generating a reliable audit trail.
- **🛡️ Clean Architecture:** Implemented using *Guards* for route protection, *Interceptors* for global logging, and custom *Decorators* (e.g., `@CurrentUser`).

## 🛠️ Tech Stack

- **Backend:** NestJS, TypeScript, Node.js
- **Database:** MongoDB (via Mongoose)
- **External APIs:** Google Sheets API (Google Cloud Platform)
- **Security:** Passport.js, JWT, bcrypt
- **Documentation:** Swagger (OpenAPI)

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or via Atlas
- Google Cloud Service Account Credentials (for Sheets API)

### Installation
```bash
1. Clone the repository:

git clone [https://github.com/YOUR_USERNAME/pos_updater_server.git](https://github.com/YOUR_USERNAME/pos_updater_server.git)
2. Install the dependencies:
Bashcd pos_updater_server
npm install

3. Set up the environment variables (create a .env file in the root directory):
NODE_ENV=development
MONGO_URI=yourUri
SALTROUNDS=yourSaltrounds
AT_KEY=your256BitsAtkey
GOOGLE_SHEET_ID=yourGoogleSheetId
GOOGLE_SHEET_NAME=Sheet0


4. Start the server:Bash# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

📡 Main API EndpointsFull documentation can be accessed via Swagger at the /api/docs route when the application is running.
MethodEndpointDescriptionAuthentication
POST/auth/local/signin Registers/Authenticates a new terminal using credentials and deviceId.None
POST/auth/refresh Generates a new Access Token using the Refresh Token and validates the Hardware.None
POST/updates/save Logs the downloaded version into the DB and updates the Google Sheet.Bearer Token
