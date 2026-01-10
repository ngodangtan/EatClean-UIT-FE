import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  ApiError,
} from "@shared/api";

const router = Router();

// In-memory user store (in production, use a database)
interface StoredUser extends User {
  password: string;
}

const users: Map<string, StoredUser> = new Map();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  birthday: z.string().optional(),
});

// Helper function to generate JWT token
function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET || "supersecret_change_me";
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

// Helper to serialize user (remove password)
function serializeUser(user: StoredUser) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Middleware to extract and verify JWT token
function verifyToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  console.log("verifyToken - authHeader:", authHeader?.substring(0, 30) + "...");

  if (!authHeader) {
    console.error("verifyToken - No authorization header");
    return null;
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.error(
      "verifyToken - Header doesn't start with Bearer. Actual:",
      authHeader.substring(0, 20),
    );
    return null;
  }

  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET || "supersecret_change_me";
  console.log("verifyToken - JWT_SECRET from env:", !!process.env.JWT_SECRET);
  console.log("verifyToken - Using secret:", secret);

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    console.log("verifyToken - Token decoded successfully. userId:", decoded.userId);
    return decoded.userId;
  } catch (error) {
    console.error("verifyToken - JWT verification failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

// Login route
router.post("/login", (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid email or password format",
        errors: validation.error.errors,
      });
    }

    const { email, password } = validation.data;

    // Find user by email
    let user: StoredUser | undefined;
    for (const u of users.values()) {
      if (u.email === email) {
        user = u;
        break;
      }
    }

    // Check if user exists and password matches
    // Note: In production, use proper password hashing (bcrypt)
    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return success response
    return res.status(200).json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "An error occurred during login",
    });
  }
});

// Register route
router.post("/register", (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid registration data",
        errors: validation.error.errors,
      });
    }

    const { email, password, fullName, username, phone, gender, birthday } =
      validation.data;

    // Check if user already exists
    for (const u of users.values()) {
      if (u.email === email) {
        return res.status(409).json({
          message: "User with this email already exists",
        });
      }
    }

    // Create new user
    const userId = Math.random().toString(36).substring(7);
    const newUser: StoredUser = {
      id: userId,
      email,
      password, // Note: In production, hash the password with bcrypt
      fullName,
      username,
      phone,
      gender,
      birthday,
    };

    // Store user
    users.set(userId, newUser);

    // Generate token
    const token = generateToken(userId);

    // Return success response
    return res.status(201).json({
      token,
      user: serializeUser(newUser),
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "An error occurred during registration",
    });
  }
});

// Get profile route
router.get("/profile", (req: Request, res: Response) => {
  try {
    console.log("=== GET /profile request ===");
    console.log(
      "Authorization header:",
      req.headers.authorization?.substring(0, 30) + "...",
    );

    // Verify token
    const userId = verifyToken(req);
    console.log("Verified userId:", userId);

    if (!userId) {
      console.error("Token verification failed - no userId extracted");
      return res.status(401).json({
        message: "Unauthorized - invalid or missing token",
      });
    }

    // Get user from store
    const user = users.get(userId);
    console.log("User found in store:", !!user);
    console.log("Total users in store:", users.size);

    if (!user) {
      console.error(
        `User ${userId} not found in store. Available users: ${Array.from(users.keys()).join(", ")}`,
      );
      return res.status(404).json({
        message: "User not found - please log in again",
      });
    }

    // Return user profile (without password)
    return res.status(200).json(serializeUser(user));
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving profile",
    });
  }
});

// Logout route
router.post("/logout", (req: Request, res: Response) => {
  try {
    // Verify token exists
    const userId = verifyToken(req);
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // In a real app, you might invalidate the token on the server
    // For now, just return success - client removes token from localStorage
    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "An error occurred during logout",
    });
  }
});

export default router;
