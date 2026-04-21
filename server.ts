import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Database setup
  const db = new Database("hypevault.db");
  db.pragma("journal_mode = WAL");

  // Create tables with professional normalization and SQL constraints
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sneakers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      img_url TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 10,
      description TEXT,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stash (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sneaker_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sneaker_id) REFERENCES sneakers (id) ON DELETE CASCADE
    );

    -- SQL AUDIT LOG for technical demonstration (Triggers)
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- SQL VIEW for analytics (Technical Mastery)
    CREATE VIEW IF NOT EXISTS v_category_analytics AS
    SELECT 
      c.name, 
      COUNT(s.id) as model_count, 
      SUM(s.stock) as total_units,
      SUM(s.price * s.stock) as projected_value
    FROM categories c
    LEFT JOIN sneakers s ON c.id = s.category_id
    GROUP BY c.id;

    -- SQL TRIGGER for automated auditing (Technical Mastery)
    CREATE TRIGGER IF NOT EXISTS tr_stash_audit
    AFTER INSERT ON stash
    BEGIN
      INSERT INTO audit_logs (event_type, message)
      VALUES ('SECURE_ASSET', 'Asset ID ' || NEW.sneaker_id || ' locked in vault buffer.');
    END;
  `);

  // Seed data if empty (using normalized schema)
  const rowCount = db.prepare("SELECT count(*) as count FROM sneakers").get() as { count: number };
  if (rowCount.count === 0) {
    const cats = ["nike", "adidas", "converse", "luxury"];
    const insertCat = db.prepare("INSERT INTO categories (name) VALUES (?)");
    cats.forEach(c => insertCat.run(c));

    const getCatId = (name: string) => (db.prepare("SELECT id FROM categories WHERE name = ?").get(name) as { id: number }).id;

    const insert = db.prepare(`
      INSERT INTO sneakers (name, price, category_id, img_url, stock, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const initialSneakers = [
      ["Jordan 1 High Chicago", 165000, getCatId("nike"), "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=600&q=80", 150, "The absolute grail. Resurrected from 1985."],
      ["Travis Scott x Fragment", 145000, getCatId("nike"), "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=600&q=80", 85, "High-voltage collaboration. Reversed swoosh."],
      ["Converse Chuck 70 High", 8500, getCatId("converse"), "https://images.unsplash.com/photo-1617606002779-51d866bdd1d1?auto=format&fit=crop&w=600&q=80", 500, "Timeless silhouette. Reinvented for the modern vault."],
      ["Off-White Presto", 180000, getCatId("nike"), "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80", 42, "Virgil Abloh's deconstructed masterpiece."],
      ["Dior x Air Jordan 1", 750000, getCatId("luxury"), "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=600&q=80", 15, "The pinnacle of high-fashion and street culture."],
      ["Nike Dunk Low Panda", 18000, getCatId("nike"), "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80", 850, "The street staple. Clean, classic black and white."],
      ["Aime Leon Dore 550", 42000, getCatId("luxury"), "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80", 120, "Vintage aesthetics from the heart of Queens."],
      ["Rick Owens Geobasket", 98000, getCatId("luxury"), "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80", 64, "Avant-garde architecture for your feet."],
      ["Nike Mag", 3500000, getCatId("nike"), "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=600&q=80", 5, "The future is here. Auto-lacing legend."],
      ["Adidas Samba Wales Bonner", 55000, getCatId("adidas"), "https://images.unsplash.com/photo-165c3688c6c21523ab3881c91/16:9/w_2560%2Cc_limit/Wales-Bonner-x-Adidas.jpg", 200, "Luxury materials meet heritage football style."]
    ];

    for (const shoe of initialSneakers) {
      insert.run(...shoe);
    }
  }

  app.use(express.json());

  // API Routes (Updated for normalized SQL)
  app.get("/api/sneakers", (req, res) => {
    const categoryName = req.query.category;
    let sneakers;
    if (categoryName && categoryName !== "all") {
      sneakers = db.prepare(`
        SELECT s.*, c.name as category 
        FROM sneakers s
        JOIN categories c ON s.category_id = c.id
        WHERE c.name = ?
      `).all(categoryName);
    } else {
      sneakers = db.prepare(`
        SELECT s.*, c.name as category 
        FROM sneakers s
        JOIN categories c ON s.category_id = c.id
      `).all();
    }
    res.json(sneakers);
  });

  app.get("/api/sneakers/:id", (req, res) => {
    const sneaker = db.prepare(`
      SELECT s.*, c.name as category 
      FROM sneakers s
      JOIN categories c ON s.category_id = c.id
      WHERE s.id = ?
    `).get(req.params.id);
    if (sneaker) res.json(sneaker);
    else res.status(404).json({ error: "Sneaker not found" });
  });

  app.get("/api/stats", (req, res) => {
    // Technical Mastery: Fetching from the SQL VIEW
    const stats = db.prepare(`SELECT name, model_count as value FROM v_category_analytics`).all();
    res.json(stats);
  });

  app.get("/api/inventory", (req, res) => {
    const totalItems = db.prepare("SELECT SUM(stock) as total FROM sneakers").get() as { total: number };
    const stashedItems = db.prepare("SELECT count(*) as count FROM stash").get() as { count: number };
    res.json({ totalItems: totalItems.total, stashedItems: stashedItems.count });
  });

  app.post("/api/stash", (req, res) => {
    const { sneakerId } = req.body;
    try {
      const sneaker = db.prepare("SELECT stock FROM sneakers WHERE id = ?").get(sneakerId) as { stock: number };
      if (!sneaker) return res.status(404).json({ error: "Not found" });
      if (sneaker.stock <= 0) return res.status(400).json({ error: "Out of stock" });

      const transaction = db.transaction(() => {
        // Decrease stock in sneakers table
        db.prepare("UPDATE sneakers SET stock = stock - 1 WHERE id = ?").run(sneakerId);
        // Add to stash
        db.prepare("INSERT INTO stash (sneaker_id) VALUES (?)").run(sneakerId);
      });
      transaction();

      res.json({ success: true, message: "Asset secured in SQL ledger" });
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  });

  app.delete("/api/stash/:id", (req, res) => {
    const stashId = req.params.id;
    try {
      const item = db.prepare("SELECT sneaker_id FROM stash WHERE id = ?").get(stashId) as { sneaker_id: number };
      if (!item) return res.status(404).json({ error: "Not found" });

      const transaction = db.transaction(() => {
        db.prepare("UPDATE sneakers SET stock = stock + 1 WHERE id = ?").run(item.sneaker_id);
        db.prepare("DELETE FROM stash WHERE id = ?").run(stashId);
      });
      transaction();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  });

  app.get("/api/stash-items", (req, res) => {
    const items = db.prepare(`
      SELECT st.id as stash_id, s.*
      FROM stash st
      JOIN sneakers s ON st.sneaker_id = s.id
      ORDER BY st.added_at DESC
    `).all();
    res.json(items);
  });

  app.post("/api/checkout", (req, res) => {
    const { cardNumber, expiry, cvv, holder } = req.body;
    // Simulate real gateway delay
    setTimeout(() => {
      try {
        const count = db.prepare("SELECT count(*) as count FROM stash").get() as { count: number };
        if (count.count === 0) return res.status(400).json({ error: "Vault empty" });

        // In a real app, we'd record an order here.
        // For this demo, we just clear the stash as "acquired"
        db.prepare("DELETE FROM stash").run();
        
        res.json({ 
          success: true, 
          transactionId: "TX-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
          message: "Payment Authenticated. Title of ownership transferred." 
        });
      } catch (err) {
        res.status(500).json({ error: "Checkout failed" });
      }
    }, 2000);
  });

  app.post("/api/admin/refill", (req, res) => {
    try {
      db.prepare("UPDATE sneakers SET stock = stock + 100").run();
      res.json({ success: true, message: "Global stock inventory replenished by 100 units per line item." });
    } catch (err) {
      res.status(500).json({ error: "Refill failed" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
