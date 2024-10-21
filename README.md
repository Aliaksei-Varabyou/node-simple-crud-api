# Node.js Simple CRUD Application

This is an example of a Node.js application that implements CRUD operations and supports multiprocessing using the Node.js Cluster API.

## Functionality

- **CRUD operation**: Create, read, update and delete data.
- **Two modes of operation**:
  - Single-process mode.
  - Multi-process mode with load balancer.

## Requirements

To run the application you need:
- Node.js (version 22.9.0 or upper)
- npm (usually comes with Node.js)

## Installation

Follow these steps to install the application:

1. Clone the repository:
   ```bash
   git clone https://github.com/Aliaksei-Varabyou/node-simple-crud-api.git
   cd node-simple-crud-api
2. Install dependencies:
   ```bash
   npm install
# Launching the application

You can run the application in one of two modes:

1. Single process mode
   ```bash
   npm run start:dev
2. Multiprocess mode
   ```bash
   npm run start:multi
3. It is also possible to build applications in prod mode
   ```bash
   npm run start:prod
# Usage

Once the application is running, you can interact with it by sending HTTP requests to the appropriate endpoints:

GET /api/users: getting a list of data.
POST /api/users: creating a new entry.
GET /api/users/:id: getting a record by ID.
PUT /api/users/:id: update record by ID.
DELETE /api/users/:id: delete record by ID.

# Multiprocess mode

In multiprocess mode, requests are distributed across different processes. Each process listens to its own unique port, starting from 4001 and onwards. The load balancer listens on port 4000 and distributes incoming requests between the processes.
