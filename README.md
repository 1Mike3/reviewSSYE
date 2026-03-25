# SecSysEng_2A_Gruppe2

## Microservice Authenticator
Microservice Authenticator with Secure Resource Access (JWT-based)

## Description
This project implements a microservice-based authentication system using JSON Web Tokens (JWT). It demonstrates a clean architectural separation between authentication and protected resource access.

The system consists of two independent services:

- AuthService → Handles registration, login, and token issuance
- Secure Cat Service → Provides protected resources (cat images) and validates JWTs

The Resource Service does not authenticate users directly, but instead verifies tokens issued by the AuthService. This reflects real-world architectures used in distributed systems and APIs.

## Key Features

- Stateless authentication using JWT
- Microservice architecture with clear separation of concerns
- Secure password handling (hashing, salting, optional peppering)
- Public key infrastructure for token verification
- Docker-based deployment
- Protected API endpoints


## Visuals
### Architecture Overview
```text
Client
  │
  ├──> AuthService (Login, Register, JWT Issuance)
  │         │
  │         └──> SQLite Database
  │
  └──> ResourceService (Secure Cat Service)
            │
            └──> JWT Validation (via Public Key)
 ```           
## Installation
### Requirements 
- Node.js (>= 20 recommended)
- Docker & Docker Compose
- Git

## Setup
### Clone the repository
```bash
git clone <repository-url>
cd <repository-name>
```

### Start the services 
```bash
docker-compose up --build
```
 
 ### Services will be available at:
- AuthService → http://localhost:5500
- ResourceService → https://localhost:5501

## Usage
### Sign in User 
```bash
POST /login
```


```bash
{
"username": "admin", 
"password": "adminadmin"
}
```

Response: 
```bash
{
"jwt": "<JWT_TOKEN>"
} 
```

### Access Protected Ressource
```bash
GET /cats

Cookie: auth_token=ey...
```

### JWT Structure
```bash
{
    "sub": "userID",
    "exp": 1700000000,
    "iss": "http://localhost:5500",
    "aud": "http://localhost:5501",
    "iat": 1699990000,
    "jti": "unique-token-id",
    "username": "admin",
    "role": "optional"
}
```

## Authors
- El Sayad Basmala (SM)
- Kovacic Timo (SO)
- Panosch Paul (TE)


## Project status
In development (academic project)