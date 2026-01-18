/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * API base URL
 * In development: http://localhost:4000 (from VITE_API_BASE env)
 * In production: depends on deployment (set VITE_API_BASE accordingly)
 */
export const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:4000';

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * User interface (without password)
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  username?: string;
  phone?: string;
  gender?: string;
  birthday?: string;
}

/**
 * Login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Register request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  username?: string;
  phone?: string;
  gender?: string;
  birthday?: string;
}

/**
 * Register response
 */
export interface RegisterResponse {
  token: string;
  user: User;
}

/**
 * Error response
 */
export interface ApiError {
  message: string;
  errors?: any[];
}
