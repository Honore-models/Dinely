/**
 * Seed script — run with:
 *   npx tsx scripts/seed.ts
 *
 * Smart seeding:
 *  - If an owner + restaurant already exist (from onboarding), seeds data for THAT restaurant
 *  - If nothing exists, creates a demo owner + restaurant + all seed data
 *  - Idempotent: safe to run multiple times (skips if data already exists)
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌  Supabase env vars not set in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function hash(p: string) {
  return bcrypt.hash(p, 12);
}

function daysAgo(d: number) {
  return new Date(Date.now() - d * 86400000).toISOString();
}

async function seed() {
  console.log("🌱  Connecting to Supabase…");

  // ── Find existing owner ──────────────────────────────────────────────────
  const { data: existingOwners } = await supabase
    .from("users")
    .select("id, first_name, last_name, email, restaurant_id, avatar")
    .eq("role", "owner")
    .limit(1);

  let ownerId: string;
  let restaurantId: string;
  let isFromOnboarding = false;

  if (existingOwners && existingOwners.length > 0) {
    const owner = existingOwners[0];
    ownerId = owner.id;
    console.log(`   Found existing owner: ${owner.first_name} ${owner.last_name} (${owner.email})`);

    if (owner.restaurant_id) {
      restaurantId = owner.restaurant_id;
      isFromOnboarding = true;
      console.log(`   Found existing restaurant: ${restaurantId}`);
    } else {
      // Owner exists but no restaurant — create one from onboarding defaults
      const { data: rest } = await supabase
        .from("restaurants")
        .insert({
          owner_id: ownerId,
          name: `${owner.first_name}'s Restaurant`,
          type: "Casual Dining",
          address: "Kigali, Rwanda",
          opening_hours: "08:00 – 22:00",
          phone: "+250784000000",
          email: owner.email,
          plan: "Professional",
          billing_cycle: "monthly",
          subscription_status: "active",
          rating: 4.5,
          review_count: 0,
        })
        .select("id")
        .single();

      restaurantId = rest!.id;
      await supabase.from("users").update({ restaurant_id: restaurantId }).eq("id", ownerId);
      console.log(`   Created restaurant for owner: ${restaurantId}`);
    }
  } else {
    // ── No owner exists — create demo data from scratch ────────────────────
    console.log("   No existing data found. Creating demo account…");

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
      console.error("❌  Failed to create owner:", ownerError);
      process.exit(1);
    }
    ownerId = ownerResult.id;

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
      console.error("❌  Failed to create restaurant:", restError);
      process.exit(1);
    }
    restaurantId = restResult.id;

    await supabase.from("users").update({ restaurant_id: restaurantId }).eq("id", ownerId);
    console.log("✅  Demo owner + restaurant created");
  }

  // ── Check if menu items already exist for this restaurant ────────────────
  const { count: existingMenuCount } = await supabase
    .from("menu_items")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  if (existingMenuCount && existingMenuCount > 0) {
    console.log(`   Menu already has ${existingMenuCount} items — skipping menu seed`);
  } else {
    // ── Seed menu items ──────────────────────────────────────────────────
    const menuItems = [
      {
        restaurant_id: restaurantId,
        name: "Herb-Roasted Chicken",
        category: "Main Course",
        price: 25.98,
        description: "Roasted chicken breast seasoned with aromatic herbs like rosemary and thyme, served with seasonal vegetables.",
        image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Crispy Chicken Noodles",
        category: "Main Course",
        price: 14.98,
        description: "Stir-fried noodles topped with sliced, breaded and fried chicken in a savory sauce.",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 11.0,
        description: "Thin crust pizza with zesty tomato sauce, mozzarella cheese, and premium pepperoni.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Garlic Bread",
        category: "Starters",
        price: 5.99,
        description: "Toasted sourdough brushed with herb garlic butter and fresh parsley.",
        image: "https://images.unsplash.com/photo-1619531040576-f9416740661f?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Spicy Chicken Wings",
        category: "Starters",
        price: 9.99,
        description: "Crispy fried wings tossed in our house buffalo sauce, served with blue cheese dip.",
        image: "https://images.unsplash.com/photo-1608039755401-85383b23c0c8?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Classic Beef Burger",
        category: "Burgers",
        price: 13.5,
        description: "Juicy beef patty with fresh lettuce, tomato, pickles, and our signature sauce on a toasted brioche bun.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Caesar Salad",
        category: "Salads",
        price: 8.5,
        description: "Crisp romaine lettuce with shaved parmesan, croutons, and classic Caesar dressing.",
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Chocolate Lava Cake",
        category: "Desserts",
        price: 7.5,
        description: "Warm chocolate cake with a gooey molten center, served with a scoop of vanilla ice cream.",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Grilled Salmon",
        category: "Seafood",
        price: 22.0,
        description: "Atlantic salmon fillet grilled to perfection with lemon butter sauce and asparagus.",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Fresh Fruit Smoothie",
        category: "Drinks",
        price: 4.5,
        description: "Blended seasonal fruits with yogurt and a hint of honey.",
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80",
        available: true,
      },
    ];

    const { data: menuResult } = await supabase
      .from("menu_items")
      .insert(menuItems)
      .select("id");
    const menuIds = (menuResult || []).map((m) => m.id);
    console.log(`✅  Menu items seeded: ${menuIds.length}`);
  }

  // ── Check if tables already exist ────────────────────────────────────────
  const { count: existingTableCount } = await supabase
    .from("restaurant_tables")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  if (existingTableCount && existingTableCount > 0) {
    console.log(`   Tables already exist (${existingTableCount}) — skipping`);
  } else {
    const tableData = [
      { restaurant_id: restaurantId, number: 1, capacity: 2, location: "Window", status: "available" },
      { restaurant_id: restaurantId, number: 2, capacity: 4, location: "Main Hall", status: "available" },
      { restaurant_id: restaurantId, number: 3, capacity: 4, location: "Main Hall", status: "occupied" },
      { restaurant_id: restaurantId, number: 4, capacity: 6, location: "Terrace", status: "available" },
      { restaurant_id: restaurantId, number: 5, capacity: 6, location: "Terrace", status: "reserved" },
      { restaurant_id: restaurantId, number: 6, capacity: 8, location: "Private Room", status: "available" },
      { restaurant_id: restaurantId, number: 7, capacity: 2, location: "Bar", status: "available" },
      { restaurant_id: restaurantId, number: 8, capacity: 4, location: "Main Hall", status: "occupied" },
    ];
    const { error } = await supabase.from("restaurant_tables").insert(tableData);
    if (error) console.error("   Tables error:", error.message);
    console.log(`✅  Tables seeded: ${tableData.length}`);
  }

  // ── Check if employees already exist ─────────────────────────────────────
  const { count: existingEmpCount } = await supabase
    .from("employees")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  if (existingEmpCount && existingEmpCount > 0) {
    console.log(`   Employees already exist (${existingEmpCount}) — skipping`);
  } else {
    const employeeData = [
      { restaurant_id: restaurantId, first_name: "Jean", last_name: "Mutabazi", email: "jean.mutabazi@goldenplate.com", phone: "+250788001001", role: "Head Chef", salary: 800, start_date: "2023-01-15" },
      { restaurant_id: restaurantId, first_name: "Amina", last_name: "Uwase", email: "amina.uwase@goldenplate.com", phone: "+250788001002", role: "Sous Chef", salary: 600, start_date: "2023-03-01" },
      { restaurant_id: restaurantId, first_name: "Patrick", last_name: "Nkurunziza", email: "patrick@goldenplate.com", phone: "+250788001003", role: "Waiter", salary: 350, start_date: "2023-06-10" },
      { restaurant_id: restaurantId, first_name: "Grace", last_name: "Iradukunda", email: "grace@goldenplate.com", phone: "+250788001004", role: "Cashier", salary: 380, start_date: "2023-09-01" },
      { restaurant_id: restaurantId, first_name: "Eric", last_name: "Habimana", email: "eric@goldenplate.com", phone: "+250788001005", role: "Waiter", salary: 350, start_date: "2024-01-20" },
      { restaurant_id: restaurantId, first_name: "Diane", last_name: "Umutoni", email: "diane@goldenplate.com", phone: "+250788001006", role: "Bartender", salary: 400, start_date: "2024-03-15" },
    ];
    const { error } = await supabase.from("employees").insert(employeeData);
    if (error) console.error("   Employees error:", error.message);
    console.log(`✅  Employees seeded: ${employeeData.length}`);
  }

  // ── Check if orders already exist ────────────────────────────────────────
  const { count: existingOrderCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  if (existingOrderCount && existingOrderCount > 0) {
    console.log(`   Orders already exist (${existingOrderCount}) — skipping`);
  } else {
    // Get menu item IDs for this restaurant
    const { data: menuItems } = await supabase
      .from("menu_items")
      .select("id, name, price")
      .eq("restaurant_id", restaurantId);

    if (!menuItems || menuItems.length === 0) {
      console.log("   No menu items found — skipping order seed");
    } else {
      // Create or find customers
      const custPass = await hash("password123");
      const { data: custResult } = await supabase
        .from("users")
        .insert([
          { first_name: "Peterson", last_name: "Mugabo", email: "customer@dinely.com", phone: "+250784000001", password_hash: custPass, role: "customer", favourites: [restaurantId] },
          { first_name: "Alice", last_name: "Ndizeye", email: "alice@dinely.com", phone: "+250784000002", password_hash: custPass, role: "customer", favourites: [] },
        ])
        .select("id");

      const cust1Id = custResult?.[0]?.id;
      const cust2Id = custResult?.[1]?.id;

      if (cust1Id && cust2Id) {
        const now = new Date();
        const orderData = [
          { restaurant_id: restaurantId, customer_id: cust1Id, customer_name: "Peterson Mugabo", items: [{ menuItemId: menuItems[0].id, name: menuItems[0].name, price: menuItems[0].price, quantity: 1 }], type: "Delivery", status: "Completed", total: menuItems[0].price, delivery_address: "KG 7 Ave, Kigali", created_at: daysAgo(1), updated_at: daysAgo(1) },
          { restaurant_id: restaurantId, customer_id: cust1Id, customer_name: "Peterson Mugabo", items: [{ menuItemId: menuItems[5].id, name: menuItems[5].name, price: menuItems[5].price, quantity: 2 }], type: "Delivery", status: "Completed", total: menuItems[5].price * 2, delivery_address: "KG 7 Ave, Kigali", created_at: daysAgo(3), updated_at: daysAgo(3) },
          { restaurant_id: restaurantId, customer_id: cust2Id, customer_name: "Alice Ndizeye", items: [{ menuItemId: menuItems[2].id, name: menuItems[2].name, price: menuItems[2].price, quantity: 1 }, { menuItemId: menuItems[7].id, name: menuItems[7].name, price: menuItems[7].price, quantity: 1 }], type: "Dine-in", status: "Completed", total: menuItems[2].price + menuItems[7].price, created_at: daysAgo(5), updated_at: daysAgo(5) },
          { restaurant_id: restaurantId, customer_id: cust1Id, customer_name: "Peterson Mugabo", items: [{ menuItemId: menuItems[1].id, name: menuItems[1].name, price: menuItems[1].price, quantity: 3 }], type: "Takeaway", status: "Completed", total: menuItems[1].price * 3, created_at: daysAgo(7), updated_at: daysAgo(7) },
          { restaurant_id: restaurantId, customer_id: cust2Id, customer_name: "Alice Ndizeye", items: [{ menuItemId: menuItems[5].id, name: menuItems[5].name, price: menuItems[5].price, quantity: 1 }, { menuItemId: menuItems[6].id, name: menuItems[6].name, price: menuItems[6].price, quantity: 1 }], type: "Delivery", status: "Active", total: menuItems[5].price + menuItems[6].price, delivery_address: "KN 3 Rd, Kigali", created_at: now.toISOString(), updated_at: now.toISOString() },
          { restaurant_id: restaurantId, customer_id: cust1Id, customer_name: "Peterson Mugabo", items: [{ menuItemId: menuItems[0].id, name: menuItems[0].name, price: menuItems[0].price, quantity: 2 }, { menuItemId: menuItems[4].id, name: menuItems[4].name, price: menuItems[4].price, quantity: 1 }], type: "Delivery", status: "Pending", total: menuItems[0].price * 2 + menuItems[4].price, delivery_address: "KG 7 Ave, Kigali", created_at: now.toISOString(), updated_at: now.toISOString() },
          // Extra orders for analytics
          ...Array.from({ length: 12 }, (_, i) => ({
            restaurant_id: restaurantId,
            customer_id: i % 2 === 0 ? cust1Id : cust2Id,
            customer_name: i % 2 === 0 ? "Peterson Mugabo" : "Alice Ndizeye",
            items: [{ menuItemId: menuItems[i % menuItems.length].id, name: menuItems[i % menuItems.length].name, price: menuItems[i % menuItems.length].price, quantity: 1 }],
            type: i % 3 === 0 ? "Dine-in" : i % 3 === 1 ? "Delivery" : "Takeaway",
            status: "Completed",
            total: menuItems[i % menuItems.length].price,
            delivery_address: i % 3 === 1 ? "KG 7 Ave, Kigali" : undefined,
            created_at: daysAgo(8 + i * 2),
            updated_at: daysAgo(8 + i * 2),
          })),
        ];

        const { error } = await supabase.from("orders").insert(orderData);
        if (error) console.error("   Orders error:", error.message);
        console.log(`✅  Orders seeded: ${orderData.length}`);
      }
    }
  }

  // ── Check if bookings already exist ──────────────────────────────────────
  const { count: existingBookingCount } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  if (existingBookingCount && existingBookingCount > 0) {
    console.log(`   Bookings already exist (${existingBookingCount}) — skipping`);
  } else {
    // Get customer IDs
    const { data: customers } = await supabase
      .from("users")
      .select("id, first_name, last_name, email")
      .eq("role", "customer")
      .limit(2);

    if (customers && customers.length >= 2) {
      const bookingData = [
        { restaurant_id: restaurantId, customer_id: customers[0].id, customer_name: `${customers[0].first_name} ${customers[0].last_name}`, customer_email: customers[0].email, date: "2026-08-28", time: "19:00", party_size: 4, status: "Confirmed", notes: "Window seat preferred", created_at: daysAgo(1), updated_at: daysAgo(1) },
        { restaurant_id: restaurantId, customer_id: customers[1].id, customer_name: `${customers[1].first_name} ${customers[1].last_name}`, customer_email: customers[1].email, date: "2026-08-30", time: "13:00", party_size: 2, status: "Pending", created_at: daysAgo(0), updated_at: daysAgo(0) },
        { restaurant_id: restaurantId, customer_id: customers[0].id, customer_name: `${customers[0].first_name} ${customers[0].last_name}`, customer_email: customers[0].email, date: "2026-08-20", time: "20:00", party_size: 6, status: "Completed", notes: "Anniversary dinner", created_at: daysAgo(10), updated_at: daysAgo(10) },
      ];
      const { error } = await supabase.from("bookings").insert(bookingData);
      if (error) console.error("   Bookings error:", error.message);
      console.log(`✅  Bookings seeded: ${bookingData.length}`);
    }
  }

  // ── Check if reviews already exist ───────────────────────────────────────
  const { count: existingReviewCount } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  if (existingReviewCount && existingReviewCount > 0) {
    console.log(`   Reviews already exist (${existingReviewCount}) — skipping`);
  } else {
    const { data: customers } = await supabase
      .from("users")
      .select("id, first_name, last_name")
      .eq("role", "customer")
      .limit(2);

    if (customers && customers.length >= 2) {
      const reviewData = [
        { restaurant_id: restaurantId, customer_id: customers[0].id, customer_name: `${customers[0].first_name} ${customers[0].last_name}`, rating: 5, comment: "Absolutely fantastic food! The herb-roasted chicken was perfectly cooked, juicy and full of flavor. Service was attentive and the ambiance was wonderful.", helpful: 12, created_at: daysAgo(2), updated_at: daysAgo(2) },
        { restaurant_id: restaurantId, customer_id: customers[1].id, customer_name: `${customers[1].first_name} ${customers[1].last_name}`, rating: 4, comment: "Great spot for a nice dinner. The pizza was crispy and delicious. Slightly long wait time but the food made up for it. Portions are generous.", helpful: 7, created_at: daysAgo(5), updated_at: daysAgo(5) },
      ];
      const { error } = await supabase.from("reviews").insert(reviewData);
      if (error) console.error("   Reviews error:", error.message);
      console.log(`✅  Reviews seeded: ${reviewData.length}`);
    }
  }

  // ── Update restaurant rating based on reviews ────────────────────────────
  const { data: reviewStats } = await supabase
    .from("reviews")
    .select("rating")
    .eq("restaurant_id", restaurantId);

  if (reviewStats && reviewStats.length > 0) {
    const avgRating = reviewStats.reduce((sum, r) => sum + r.rating, 0) / reviewStats.length;
    await supabase
      .from("restaurants")
      .update({
        rating: Math.round(avgRating * 10) / 10,
        review_count: reviewStats.length,
      })
      .eq("id", restaurantId);
    console.log(`   Restaurant rating updated: ${avgRating.toFixed(1)} (${reviewStats.length} reviews)`);
  }

  console.log("\n🎉  Seed complete!");
  console.log("─────────────────────────────────────");
  if (isFromOnboarding) {
    console.log("Used your existing onboarding data ✓");
  }
  console.log("Owner login:    owner@dinely.com  /  password123");
  console.log("Customer login: customer@dinely.com  /  password123");
  console.log("─────────────────────────────────────");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
