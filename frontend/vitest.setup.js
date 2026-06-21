// frontend/vitest.setup.js
import { vi } from "vitest";

const MOCK_URL = "http://localhost:3000";

// Force it into both environments
globalThis.BACKEND_URL = MOCK_URL;
process.env.BACKEND_URL = MOCK_URL;

// Keep this as a safety fallback
vi.stubGlobal("BACKEND_URL", MOCK_URL);