import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

// In-memory health profile store (in production, use a database)
interface HealthProfile {
  id: string;
  userId: string;
  goal: string;
  triedHealthyBefore: boolean;
  hungryTime: string;
  favoriteMeal: string;
  height: number;
  currentWeight: number;
  desiredWeight: number;
  activityLevel: string;
  averageDay: string;
  workSchedule: string;
  sleepDuration: number;
  diseases: string[];
  dietPreference: string;
  mealsPerDay: number;
  cuisinePreference: string[];
  createdAt: string;
  updatedAt: string;
}

const healthProfiles: Map<string, HealthProfile> = new Map();

// Validation schema
const healthProfileSchema = z.object({
  goal: z.string(),
  triedHealthyBefore: z.boolean(),
  hungryTime: z.string(),
  favoriteMeal: z.string(),
  height: z.number(),
  currentWeight: z.number(),
  desiredWeight: z.number(),
  activityLevel: z.string(),
  averageDay: z.string(),
  workSchedule: z.string(),
  sleepDuration: z.number(),
  diseases: z.array(z.string()),
  dietPreference: z.string(),
  mealsPerDay: z.number(),
  cuisinePreference: z.array(z.string()),
});

// Middleware to extract userId from JWT token (simplified)
const extractUserIdFromToken = (token: string): string | null => {
  try {
    // In production, use proper JWT verification
    // For now, extract from token structure
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(Buffer.from(parts[1], "base64").toString());
    return decoded.userId || null;
  } catch (error) {
    return null;
  }
};

// POST /health-profile - Create or update health profile
router.post("/", (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const userId = extractUserIdFromToken(token);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Validate request body
    const validation = healthProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid health profile data",
        errors: validation.error.errors,
      });
    }

    const now = new Date().toISOString();
    const id = Math.random().toString(36).substring(7);

    // Check if profile already exists for this user
    const existingProfile = Array.from(healthProfiles.values()).find(
      (p) => p.userId === userId
    );

    if (existingProfile) {
      // Update existing profile
      const updatedProfile: HealthProfile = {
        ...existingProfile,
        ...validation.data,
        updatedAt: now,
      };
      healthProfiles.set(existingProfile.id, updatedProfile);

      return res.status(200).json({
        ok: true,
        profile: updatedProfile,
      });
    }

    // Create new profile
    const newProfile: HealthProfile = {
      id,
      userId,
      ...validation.data,
      createdAt: now,
      updatedAt: now,
    };

    healthProfiles.set(id, newProfile);

    return res.status(201).json({
      ok: true,
      profile: newProfile,
    });
  } catch (error) {
    console.error("Error creating/updating health profile:", error);
    return res.status(500).json({
      message: "An error occurred",
    });
  }
});

// GET /health-profile - Get user's health profile
router.get("/", (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const userId = extractUserIdFromToken(token);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profile = Array.from(healthProfiles.values()).find(
      (p) => p.userId === userId
    );

    if (!profile) {
      return res.status(404).json({ message: "Health profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching health profile:", error);
    return res.status(500).json({
      message: "An error occurred",
    });
  }
});

// DELETE /health-profile - Delete user's health profile
router.delete("/", (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const userId = extractUserIdFromToken(token);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const profileToDelete = Array.from(healthProfiles.values()).find(
      (p) => p.userId === userId
    );

    if (!profileToDelete) {
      return res.status(404).json({ message: "Health profile not found" });
    }

    healthProfiles.delete(profileToDelete.id);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error deleting health profile:", error);
    return res.status(500).json({
      message: "An error occurred",
    });
  }
});

export default router;
