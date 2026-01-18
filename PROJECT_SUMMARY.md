# Eat Clean - Project Summary

## Overview

**Eat Clean** is a health and fitness web application designed to help users create personalized nutrition plans based on their health profile and fitness goals. The application follows a complete client-server architecture with user authentication, health profile questionnaire, and personalized plan generation.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                     │
├─────────────────────────────────────────────────────────────────┤
│  - Login & Registration Pages                                    │
│  - Health Profile Questionnaire (15 steps)                       │
│  - Plan Analysis Screen                                          │
│  - Responsive UI with Tailwind CSS                              │
└────────────┬────────────────────────────────────────────────────┘
             │ HTTP/REST API
             │
┌────────────▼────────────────────────────────────────────────────┐
│                  SERVER (Express.js + Node.js)                   │
├─────────────────────────────────────────────────────────────────┤
│  - Authentication API (/api/auth)                               │
│  - Health Profile API (/api/health-profile)                     │
│  - JWT Token Management                                         │
│  - In-Memory Data Storage                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

- **React 18.3.1** - UI framework
- **Vite 7.1.2** - Build tool and dev server
- **React Router DOM 6.30.1** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **React Hook Form 7.62.0** - Form state management
- **Radix UI Components** - Accessible component library
- **Framer Motion 12.23.12** - Animation library
- **TypeScript 5.9.2** - Type safety

### Backend

- **Express.js 5.1.0** - Web framework
- **jsonwebtoken 9.0.3** - JWT token generation and verification
- **Zod 3.25.76** - Schema validation
- **dotenv 17.2.1** - Environment variable management
- **CORS 2.8.5** - Cross-origin resource sharing

### Development & Testing

- **Vitest 3.2.4** - Test runner
- **TypeScript** - Type checking and compilation
- **Prettier 3.6.2** - Code formatting

---

## Project Structure

```
root/
├── client/                          # Frontend React application
│   ├── pages/
│   │   ├── Index.tsx               # Landing page
│   │   ├── Login.tsx               # Login form
│   │   ├── Register.tsx            # User registration
│   │   ├── CreatePlan.tsx          # Health questionnaire (15 steps)
│   │   ├── Analyzing.tsx           # Plan analysis & API integration
│   │   ├── Profile.tsx             # User profile
│   │   ├── Recipes.tsx             # Recipe recommendations
│   │   ├── ChangePassword.tsx      # Password change
│   │   └── NotFound.tsx            # 404 page
│   ├── components/
│   │   ├── Header.tsx              # Navigation header
│   │   ├── Footer.tsx              # Footer
│   │   ├── Hero.tsx                # Hero section
│   │   ├── Features.tsx            # Features section
│   │   ├── PopularMeals.tsx        # Meals showcase
│   │   └── ui/                     # Radix UI components
│   ├── hooks/
│   │   ├── use-mobile.tsx          # Mobile breakpoint hook
│   │   └── use-toast.ts            # Toast notifications
│   ├── lib/
│   │   └── utils.ts                # Utility functions
│   ├── App.tsx                     # Main app component with routing
│   ├── global.css                  # Global styles
│   └── vite-env.d.ts               # Vite type definitions
│
├── server/                          # Backend Express application
│   ├── routes/
│   │   ├── auth.ts                 # Authentication endpoints
│   │   ├── health-profile.ts       # Health profile endpoints
│   │   └── demo.ts                 # Demo endpoints
│   ├── index.ts                    # Main server setup
│   └── node-build.ts               # Node build configuration
│
├── shared/                          # Shared types and constants
│   └── api.ts                      # API types and interfaces
│
├── public/                          # Static assets
│   ├── placeholder.svg
│   └── robots.txt
│
├── netlify/                         # Netlify functions
│   └── functions/api.ts            # Serverless API handler
│
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.ts              # Tailwind configuration
├── vite.config.ts                  # Frontend Vite config
├── vite.config.server.ts           # Backend Vite config
├── index.html                      # HTML entry point
├── components.json                 # Component config (Radix UI)
├── .env                            # Environment variables
└── netlify.toml                    # Netlify configuration
```

---

## Backend API Implementation

### 1. Authentication Endpoints (`server/routes/auth.ts`)

#### POST `/api/auth/login`

Authenticates a user and returns a JWT token.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "username": "johndoe",
    "phone": "+1234567890",
    "gender": "male",
    "birthday": "1990-01-01"
  }
}
```

**Response (Failure - 401):**

```json
{
  "message": "Invalid email or password"
}
```

**Key Features:**

- Email and password validation using Zod
- In-memory user lookup
- JWT token generation with 7-day expiration
- Password stored in plain text (NOT production-ready)

#### POST `/api/auth/register`

Creates a new user account.

**Request:**

```json
{
  "email": "newuser@example.com",
  "password": "securepass123",
  "fullName": "Jane Smith",
  "username": "janesmith",
  "phone": "+1234567890",
  "gender": "female",
  "birthday": "1995-05-15"
}
```

**Response (Success - 201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    /* user object */
  }
}
```

**Key Features:**

- Full user registration with optional fields
- Email uniqueness validation
- Password minimum 6 characters
- User ID generated as random string
- Automatic JWT token generation

### 2. Health Profile Endpoints (`server/routes/health-profile.ts`)

#### POST `/api/health-profile`

Creates or updates a user's health profile (requires authentication).

**Headers:**

```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request:**

```json
{
  "goal": "muscle-gain",
  "triedHealthyBefore": true,
  "hungryTime": "morning",
  "favoriteMeal": "lunch",
  "height": 180,
  "currentWeight": 75,
  "desiredWeight": 85,
  "activityLevel": "moderately-active",
  "averageDay": "balanced",
  "workSchedule": "Regular office hours (9-5)",
  "sleepDuration": 7,
  "diseases": ["None of the above"],
  "dietPreference": "balanced",
  "mealsPerDay": 3,
  "cuisinePreference": ["Vietnamese", "Thai"]
}
```

**Response (Success - 201/200):**

```json
{
  "ok": true,
  "profile": {
    "id": "profile123",
    "userId": "user456",
    "goal": "muscle-gain",
    "triedHealthyBefore": true,
    "height": 180,
    "currentWeight": 75,
    "desiredWeight": 85,
    "activityLevel": "moderately-active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
    /* ... all other fields ... */
  }
}
```

**Response (Failure - 401):**

```json
{
  "message": "Unauthorized"
}
```

**Key Features:**

- JWT token verification
- Zod schema validation for all 15 health parameters
- Creates new profile or updates existing
- Timestamps for audit trail
- In-memory storage

#### GET `/api/health-profile`

Retrieves the user's health profile (requires authentication).

**Response (Success - 200):**
Returns the user's health profile object.

**Response (Failure - 404):**

```json
{
  "message": "Health profile not found"
}
```

#### DELETE `/api/health-profile`

Deletes the user's health profile (requires authentication).

**Response (Success - 200):**

```json
{
  "ok": true
}
```

---

## Frontend Implementation

### 1. Authentication Flow

#### Login Page (`client/pages/Login.tsx`)

- Email and password input fields
- Email format validation
- Error message display
- Loading state during submission
- Success message before redirect
- Redirect to home page on success
- Link to registration page

#### Register Page (`client/pages/Register.tsx`)

- Extended user information collection
- Optional fields: username, phone, gender, birthday
- Password confirmation validation
- Email format validation
- Password minimum length validation
- Redirect to login on success

#### Header Navigation (`client/components/Header.tsx`)

Dynamic header based on authentication status:

- **Not authenticated**: Shows Login and Register buttons
- **Authenticated**: Shows user profile icon with dropdown menu
  - Profile link
  - Logout button (calls `/api/auth/logout`)
  - Stored token used from `localStorage`

### 2. Health Questionnaire (`client/pages/CreatePlan.tsx`)

**15-Step Questionnaire Flow:**

1. **Goal Selection** - User selects primary goal (Lose Weight, Muscle Gain, Improve Health)
2. **Previous Health Attempts** - Yes/No question
3. **Hungry Time** - Morning, Afternoon, or Evening (image cards)
4. **Favorite Meal** - Breakfast, Lunch, or Dinner (image cards)
5. **Height Input** - Numeric input (cm)
6. **Current Weight** - Numeric input (kg)
7. **Desired Weight** - Numeric input (kg) with weight loss/gain projection
8. **Activity Level** - Low, Moderate, High (image cards)
9. **Average Day Description** - Sedentary, Balanced, Physical Work (image cards)
10. **Work Schedule** - Multi-select from regular hours, flexible, night shifts, irregular
11. **Sleep Duration** - <6h, 6-8h, >8h
12. **Health Conditions** - Multi-select: Diabetes, High BP, Heart Disease, None
13. **Diet Preference** - Single select: Keto, Mediterranean, High-Protein, Paleo, Vegan, Vegetarian, None (image cards with text)
14. **Meals per Day** - 2, 3, or 4+ meals
15. **Cuisine Preferences** - Multi-select from Vietnamese, Chinese, Japanese, Thai, French, Korean, American

**Features:**

- Progress bar showing current step
- Back/Next navigation buttons
- Step validation before proceeding
- Data mapping for API compatibility
- LocalStorage persistence before API call

### 3. Plan Analysis (`client/pages/Analyzing.tsx`)

**Purpose:** Bridge between questionnaire and API integration

**Key Features:**

- Retrieves health data from `localStorage`
- Maps local format to API format:
  - Goal value transformation
  - Activity level mapping
  - Sleep duration conversion
  - Meals per day conversion
  - Array standardization
- Calls POST `/api/health-profile` with Bearer token
- Circular progress animation (0-100%)
- Error handling with redirect on failure
- Success message display
- LocalStorage cleanup after successful API call
- Automatic redirect to `/results` page

**Data Transformations:**

```javascript
// Goal mapping
'lose-weight' → 'lose-weight'
'muscle-gain' → 'gain-weight'
'improve-health' → 'improve-health'

// Activity level mapping
'low' → 'sedentary'
'moderate' → 'moderately-active'
'high' → 'very-active'

// Sleep duration mapping
'< 6h' → 5
'6 - 8h' → 7
'> 8h' → 9

// Meals per day mapping
'2 meals' → 2
'3 meals' → 3
'4+ meals' → 4
```

---

## Data Flow

### Complete User Journey

```
1. USER REGISTRATION
   └─> Register Page
       └─> Validation (email, password, fullName)
           └─> POST /api/auth/register
               └─> Create user in-memory
                   └─> Generate JWT token
                       └─> Store in localStorage
                           └─> Redirect to /login

2. USER LOGIN
   └─> Login Page
       └─> Validation (email, password)
           └─> POST /api/auth/login
               └─> Find user & verify password
                   └─> Generate JWT token
                       └─> Store in localStorage
                           └─> Store user data in localStorage
                               └─> Redirect to /

3. HEALTH PROFILE CREATION
   └─> Create Plan Page (15 steps)
       └─> Collect answers from user
           └─> User completes all 15 steps
               └─> Save health data to localStorage
                   └─> Navigate to /analyzing

4. PLAN ANALYSIS & API CALL
   └─> Analyzing Page
       └─> Retrieve health data from localStorage
           └─> Map data to API format
               └─> POST /api/health-profile (with Bearer token)
                   └─> Server validates JWT
                       └─> Server validates health data
                           └─> Create/Update health profile
                               └─> Return profile object
                                   └─> Clear localStorage
                                       └─> Show success message
                                           └─> Redirect to /results
```

### LocalStorage Key-Value Pairs

```javascript
// After Login/Registration
localStorage.setItem("token", "jwt_token_here");
localStorage.setItem(
  "user",
  JSON.stringify({
    id: "...",
    email: "...",
    fullName: "...",
    // ... other user fields
  }),
);

// During Questionnaire
localStorage.setItem(
  "healthProfileData",
  JSON.stringify({
    goal: "muscle-gain",
    triedHealthyBefore: true,
    hungryTime: "morning",
    favoriteMeal: "lunch",
    height: 180,
    currentWeight: 75,
    desiredWeight: 85,
    activityLevel: "moderate",
    averageDay: "balanced",
    workSchedule: ["Regular office hours (9-5)"],
    sleepDuration: "6 - 8h",
    diseases: ["None of the above"],
    dietPreference: "balanced",
    mealsPerDay: "3 meals",
    cuisinePreference: ["Vietnamese", "Thai"],
  }),
);
```

---

## Authentication & Security

### JWT Token Management

- **Token Format:** HS256 (HMAC SHA-256)
- **Payload:** `{ userId: string }`
- **Expiration:** 7 days
- **Secret:** Stored in `JWT_SECRET` environment variable (default: "supersecret_change_me")

### Token Verification Process

```javascript
const token = authHeader.substring(7); // Remove "Bearer " prefix
const decoded = jwt.verify(token, secret); // Verify & decode
const userId = decoded.userId; // Extract user ID
```

### Protected Routes

Only the health profile endpoints require authentication:

- `POST /api/health-profile` (requires valid token)
- `GET /api/health-profile` (requires valid token)
- `DELETE /api/health-profile` (requires valid token)

---

## Error Handling

### Backend Error Handling

**Validation Errors (400):**

- Invalid email format
- Password minimum length
- Required field missing
- Invalid health profile data

**Authentication Errors (401):**

- Missing or invalid Authorization header
- Invalid JWT token
- Token verification failure

**Conflict Errors (409):**

- User email already exists during registration

**Server Errors (500):**

- JSON parsing errors
- Token signing errors
- Unexpected exceptions

### Frontend Error Handling

**Login/Register:**

- Inline error messages
- Email format validation
- Password length validation
- Success message before redirect
- Graceful JSON parsing error handling

**Analyzing Page:**

- Health data existence check
- Token availability check
- HTTP status validation before JSON parsing
- Specific error messages from server
- Error display in red alert box
- Auto-redirect to create-plan on missing data

---

## Server Configuration

### Main Server Setup (`server/index.ts`)

- Express app with CORS enabled
- JSON and URL-encoded body parsing
- API routes registration
- Health check endpoint (`GET /api/ping`)
- Demo endpoint (`GET /api/demo`)

### Environment Variables

```
JWT_SECRET=supersecret_change_me  (default)
PING_MESSAGE=ping                 (optional)
```

### Data Storage

- **Users:** In-memory Map structure
- **Health Profiles:** In-memory Map structure
- **Note:** Not production-ready; requires database implementation

---

## Key Components & Their Responsibilities

| Component      | Purpose                    | Key Props/State                 |
| -------------- | -------------------------- | ------------------------------- |
| **Header**     | Navigation & auth status   | token, user, logout callback    |
| **Login**      | User authentication        | email, password, loading, error |
| **Register**   | New user creation          | form fields, validation, error  |
| **CreatePlan** | Health questionnaire       | currentStep, answers, progress  |
| **Analyzing**  | API integration & analysis | progress, error, health data    |
| **Footer**     | Site footer                | -                               |
| **Hero**       | Landing page hero          | -                               |
| **Features**   | Feature showcase           | -                               |

---

## Browser Storage

### LocalStorage Usage

- **User Data:** Persists across sessions
- **Health Questionnaire:** Temporary, cleared after API success
- **Token:** Used for API authentication

---

## Validation Rules

### Login Form

- Email: Valid email format
- Password: At least 1 character (server requires, client flexible)

### Registration Form

- Email: Valid email format
- Password: Minimum 6 characters
- Full Name: Required, non-empty
- Username: Optional
- Phone: Optional
- Gender: Optional (male/female/other)
- Birthday: Optional (date format)

### Health Profile

- Goal: Required string
- Height: Required number (cm)
- Current Weight: Required number (kg)
- Desired Weight: Required number (kg)
- Activity Level: Required string
- Sleep Duration: Required number (hours)
- Meals per Day: Required number (2-4)
- All other fields: Required, specific format

---

## Current Implementation Status

✅ **Completed:**

- User registration and login flow
- JWT authentication
- Health questionnaire (15 steps)
- API integration for health profiles
- Error handling and validation
- Responsive UI design
- LocalStorage management
- Header with auth status

⚠️ **In Development:**

- Health profile results page
- Recipe recommendations
- User profile management
- Plan customization

❌ **Not Yet Implemented:**

- Password reset functionality
- Database integration (currently in-memory)
- Password hashing (currently plain text)
- Email verification
- Two-factor authentication
- API rate limiting
- Production deployment

---

## Future Improvements

### Security

1. Implement password hashing (bcrypt)
2. Add email verification
3. Implement refresh tokens
4. Add CSRF protection
5. Rate limiting on auth endpoints

### Features

1. Database integration (PostgreSQL/Supabase)
2. Recipe recommendations engine
3. Personalized meal plans
4. Progress tracking
5. Social features (sharing, challenges)

### Performance

1. Add caching layers
2. Implement pagination
3. Optimize bundle size
4. Add API response compression

### Testing

1. Add unit tests for components
2. Add integration tests for API
3. Add E2E tests for user flows
4. Add performance tests

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build client only
npm run build:client

# Build server only
npm run build:server

# Start production server
npm start

# Run tests
npm run test

# Format code
npm run format.fix

# Type checking
npm run typecheck
```

---

## File Naming Conventions

- **Pages:** PascalCase (e.g., `CreatePlan.tsx`, `Analyzing.tsx`)
- **Components:** PascalCase (e.g., `Header.tsx`, `Footer.tsx`)
- **Routes:** kebab-case in URLs, snake_case in file names
- **API endpoints:** kebab-case (e.g., `/api/auth/login`, `/api/health-profile`)
- **Types/Interfaces:** PascalCase (e.g., `LoginRequest`, `HealthProfile`)

---

## Notes

- The application uses in-memory storage for both users and health profiles
- Passwords are stored in plain text (not suitable for production)
- All API responses include appropriate HTTP status codes
- Console logging is extensive for debugging purposes
- The application is fully responsive with mobile-first design
- Tailwind CSS is the primary styling solution
- Radix UI components provide accessible base components
- React Router handles client-side navigation
- Environment variables are loaded from `.env` file

---

**Last Updated:** December 2024
**Status:** Active Development
**Version:** 1.0.0 (Beta)
