/**
 * Seed script -run with:
 *   npx tsx scripts/seed.ts
 *
 * Populates the Dinely Supabase database with:
 *  - 1 owner user + restaurant
 *  - Menu items for that restaurant
 *  - Tables
 *  - Employees
 *  - Sample orders
 *  - Sample bookings
 *  - Sample reviews
 *  - 2 customer users
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Supabase env vars not set in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function hash(p: string) {
  return bcrypt.hash(p, 12);
}

async function seed() {
  console.log("🌱  Connecting to Supabase…");

  // ── Drop existing seed data (idempotent) ─────────────────────────────────
  const tables = [
    "reviews",
    "bookings",
    "orders",
    "employees",
    "restaurant_tables",
    "menu_items",
    "restaurants",
    "users",
  ];
  for (const t of tables) {
    await supabase
      .from(t)
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    console.log(`   cleared ${t}`);
  }

  // ── 1. Owner user ─────────────────────────────────────────────────────────
  const ownerPasswordHash = await hash("password123");
  const { data: ownerResult, error: ownerError } = await supabase
    .from("users")
    .insert({
      first_name: "Robert",
      last_name: "Fisher",
      email: "owner@dinely.com",
      phone: "+250784133293",
      password_hash: ownerPasswordHash,
      role: "owner",
      favourites: [],
    })
    .select("id")
    .single();

  if (ownerError || !ownerResult) {
    console.error("Failed to create owner:", ownerError);
    process.exit(1);
  }
  const ownerId = ownerResult.id;
  console.log("✅  Owner user created:", ownerId);

  // ── 2. Restaurant ─────────────────────────────────────────────────────────
  const { data: restResult, error: restError } = await supabase
    .from("restaurants")
    .insert({
      owner_id: ownerId,
      name: "The Golden Plate",
      type: "Burgers & American",
      address: "KN 5 Rd, Kigali, Rwanda",
      opening_hours: "10:45 – 20:30",
      phone: "+250245253342",
      email: "contact@goldenplate.com",
      logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
      description:
        "This upscale dining destination is celebrated for its modern, innovative cuisine that frequently pushes culinary boundaries. A must-visit in Kigali.",
      plan: "Professional",
      billing_cycle: "monthly",
      subscription_status: "active",
      rating: 4.6,
      review_count: 12,
    })
    .select("id")
    .single();

  if (restError || !restResult) {
    console.error("Failed to create restaurant:", restError);
    process.exit(1);
  }
  const restaurantId = restResult.id;
  console.log("✅  Restaurant created:", restaurantId);

  // Link restaurant to owner
  await supabase
    .from("users")
    .update({ restaurant_id: restaurantId })
    .eq("id", ownerId);

  // ── 3. Menu items ─────────────────────────────────────────────────────────
  const menuItems = [
    {
      restaurant_id: restaurantId,
      name: "Herb-Roasted Chicken",
      category: "Main Course",
      price: 25.98,
      description:
        "Roasted chicken breast seasoned with aromatic herbs like rosemary and thyme, served with seasonal vegetables.",
      image:
        "https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=400&q=80",
      meal_times: ["Lunch", "Dinner"],
      price_range: "$20 - $30",
      rating: 4.7,
      reviews: 45,
      orders: 182,
      favourites: 67,
      available: true,
    },
    {
      restaurant_id: restaurantId,
      name: "Crispy Chicken Noodles",
      category: "Main Course",
      price: 14.98,
      description:
        "Stir-fried noodles topped with sliced, breaded and fried chicken in a savory sauce.",
      image:
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
      meal_times: ["Lunch", "Dinner"],
      price_range: "$10 - $20",
      rating: 4.5,
      reviews: 38,
      orders: 134,
      favourites: 52,
      available: true,
    },
    {
      restaurant_id: restaurantId,
      name: "Pepperoni Pizza",
      category: "Main Course",
      price: 11.0,
      description:
        "Thin crust pizza with zesty tomato sauce, mozzarella cheese, and premium pepperoni.",
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
      meal_times: ["Lunch", "Dinner"],
      price_range: "$10 - $20",
      promo: "10% off",
      rating: 4.8,
      reviews: 89,
      orders: 245,
      favourites: 101,
      available: true,
    },
    {
      restaurant_id: restaurantId,
      name: "Garlic Bread",
      category: "Starters",
      price: 5.99,
      description:
        "Toasted sourdough brushed with herb garlic butter and fresh parsley.",
      image:
        "https://images.unsplash.com/photo-1619531040576-f9416740661f?w=400&q=80",
      meal_times: ["Lunch", "Dinner"],
      price_range: "$5 - $10",
      rating: 4.3,
      reviews: 22,
      orders: 78,
      favourites: 30,
      available: true,
    },
    {
      restaurant_id: restaurantId,
      name: "Spicy Chicken Wings",
      category: "Starters",
      price: 9.99,
      description:
        "Crispy fried wings tossed in our house buffalo sauce, served with blue cheese dip.",
      image:
        "https://images.unsplash.com/photo-1608039755401-85383b23c0c8?w=400&q=80",
      meal_times: ["Lunch", "Dinner", "Snack"],
      price_range: "$5 - $10",
      rating: 4.6,
      reviews: 55,
      orders: 198,
      favourites: 82,
      available: true,
    },
    {
      restaurant_id: restaurantId,
      name: "Classic Beef Burger",
      category: "Burgers",
      price: 13.5,
      description:
        "Juicy beef patty with fresh lettuce, tomato, pickles, and our signature sauce on a toasted brioche bun.",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
      meal_times: ["Lunch", "Dinner"],
      price_range: "$10 - $20",
      promo: "Buy 1 get 1 free",
      rating: 4.8,
      reviews: 120,
      orders: 310,
      favourites: 140,
      available: true,
    },
    {
      restaurant_id: restaurantId,
      name: "Caesar Salad",
      category: "Salads",
      price: 8.5,
      description:
        "Crisp romaine lettuce with shaved parmesan, croutons, and classic Caesar dressing.",
      image:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80",
      meal_times: ["Lunch"],
      price_range: "$5 - $10",
      rating: 4.2,
      reviews: 28,
      orders: 67,
      favourites: 24,
      available: true,
    },
    {
      restaurant_id: restaurantId,
      name: "Chocolate Lava Cake",
      category: "Desserts",
      price: 7.5,
      description:
        "Warm chocolate cake with a gooey molten center, served with a scoop of vanilla ice cream.",
      image:
        "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80",
      meal_times: ["Dinner", "Snack"],
      price_range: "$5 - $10",
      rating: 4.9,
      reviews: 67,
      orders: 89,
      favourites: 73,
      available: true,
    },
  ];

  const { data: menuResult, error: menuError } = await supabase
    .from("menu_items")
    .insert(menuItems)
    .select("id");

  if (menuError) {
    console.error("Failed to create menu items:", menuError);
    process.exit(1);
  }
  const menuIds = (menuResult || []).map((m) => m.id);
  console.log("✅  Menu items created:", menuIds.length);

  // ── 4. Tables ─────────────────────────────────────────────────────────────
  const tableData = [
    {
      restaurant_id: restaurantId,
      number: 1,
      capacity: 2,
      location: "Window",
      status: "available",
    },
    {
      restaurant_id: restaurantId,
      number: 2,
      capacity: 4,
      location: "Main Hall",
      status: "available",
    },
    {
      restaurant_id: restaurantId,
      number: 3,
      capacity: 4,
      location: "Main Hall",
      status: "occupied",
    },
    {
      restaurant_id: restaurantId,
      number: 4,
      capacity: 6,
      location: "Terrace",
      status: "available",
    },
    {
      restaurant_id: restaurantId,
      number: 5,
      capacity: 6,
      location: "Terrace",
      status: "reserved",
    },
    {
      restaurant_id: restaurantId,
      number: 6,
      capacity: 8,
      location: "Private Room",
      status: "available",
    },
    {
      restaurant_id: restaurantId,
      number: 7,
      capacity: 2,
      location: "Bar",
      status: "available",
    },
    {
      restaurant_id: restaurantId,
      number: 8,
      capacity: 4,
      location: "Main Hall",
      status: "occupied",
    },
  ];

  const { error: tablesError } = await supabase
    .from("restaurant_tables")
    .insert(tableData);
  if (tablesError) console.error("Tables insert error:", tablesError);
  console.log("✅  Tables created:", tableData.length);

  // ── 5. Employees ──────────────────────────────────────────────────────────
  const employeeData = [
    {
      restaurant_id: restaurantId,
      first_name: "Jean",
      last_name: "Mutabazi",
      email: "jean.mutabazi@goldenplate.com",
      phone: "+250788001001",
      role: "Head Chef",
      salary: 800,
      start_date: "2023-01-15",
    },
    {
      restaurant_id: restaurantId,
      first_name: "Amina",
      last_name: "Uwase",
      email: "amina.uwase@goldenplate.com",
      phone: "+250788001002",
      role: "Sous Chef",
      salary: 600,
      start_date: "2023-03-01",
    },
    {
      restaurant_id: restaurantId,
      first_name: "Patrick",
      last_name: "Nkurunziza",
      email: "patrick@goldenplate.com",
      phone: "+250788001003",
      role: "Waiter",
      salary: 350,
      start_date: "2023-06-10",
    },
    {
      restaurant_id: restaurantId,
      first_name: "Grace",
      last_name: "Iradukunda",
      email: "grace@goldenplate.com",
      phone: "+250788001004",
      role: "Cashier",
      salary: 380,
      start_date: "2023-09-01",
    },
    {
      restaurant_id: restaurantId,
      first_name: "Eric",
      last_name: "Habimana",
      email: "eric@goldenplate.com",
      phone: "+250788001005",
      role: "Waiter",
      salary: 350,
      start_date: "2024-01-20",
    },
  ];

  const { error: empError } = await supabase
    .from("employees")
    .insert(employeeData);
  if (empError) console.error("Employees insert error:", empError);
  console.log("✅  Employees created:", employeeData.length);

  // ── 6. Customer users ──────────────────────────────────────────────────────
  const custPass = await hash("password123");
  const { data: custResult, error: custError } = await supabase
    .from("users")
    .insert([
      {
        first_name: "Peterson",
        last_name: "Mugabo",
        email: "customer@dinely.com",
        phone: "+250784000001",
        password_hash: custPass,
        role: "customer",
        favourites: [restaurantId],
      },
      {
        first_name: "Alice",
        last_name: "Ndizeye",
        email: "alice@dinely.com",
        phone: "+250784000002",
        password_hash: custPass,
        role: "customer",
        favourites: [],
      },
    ])
    .select("id");

  if (custError || !custResult) {
    console.error("Failed to create customers:", custError);
    process.exit(1);
  }
  const cust1Id = custResult[0].id;
  const cust2Id = custResult[1].id;
  console.log("✅  Customer users created:", custResult.length);

  // ── 7. Orders ──────────────────────────────────────────────────────────────
  const now = new Date();
  const daysAgo = (d: number) =>
    new Date(now.getTime() - d * 86400000).toISOString();

  const orderData = [
    {
      restaurant_id: restaurantId,
      customer_id: cust1Id,
      customer_name: "Peterson Mugabo",
      items: [
        {
          menuItemId: menuIds[0],
          name: "Herb-Roasted Chicken",
          price: 25.98,
          quantity: 1,
        },
        {
          menuItemId: menuIds[3],
          name: "Garlic Bread",
          price: 5.99,
          quantity: 2,
        },
      ],
      type: "Delivery",
      status: "Completed",
      total: 37.96,
      delivery_address: "KG 7 Ave, Kigali",
      created_at: daysAgo(1),
      updated_at: daysAgo(1),
    },
    {
      restaurant_id: restaurantId,
      customer_id: cust1Id,
      customer_name: "Peterson Mugabo",
      items: [
        {
          menuItemId: menuIds[5],
          name: "Classic Beef Burger",
          price: 13.5,
          quantity: 2,
        },
        {
          menuItemId: menuIds[4],
          name: "Spicy Chicken Wings",
          price: 9.99,
          quantity: 1,
        },
      ],
      type: "Delivery",
      status: "Completed",
      total: 36.99,
      delivery_address: "KG 7 Ave, Kigali",
      created_at: daysAgo(3),
      updated_at: daysAgo(3),
    },
    {
      restaurant_id: restaurantId,
      customer_id: cust2Id,
      customer_name: "Alice Ndizeye",
      items: [
        {
          menuItemId: menuIds[2],
          name: "Pepperoni Pizza",
          price: 11.0,
          quantity: 1,
        },
        {
          menuItemId: menuIds[7],
          name: "Chocolate Lava Cake",
          price: 7.5,
          quantity: 1,
        },
      ],
      type: "Dine-in",
      status: "Completed",
      total: 18.5,
      created_at: daysAgo(5),
      updated_at: daysAgo(5),
    },
    {
      restaurant_id: restaurantId,
      customer_id: cust1Id,
      customer_name: "Peterson Mugabo",
      items: [
        {
          menuItemId: menuIds[1],
          name: "Crispy Chicken Noodles",
          price: 14.98,
          quantity: 3,
        },
      ],
      type: "Takeaway",
      status: "Completed",
      total: 44.94,
      created_at: daysAgo(7),
      updated_at: daysAgo(7),
    },
    {
      restaurant_id: restaurantId,
      customer_id: cust2Id,
      customer_name: "Alice Ndizeye",
      items: [
        {
          menuItemId: menuIds[5],
          name: "Classic Beef Burger",
          price: 13.5,
          quantity: 1,
        },
        {
          menuItemId: menuIds[6],
          name: "Caesar Salad",
          price: 8.5,
          quantity: 1,
        },
      ],
      type: "Delivery",
      status: "Active",
      total: 22.0,
      delivery_address: "KN 3 Rd, Kigali",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      restaurant_id: restaurantId,
      customer_id: cust1Id,
      customer_name: "Peterson Mugabo",
      items: [
        {
          menuItemId: menuIds[0],
          name: "Herb-Roasted Chicken",
          price: 25.98,
          quantity: 2,
        },
        {
          menuItemId: menuIds[4],
          name: "Spicy Chicken Wings",
          price: 9.99,
          quantity: 1,
        },
      ],
      type: "Delivery",
      status: "Pending",
      total: 61.95,
      delivery_address: "KG 7 Ave, Kigali",
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    // Extra orders for analytics
    ...Array.from({ length: 10 }, (_, i) => ({
      restaurant_id: restaurantId,
      customer_id: cust1Id,
      customer_name: "Peterson Mugabo",
      items: [
        {
          menuItemId: menuIds[i % menuIds.length],
          name: menuItems[i % menuItems.length].name,
          price: menuItems[i % menuItems.length].price,
          quantity: 1,
        },
      ],
      type: "Delivery" as const,
      status: "Completed" as const,
      total: menuItems[i % menuItems.length].price,
      delivery_address: "KG 7 Ave, Kigali",
      created_at: daysAgo(8 + i * 2),
      updated_at: daysAgo(8 + i * 2),
    })),
  ];

  const { error: ordersError } = await supabase
    .from("orders")
    .insert(orderData);
  if (ordersError) console.error("Orders insert error:", ordersError);
  console.log("✅  Orders created:", orderData.length);

  // ── 8. Bookings ────────────────────────────────────────────────────────────
  const bookingData = [
    {
      restaurant_id: restaurantId,
      customer_id: cust1Id,
      customer_name: "Peterson Mugabo",
      customer_email: "customer@dinely.com",
      date: "2026-06-20",
      time: "19:00",
      party_size: 4,
      status: "Confirmed",
      notes: "Window seat preferred",
      created_at: daysAgo(2),
      updated_at: daysAgo(2),
    },
    {
      restaurant_id: restaurantId,
      customer_id: cust2Id,
      customer_name: "Alice Ndizeye",
      customer_email: "alice@dinely.com",
      date: "2026-06-22",
      time: "13:00",
      party_size: 2,
      status: "Pending",
      created_at: daysAgo(1),
      updated_at: daysAgo(1),
    },
    {
      restaurant_id: restaurantId,
      customer_id: cust1Id,
      customer_name: "Peterson Mugabo",
      customer_email: "customer@dinely.com",
      date: "2026-06-15",
      time: "20:00",
      party_size: 6,
      status: "Completed",
      notes: "Anniversary dinner",
      created_at: daysAgo(10),
      updated_at: daysAgo(10),
    },
  ];

  const { error: bookingsError } = await supabase
    .from("bookings")
    .insert(bookingData);
  if (bookingsError) console.error("Bookings insert error:", bookingsError);
  console.log("✅  Bookings created:", bookingData.length);

  // ── 9. Reviews ─────────────────────────────────────────────────────────────
  const reviewData = [
    {
      restaurant_id: restaurantId,
      customer_id: cust1Id,
      customer_name: "Peterson Mugabo",
      rating: 5,
      comment:
        "Absolutely fantastic food! The herb-roasted chicken was perfectly cooked, juicy and full of flavor. Service was attentive and the ambiance was wonderful.",
      helpful: 12,
      created_at: daysAgo(2),
      updated_at: daysAgo(2),
    },
    {
      restaurant_id: restaurantId,
      customer_id: cust2Id,
      customer_name: "Alice Ndizeye",
      rating: 4,
      comment:
        "Great spot for a nice dinner. The pizza was crispy and delicious. Slightly long wait time but the food made up for it. Portions are generous.",
      helpful: 7,
      created_at: daysAgo(5),
      updated_at: daysAgo(5),
    },
  ];

  const { error: reviewsError } = await supabase
    .from("reviews")
    .insert(reviewData);
  if (reviewsError) console.error("Reviews insert error:", reviewsError);
  console.log("✅  Reviews created:", reviewData.length);

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
