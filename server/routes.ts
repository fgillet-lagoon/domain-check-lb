import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session.authenticated) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

// API Key middleware (keep for backwards compatibility)
function requireApiKey(req: any, res: any, next: any) {
  const apiKey = req.headers.authorization?.replace("ApiKey ", "");
  const expectedKey = process.env.API_KEY || "default_api_key";
  
  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ error: "Invalid API key" });
  }
  
  next();
}

// CORS middleware
function enableCORS(req: any, res: any, next: any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply CORS to all routes
  app.use(enableCORS);

  // Authentication routes
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (username === "lagoon" && password === "L4goonBusiness") {
      req.session.authenticated = true;
      req.session.user = { username: "lagoon" };
      res.json({ success: true, user: { username: "lagoon" } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Could not log out" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    if (req.session.authenticated) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // GET /api/packages - Get all packages
  app.get("/api/packages", requireAuth, async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  // GET /api/check - Check domain availability with alternatives
  app.get("/api/check", requireAuth, async (req, res) => {
    try {
      const domain = req.query.domain as string;
      
      if (!domain) {
        return res.status(400).json({ error: "Domain parameter is required" });
      }

      // Validate extension
      const allowedExtensions = ['.nc', '.com', '.net', '.org'];
      const hasValidExtension = allowedExtensions.some(ext => domain.endsWith(ext));
      
      if (!hasValidExtension) {
        return res.status(400).json({ error: "Invalid domain extension. Allowed: .nc, .com, .net, .org" });
      }

      // Check primary domain
      const isAvailable = await storage.checkDomain(domain);
      
      // If not available, check alternatives and get domain info for .nc domains
      let alternatives: Array<{domain: string, available: boolean}> = [];
      let domainInfo = null;
      
      if (!isAvailable) {
        // Extract base domain name (without extension)
        const baseDomain = domain.substring(0, domain.lastIndexOf('.'));
        const otherExtensions = allowedExtensions.filter(ext => !domain.endsWith(ext));
        
        alternatives = await storage.checkMultipleDomains(baseDomain, otherExtensions);
        // Only include available alternatives
        alternatives = alternatives.filter(alt => alt.available);

        // Get detailed info for .nc domains that are not available
        if (domain.endsWith('.nc')) {
          domainInfo = await storage.getDomainInfo(domain);
        }
      }

      res.json({ 
        domain, 
        available: isAvailable,
        alternatives: alternatives.length > 0 ? alternatives : undefined,
        domainInfo: domainInfo
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check domain availability" });
    }
  });

  // POST /api/book - Book a domain
  app.post("/api/book", requireAuth, async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json({ success: true, booking, bookingId: `#RES-${new Date().getFullYear()}-${booking.id.toString().padStart(3, '0')}` });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  // GET /api/bookings - Get all bookings
  app.get("/api/bookings", requireAuth, async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
