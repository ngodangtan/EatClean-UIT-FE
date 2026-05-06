import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const router = Router();

// In-memory health profile store (in production, use a database)
interface DiseaseEntry {
  key: string;
  diagnosedAt?: string;
  stage?: number;
  indicators: { key: string; value: number; unit?: string; measuredAt?: string; note?: string }[];
}

interface HealthProfile {
  id: string;
  userId: string;
  activityLevel: string;
  sleepDuration: number;
  diseases: DiseaseEntry[];
  dietPreference: string;
  mealsPerDay: number;
  cuisinePreference: string[];
  createdAt: string;
  updatedAt: string;
}

const healthProfiles: Map<string, HealthProfile> = new Map();

const diseaseEntrySchema = z.object({
  key: z.string(),
  diagnosedAt: z.string().optional(),
  stage: z.number().int().min(1).max(5).optional(),
  indicators: z.array(
    z.object({
      key: z.string(),
      value: z.number(),
      unit: z.string().optional(),
      measuredAt: z.string().optional(),
      note: z.string().optional(),
    })
  ).default([]),
});

// Validation schema — all fields optional for partial updates
const healthProfileSchema = z.object({
  activityLevel: z
    .enum(["sedentary", "lightly-active", "moderately-active", "very-active", "extremely-active"])
    .optional(),
  sleepDuration: z.number().min(0).max(24).optional(),
  diseases: z.array(diseaseEntrySchema).optional(),
  dietPreference: z.string().optional(),
  mealsPerDay: z.number().int().min(1).max(6).optional(),
  cuisinePreference: z.array(z.string()).max(10).optional(),
});

// Middleware to extract userId from JWT token
const extractUserIdFromToken = (token: string): string | null => {
  try {
    console.log(
      "Verifying token with secret:",
      process.env.JWT_SECRET || "supersecret_change_me",
    );
    const secret = process.env.JWT_SECRET || "supersecret_change_me";
    const decoded = jwt.verify(token, secret) as {
      userId?: string;
      id?: string;
    };
    console.log("Token decoded successfully:", decoded);
    // Accept both userId and id fields from token
    return decoded.userId || decoded.id || null;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

// POST /health-profile - Create or update health profile
router.post("/", (req: Request, res: Response) => {
  try {
    console.log("=== Health Profile API Request ===");
    console.log("Headers:", req.headers);
    const authHeader = req.headers.authorization;
    console.log("Auth header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    console.log("Token (first 20 chars):", token.substring(0, 20) + "...");

    const userId = extractUserIdFromToken(token);
    console.log("Extracted userId:", userId);

    if (!userId) {
      console.error("Failed to extract userId from token");
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Token verification successful for userId:", userId);

    console.log("Request body received:");
    console.log("Raw body:", JSON.stringify(req.body, null, 2));

    // Validate request body
    const validation = healthProfileSchema.safeParse(req.body);
    if (!validation.success) {
      console.error("Validation errors:", validation.error.errors);
      return res.status(400).json({
        message: "Invalid health profile data",
        errors: validation.error.errors,
      });
    }

    console.log("Validation passed. Data to be saved:");
    console.table(validation.data);

    const now = new Date().toISOString();
    const id = Math.random().toString(36).substring(7);

    // Check if profile already exists for this user
    const existingProfile = Array.from(healthProfiles.values()).find(
      (p) => p.userId === userId,
    );

    if (existingProfile) {
      // Merge partial update — omitted fields are preserved
      const updatedProfile: HealthProfile = {
        ...existingProfile,
        ...Object.fromEntries(
          Object.entries(validation.data).filter(([, v]) => v !== undefined)
        ),
        updatedAt: now,
      };
      healthProfiles.set(existingProfile.id, updatedProfile);

      console.log("✓ Profile updated successfully for userId:", userId);
      console.log(
        "Updated profile saved:",
        JSON.stringify(updatedProfile, null, 2),
      );

      return res.status(200).json({
        ok: true,
        profile: updatedProfile,
      });
    }

    // Create new profile with defaults for omitted fields
    const newProfile: HealthProfile = {
      id,
      userId,
      activityLevel: validation.data.activityLevel ?? "sedentary",
      sleepDuration: validation.data.sleepDuration ?? 7,
      diseases: (validation.data.diseases ?? []) as DiseaseEntry[],
      dietPreference: validation.data.dietPreference ?? "balanced",
      mealsPerDay: validation.data.mealsPerDay ?? 3,
      cuisinePreference: validation.data.cuisinePreference ?? [],
      createdAt: now,
      updatedAt: now,
    };

    healthProfiles.set(id, newProfile);

    console.log("✓ Profile created successfully for userId:", userId);
    console.log("New profile saved:", JSON.stringify(newProfile, null, 2));

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
      (p) => p.userId === userId,
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
      (p) => p.userId === userId,
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
