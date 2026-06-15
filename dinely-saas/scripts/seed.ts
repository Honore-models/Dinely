/**
 * Seed script — run with:
 *   npx tsx scripts/seed.ts
 *
 * Populates the Dinely MongoDB database with:
 *  - 1 owner user + restaurant
 *  - Menu items for that restaurant
 *  - Tables
 *  - Employees
 *  - Sample orders
 *  - Sample bookings
 *  - Sample reviews
 *  - 2 customer users
 */

import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DB || "dinely";

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

async function hash(p: string) {
  return bcrypt.hash(p, 12);
}

async function seed() {
  console.log("🌱  Connecting to MongoDB…");
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  // ── Drop existing seed data (idempotent) ─────────────────────────────────
  const collectionsToClean = [
    "users", "restaurants", "menu_items", "tables",
    "employees", "orders", "bookings", "reviews",
  ];
  for (const col of collectionsToClean) {
    await db.collection(col).deleteMany({});
    console.log(`   cleared ${col}`);
  }

  // ── 1. Owner user ─────────────────────────────────────────────────────────
  const ownerPasswordHash = await hash("password123");
  const ownerResult = await db.collection("users").insertOne({
    firstName: "Robert",
    lastName: "Fisher",
    email: "owner@dinely.com",
    phone: "+250784133293",
    passwordHash: ownerPasswordHash,
    role: "owner",
    favourites: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const ownerId = ownerResult.insertedId.toString();
  console.log("✅  Owner user created:", ownerId);

  // ── 2. Restaurant ─────────────────────────────────────────────────────────
  const restResult = await db.collection("restaurants").insertOne({
    ownerId,
    name: "The Golden Plate",
    type: "Burgers & American",
    address: "KN 5 Rd, Kigali, Rwanda",
    openingHours: "10:45 – 20:30",
    phone: "+250245253342",
    email: "contact@goldenplate.com",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    description:
      "This upscale dining destination is celebrated for its modern, innovative cuisine that frequently pushes culinary boundaries. A must-visit in Kigali.",
    plan: "Professional",
    billingCycle: "monthly",
    subscriptionStatus: "active",
    rating: 4.6,
    reviewCount: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const restaurantId = restResult.insertedId.toString();
  console.log("✅  Restaurant created:", restaurantId);

  // Link restaurant to owner
  await db.collection("users").updateOne(
    { _id: new ObjectId(ownerId) },
    { $set: { restaurantId, updatedAt: new Date() } },
  );

  // ── 3. Menu items ─────────────────────────────────────────────────────────
  const menuItems = [
    {
      restaurantId,
      name: "Herb-Roasted Chicken",
      category: "Main Course",
      price: 25.98,
      description: "Roasted chicken breast seasoned with aromatic herbs like rosemary and thyme, served with seasonal vegetables.",
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=400&q=80",
      mealTimes: ["Lunch", "Dinner"],
      priceRange: "$20 - $30",
      rating: 4.7,
      reviews: 45,
      orders: 182,
      favourites: 67,
      available: true,
    },
    {
      restaurantId,
      name: "Crispy Chicken Noodles",
      category: "Main Course",
      price: 14.98,
      description: "Stir-fried noodles topped with sliced, breaded and fried chicken in a savory sauce.",
      image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
      mealTimes: ["Lunch", "Dinner"],
      priceRange: "$10 - $20",
      rating: 4.5,
      reviews: 38,
      orders: 134,
      favourites: 52,
      available: true,
    },
    {
      restaurantId,
      name: "Pepperoni Pizza",
      category: "Main Course",
      price: 11.0,
      description: "Thin crust pizza with zesty tomato sauce, mozzarella cheese, and premium pepperoni.",
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
      mealTimes: ["Lunch", "Dinner"],
      priceRange: "$10 - $20",
      promo: "10% off",
      rating: 4.8,
      reviews: 89,
      orders: 245,
      favourites: 101,
      available: true,
    },
    {
      restaurantId,
      name: "Garlic Bread",
      category: "Starters",
      price: 5.99,
      description: "Toasted sourdough brushed with herb garlic butter and fresh parsley.",
      image: "https://images.unsplash.com/photo-1619531040576-f9416740661f?w=400&q=80",
      mealTimes: ["Lunch", "Dinner"],
      priceRange: "$5 - $10",
      rating: 4.3,
      reviews: 22,
      orders: 78,
      favourites: 30,
      available: true,
    },
    {
      restaurantId,
      name: "Spicy Chicken Wings",
      category: "Starters",
      price: 9.99,
      description: "Crispy fried wings tossed in our house buffalo sauce, served with blue cheese dip.",
      image: "https://images.unsplash.com/photo-1608039755401-85383b23c0c8?w=400&q=80",
      mealTimes: ["Lunch", "Dinner", "Snack"],
      priceRange: "$5 - $10",
      rating: 4.6,
      reviews: 55,
      orders: 198,
      favourites: 82,
      available: true,
    },
    {
      restaurantId,
      name: "Classic Beef Burger",
      category: "Burgers",
      price: 13.5,
      description: "Juicy beef patty with fresh lettuce, tomato, pickles, and our signature sauce on a toasted brioche bun.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
      mealTimes: ["Lunch", "Dinner"],
      priceRange: "$10 - $20",
      promo: "Buy 1 get 1 free",
      rating: 4.8,
      reviews: 120,
      orders: 310,
      favourites: 140,
      available: true,
    },
    {
      restaurantId,
      name: "Caesar Salad",
      category: "Salads",
      price: 8.5,
      description: "Crisp romaine lettuce with shaved parmesan, croutons, and classic Caesar dressing.",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80",
      mealTimes: ["Lunch"],
      priceRange: "$5 - $10",
      rating: 4.2,
      reviews: 28,
      orders: 67,
      favourites: 24,
      available: true,
    },
    {
      restaurantId,
      name: "Chocolate Lava Cake",
      category: "Desserts",
      price: 7.5,
      description: "Warm chocolate cake with a gooey molten center, served with a scoop of vanilla ice cream.",
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80",
      mealTimes: ["Dinner", "Snack"],
      priceRange: "$5 - $10",
      rating: 4.9,
      reviews: 67,
      orders: 89,
      favourites: 73,
      available: true,
    },
  ];

  const menuResult = await db.collection("menu_items").insertMany(
    menuItems.map((item) => ({ ...item, createdAt: new Date(), updatedAt: new Date() })),
  );
  const menuIds = Object.values(menuResult.insertedIds).map((id) => id.toString());
  console.log("✅  Menu items created:", menuIds.length);

  // ── 4. Tables ─────────────────────────────────────────────────────────────
  const tables = [
    { number: 1, capacity: 2, location: "Window", status: "available" },
    { number: 2, capacity: 4, location: "Main Hall", status: "available" },
    { number: 3, capacity: 4, location: "Main Hall", status: "occupied" },
    { number: 4, capacity: 6, location: "Terrace", status: "available" },
    { number: 5, capacity: 6, location: "Terrace", status: "reserved" },
    { number: 6, capacity: 8, location: "Private Room", status: "available" },
    { number: 7, capacity: 2, location: "Bar", status: "available" },
    { number: 8, capacity: 4, location: "Main Hall", status: "occupied" },
  ];

  await db.collection("tables").insertMany(
    tables.map((t) => ({ ...t, restaurantId, createdAt: new Date(), updatedAt: new Date() })),
  );
  console.log("✅  Tables created:", tables.length);

  // ── 5. Employees ──────────────────────────────────────────────────────────
  const employees = [
    { firstName: "Jean", lastName: "Mutabazi", email: "jean.mutabazi@goldenplate.com", phone: "+250788001001", role: "Head Chef", salary: 800, startDate: "2023-01-15" },
    { firstName: "Amina", lastName: "Uwase", email: "amina.uwase@goldenplate.com", phone: "+250788001002", role: "Sous Chef", salary: 600, startDate: "2023-03-01" },
    { firstName: "Patrick", lastName: "Nkurunziza", email: "patrick@goldenplate.com", phone: "+250788001003", role: "Waiter", salary: 350, startDate: "2023-06-10" },
    { firstName: "Grace", lastName: "Iradukunda", email: "grace@goldenplate.com", phone: "+250788001004", role: "Cashier", salary: 380, startDate: "2023-09-01" },
    { firstName: "Eric", lastName: "Habimana", email: "eric@goldenplate.com", phone: "+250788001005", role: "Waiter", salary: 350, startDate: "2024-01-20" },
  ];

  await db.collection("employees").insertMany(
    employees.map((e) => ({ ...e, restaurantId, createdAt: new Date(), updatedAt: new Date() })),
  );
  console.log("✅  Employees created:", employees.length);

  // ── 6. Customer users ──────────────────────────────────────────────────────
  const custPass = await hash("password123");
  const custResult = await db.collection("users").insertMany([
    {
      firstName: "Peterson",
      lastName: "Mugabo",
      email: "customer@dinely.com",
      phone: "+250784000001",
      passwordHash: custPass,
      role: "customer",
      favourites: [restaurantId],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: "Alice",
      lastName: "Ndizeye",
      email: "alice@dinely.com",
      phone: "+250784000002",
      passwordHash: custPass,
      role: "customer",
      favourites: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const custIds = Object.values(custResult.insertedIds);
  const cust1Id = custIds[0].toString();
  const cust2Id = custIds[1].toString();
  console.log("✅  Customer users created:", custIds.length);

  // ── 7. Orders ──────────────────────────────────────────────────────────────
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

  const orders = [
    {
      restaurantId, customerId: cust1Id, customerName: "Peterson Mugabo",
      items: [
        { menuItemId: menuIds[0], name: "Herb-Roasted Chicken", price: 25.98, quantity: 1 },
        { menuItemId: menuIds[3], name: "Garlic Bread", price: 5.99, quantity: 2 },
      ],
      type: "Delivery", status: "Completed", total: 37.96,
      deliveryAddress: "KG 7 Ave, Kigali", createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      restaurantId, customerId: cust1Id, customerName: "Peterson Mugabo",
      items: [
        { menuItemId: menuIds[5], name: "Classic Beef Burger", price: 13.5, quantity: 2 },
        { menuItemId: menuIds[4], name: "Spicy Chicken Wings", price: 9.99, quantity: 1 },
      ],
      type: "Delivery", status: "Completed", total: 36.99,
      deliveryAddress: "KG 7 Ave, Kigali", createdAt: daysAgo(3), updatedAt: daysAgo(3),
    },
    {
      restaurantId, customerId: cust2Id, customerName: "Alice Ndizeye",
      items: [
        { menuItemId: menuIds[2], name: "Pepperoni Pizza", price: 11.0, quantity: 1 },
        { menuItemId: menuIds[7], name: "Chocolate Lava Cake", price: 7.5, quantity: 1 },
      ],
      type: "Dine-in", status: "Completed", total: 18.5,
      createdAt: daysAgo(5), updatedAt: daysAgo(5),
    },
    {
      restaurantId, customerId: cust1Id, customerName: "Peterson Mugabo",
      items: [
        { menuItemId: menuIds[1], name: "Crispy Chicken Noodles", price: 14.98, quantity: 3 },
      ],
      type: "Takeaway", status: "Completed", total: 44.94,
      createdAt: daysAgo(7), updatedAt: daysAgo(7),
    },
    {
      restaurantId, customerId: cust2Id, customerName: "Alice Ndizeye",
      items: [
        { menuItemId: menuIds[5], name: "Classic Beef Burger", price: 13.5, quantity: 1 },
        { menuItemId: menuIds[6], name: "Caesar Salad", price: 8.5, quantity: 1 },
      ],
      type: "Delivery", status: "Active", total: 22.0,
      deliveryAddress: "KN 3 Rd, Kigali", createdAt: daysAgo(0), updatedAt: daysAgo(0),
    },
    {
      restaurantId, customerId: cust1Id, customerName: "Peterson Mugabo",
      items: [
        { menuItemId: menuIds[0], name: "Herb-Roasted Chicken", price: 25.98, quantity: 2 },
        { menuItemId: menuIds[4], name: "Spicy Chicken Wings", price: 9.99, quantity: 1 },
      ],
      type: "Delivery", status: "Pending", total: 61.95,
      deliveryAddress: "KG 7 Ave, Kigali", createdAt: new Date(), updatedAt: new Date(),
    },
    // Orders from last 30 days for analytics
    ...Array.from({ length: 10 }, (_, i) => ({
      restaurantId, customerId: cust1Id, customerName: "Peterson Mugabo",
      items: [{ menuItemId: menuIds[i % menuIds.length], name: menuItems[i % menuItems.length].name, price: menuItems[i % menuItems.length].price, quantity: 1 }],
      type: "Delivery" as const, status: "Completed" as const,
      total: menuItems[i % menuItems.length].price,
      deliveryAddress: "KG 7 Ave, Kigali",
      createdAt: daysAgo(8 + i * 2), updatedAt: daysAgo(8 + i * 2),
    })),
  ];

  await db.collection("orders").insertMany(orders);
  console.log("✅  Orders created:", orders.length);

  // ── 8. Bookings ────────────────────────────────────────────────────────────
  const bookings = [
    {
      restaurantId, customerId: cust1Id, customerName: "Peterson Mugabo",
      customerEmail: "customer@dinely.com",
      date: "2026-06-20", time: "19:00", partySize: 4,
      status: "Confirmed", notes: "Window seat preferred",
      createdAt: daysAgo(2), updatedAt: daysAgo(2),
    },
    {
      restaurantId, customerId: cust2Id, customerName: "Alice Ndizeye",
      customerEmail: "alice@dinely.com",
      date: "2026-06-22", time: "13:00", partySize: 2,
      status: "Pending",
      createdAt: daysAgo(1), updatedAt: daysAgo(1),
    },
    {
      restaurantId, customerId: cust1Id, customerName: "Peterson Mugabo",
      customerEmail: "customer@dinely.com",
      date: "2026-06-15", time: "20:00", partySize: 6,
      status: "Completed", notes: "Anniversary dinner",
      createdAt: daysAgo(10), updatedAt: daysAgo(10),
    },
  ];

  await db.collection("bookings").insertMany(bookings);
  console.log("✅  Bookings created:", bookings.length);

  // ── 9. Reviews ─────────────────────────────────────────────────────────────
  const reviews = [
    {
      restaurantId, customerId: cust1Id, customerName: "Peterson Mugabo",
      rating: 5, comment: "Absolutely fantastic food! The herb-roasted chicken was perfectly cooked, juicy and full of flavor. Service was attentive and the ambiance was wonderful.",
      helpful: 12, createdAt: daysAgo(2), updatedAt: daysAgo(2),
    },
    {
      restaurantId, customerId: cust2Id, customerName: "Alice Ndizeye",
      rating: 4, comment: "Great spot for a nice dinner. The pizza was crispy and delicious. Slightly long wait time but the food made up for it. Portions are generous.",
      helpful: 7, createdAt: daysAgo(5), updatedAt: daysAgo(5),
    },
  ];

  await db.collection("reviews").insertMany(reviews);
  console.log("✅  Reviews created:", reviews.length);

  // ── Create indexes ─────────────────────────────────────────────────────────
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("orders").createIndex({ restaurantId: 1, createdAt: -1 });
  await db.collection("orders").createIndex({ customerId: 1, createdAt: -1 });
  await db.collection("bookings").createIndex({ restaurantId: 1, date: 1 });
  await db.collection("menu_items").createIndex({ restaurantId: 1, category: 1 });
  await db.collection("reviews").createIndex({ restaurantId: 1 });
  await db.collection("reviews").createIndex({ restaurantId: 1, customerId: 1 }, { unique: true });
  await db.collection("tables").createIndex({ restaurantId: 1, number: 1 }, { unique: true });
  await db.collection("employees").createIndex({ restaurantId: 1, email: 1 }, { unique: true });
  console.log("✅  Indexes created");

  await client.close();

  console.log("\n🎉  Seed complete!");
  console.log("─────────────────────────────────────");
  console.log("Owner login:    owner@dinely.com  /  password123");
  console.log("Customer login: customer@dinely.com  /  password123");
  console.log("─────────────────────────────────────");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
