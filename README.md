# Queues Service

## Overview

Queues service for Papdaew. This service handles real-time queue management, allowing customers to join and monitor queues remotely through mobile or web applications. It integrates with other services to provide a seamless queue management experience.

## Table of Contents

- [Queues Service](#queues-service)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)

## Features

- Real-time queue management
- Remote queue joining and monitoring
- Live status updates and waiting time estimates
- Multiple queue types (normal, fast-track, reservation)
- Queue analytics and reporting (planned)

## Tech Stack

- Node.js

## Project Structure

```
services/papdaew-queuess/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── configs/
│   ├── server.js
│   └── app.js
├── tests/
├── .editorconfig
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

4. Database Setup:

   ```bash
   # Start PostgreSQL (if using Docker)
   docker-compose up -d postgres

   # Run database migrations
   npx prisma migrate dev
   ```

5. Run the service:

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```
