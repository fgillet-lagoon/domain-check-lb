import Database from "better-sqlite3";
import { type Package, type InsertPackage, type Booking, type InsertBooking } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getPackages(): Promise<Package[]>;
  getBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  checkDomain(domain: string): Promise<boolean>;
}

export class SQLiteStorage implements IStorage {
  private db: Database.Database;

  constructor() {
    this.db = new Database("bookings.db");
    this.init();
  }

  private init() {
    // Create tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        extension TEXT NOT NULL
      );
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT DEFAULT (datetime('now')),
        domain TEXT NOT NULL,
        package_id INTEGER NOT NULL,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        ridet TEXT,
        id_document TEXT,
        notes TEXT,
        status TEXT DEFAULT 'réservé',
        FOREIGN KEY (package_id) REFERENCES packages (id)
      );
    `);

    // Insert default packages if they don't exist
    const packagesCount = this.db.prepare("SELECT COUNT(*) as count FROM packages").get() as { count: number };
    if (packagesCount.count === 0) {
      const insertPackage = this.db.prepare(`
        INSERT INTO packages (name, description, price, extension)
        VALUES (?, ?, ?, ?)
      `);

      insertPackage.run("Basique .nc", "Domaine .nc standard", 2500, ".nc");
      insertPackage.run("Standard .com", "Domaine .com international", 3200, ".com");
      insertPackage.run("Pro .net", "Domaine .net professionnel", 3500, ".net");
      insertPackage.run("Organisation .org", "Domaine .org pour organisations", 3000, ".org");
    }
  }

  async getPackages(): Promise<Package[]> {
    const stmt = this.db.prepare("SELECT * FROM packages ORDER BY id");
    return stmt.all() as Package[];
  }

  async getBookings(): Promise<Booking[]> {
    const stmt = this.db.prepare(`
      SELECT b.*, p.name as package_name 
      FROM bookings b 
      JOIN packages p ON b.package_id = p.id 
      ORDER BY b.created_at DESC
    `);
    return stmt.all() as Booking[];
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const stmt = this.db.prepare(`
      INSERT INTO bookings (domain, package_id, customer_name, email, phone, ridet, id_document, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      booking.domain,
      booking.packageId,
      booking.customerName,
      booking.email,
      booking.phone,
      booking.ridet,
      booking.idDocument,
      booking.notes,
      booking.status || "réservé"
    );

    const getStmt = this.db.prepare("SELECT * FROM bookings WHERE id = ?");
    return getStmt.get(result.lastInsertRowid) as Booking;
  }

  async checkDomain(domain: string): Promise<boolean> {
    // Deterministic hash-based availability check
    const hash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % 3 !== 0;
  }
}

export const storage = new SQLiteStorage();
