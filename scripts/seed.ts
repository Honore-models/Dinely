/**
 * Seed script - run with:
 *   npx tsx scripts/seed.ts
 *
 * Creates:
 *  - Demo owner + restaurant (if not exists)
 *  - 20+ diverse restaurants across Kigali
 *  - Menu items for the owner's restaurant
 *  - Multiple customer accounts with favourites
 *  - Reviews for restaurants
 *  - Tables, employees, orders, bookings for the owner's restaurant
 */

import { createClient } from "@supabase/supabase-js";
import * as bcrypt from "bcryptjs";
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

// ─── Restaurant seed data ───────────────────────────────────────────────────
const EXTRA_RESTAURANTS = [
  {
    name: "Heaven Restaurant & Lounge",
    type: "Italian & Mediterranean",
    address: "KG 7 Ave, Kimihurura, Kigali",
    opening_hours: "09:00 – 23:00",
    phone: "+250788100001",
    email: "info@heaven.rw",
    logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    description:
      "An upscale Italian restaurant with a stunning terrace view of Kigali. Known for handmade pasta and wood-fired pizza.",
    rating: 4.7,
    review_count: 24,
  },
  {
    name: "Bourbon Coffee",
    type: "Coffee & Brunch",
    address: "KN 3 St, Kigali",
    opening_hours: "07:00 – 21:00",
    phone: "+250788100002",
    email: "hello@bourboncoffee.rw",
    logo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80",
    description:
      "Kigali's favourite specialty coffee shop. Single-origin Rwandan beans, fresh pastries, and a creative brunch menu.",
    rating: 4.5,
    review_count: 38,
  },
  {
    name: "The Hut Restaurant",
    type: "African & Traditional",
    address: "KG 5 Ave, Kigali",
    opening_hours: "11:00 – 22:00",
    phone: "+250788100003",
    email: "reservations@thehut.rw",
    logo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    description:
      "Authentic Rwandan and East African cuisine in a beautifully designed traditional setting. Live music on weekends.",
    rating: 4.8,
    review_count: 56,
  },
  {
    name: "Sakura Japanese Restaurant",
    type: "Japanese & Sushi",
    address: "KG 11 Ave, Nyarutarama, Kigali",
    opening_hours: "12:00 – 22:30",
    phone: "+250788100004",
    email: "info@sakura.rw",
    logo: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80",
    description:
      "Premium Japanese dining with fresh sushi, sashimi, and teppanyaki. Elegant zen-inspired interior.",
    rating: 4.6,
    review_count: 19,
  },
  {
    name: "Cafe Kigali",
    type: "Cafe & Bakery",
    address: "KN 5 Rd, Kigali",
    opening_hours: "06:30 – 20:00",
    phone: "+250788100005",
    email: "cafe@kigali.rw",
    logo: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80",
    description:
      "A charming neighbourhood cafe serving artisan coffee, freshly baked bread, and light lunch options.",
    rating: 4.3,
    review_count: 42,
  },
  {
    name: "Pili Pili Grill House",
    type: "Grill & BBQ",
    address: "KG 9 Ave, Kacyiru, Kigali",
    opening_hours: "11:00 – 23:00",
    phone: "+250788100006",
    email: "info@pilipili.rw",
    logo: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    description:
      "The best grill in town! Smoky peri-peri chicken, tender beef ribs, and flame-grilled tilapia.",
    rating: 4.4,
    review_count: 31,
  },
  {
    name: "Khana Indian Restaurant",
    type: "Indian & Curry",
    address: "KN 6 Rd, Kigali",
    opening_hours: "11:30 – 22:00",
    phone: "+250788100007",
    email: "order@khana.rw",
    logo: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80",
    description:
      "Authentic North Indian curries, tandoori specials, and freshly baked naan. vegetarian-friendly menu.",
    rating: 4.2,
    review_count: 27,
  },
  {
    name: "Repub Lounge",
    type: "Bar & cocktails",
    address: "KG 7 Ave, Kimihurura, Kigali",
    opening_hours: "16:00 – 02:00",
    phone: "+250788100008",
    email: "repub@lounge.rw",
    logo: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80",
    description:
      "Kigali's premium cocktail bar and lounge. Craft cocktails, international wines, and gourmet bar bites.",
    rating: 4.5,
    review_count: 45,
  },
  {
    name: "La Galette French Bistro",
    type: "French & European",
    address: "KG 5 Ave, Kigali",
    opening_hours: "08:00 – 22:00",
    phone: "+250788100009",
    email: "bonjour@lagalette.rw",
    logo: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600&q=80",
    description:
      "A taste of Paris in Kigali. Classic French pastries, croissants, quiche, and fine dining dinner service.",
    rating: 4.6,
    review_count: 22,
  },
  {
    name: "Tokyo Express",
    type: "Asian Fusion",
    address: "KN 3 Rd, Kigali",
    opening_hours: "11:00 – 21:30",
    phone: "+250788100010",
    email: "order@tokyoexpress.rw",
    logo: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",
    description:
      "Quick-service Asian fusion. Rice bowls, bao buns, spring rolls, and bubble tea.",
    rating: 4.1,
    review_count: 15,
  },
  {
    name: "Terra Koffee & Kitchen",
    type: "Healthy & Organic",
    address: "KG 11 Ave, Nyarutarama, Kigali",
    opening_hours: "07:00 – 19:00",
    phone: "+250788100011",
    email: "hello@terrakitchen.rw",
    logo: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80",
    description:
      "Farm-to-table organic cafe. Cold-pressed juices, grain bowls, avocado toast, and Rwandan specialty coffee.",
    rating: 4.7,
    review_count: 29,
  },
  {
    name: "Chicken Inn",
    type: "Fast Food & Chicken",
    address: "KN 5 Rd, Kigali",
    opening_hours: "10:00 – 23:00",
    phone: "+250788100012",
    email: "info@chickeninn.rw",
    logo: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80",
    description:
      "Kigali's go-to for crispy fried chicken, loaded fries, and milkshakes. Family-friendly vibes.",
    rating: 4.0,
    review_count: 67,
  },
  {
    name: "Zinc Lounge & Restaurant",
    type: "Continental & Grill",
    address: "KG 9 Ave, Kacyiru, Kigali",
    opening_hours: "12:00 – 01:00",
    phone: "+250788100013",
    email: "info@zinc.rw",
    logo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
    description:
      "Rooftop dining with panoramic city views. Steaks, seafood platters, and an extensive wine list.",
    rating: 4.8,
    review_count: 33,
  },
  {
    name: "Ali's Mandazi & Chai",
    type: "Snacks & Street Food",
    address: "KN 2 Rd, Kigali",
    opening_hours: "05:00 – 18:00",
    phone: "+250788100014",
    email: "",
    logo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    description:
      "Freshly fried mandazi and spiced chai every morning. A beloved Kigali street food institution since 2005.",
    rating: 4.9,
    review_count: 112,
  },
  {
    name: "Shokola Cafe",
    type: "Desserts & Chocolates",
    address: "KG 7 Ave, Kimihurura, Kigali",
    opening_hours: "09:00 – 21:00",
    phone: "+250788100015",
    email: "info@shokola.rw",
    logo: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80",
    description:
      "Artisan chocolate shop and dessert cafe. Truffles, cakes, hot chocolate, and chocolate-making workshops.",
    rating: 4.6,
    review_count: 18,
  },
  {
    name: "Kigali Rwanda Hotel Restaurant",
    type: "Hotel & Fine Dining",
    address: "KN 6 Rd, Kigali",
    opening_hours: "06:00 – 23:00",
    phone: "+250788100016",
    email: "dining@kigalihotel.rw",
    logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    description:
      "International buffet and à la carte dining with panoramic city views. Breakfast, lunch, and dinner.",
    rating: 4.3,
    review_count: 21,
  },
  {
    name: "Mama Ashanti",
    type: "West African",
    address: "KG 11 Ave, Nyarutarama, Kigali",
    opening_hours: "11:00 – 22:00",
    phone: "+250788100017",
    email: "info@mamaashanti.rw",
    logo: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80",
    description:
      "Vibrant West African flavours - jollof rice, suya kebabs, egusi soup, and plantain chips.",
    rating: 4.4,
    review_count: 16,
  },
  {
    name: "Pizza Roma",
    type: "Italian & Pizza",
    address: "KN 3 St, Kigali",
    opening_hours: "11:00 – 22:00",
    phone: "+250788100018",
    email: "order@pizzaroma.rw",
    logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
    description:
      "Authentic Neapolitan pizza baked in a wood-fired oven. Calzones, pasta, and tiramisu to finish.",
    rating: 4.5,
    review_count: 35,
  },
  {
    name: "The Wild Goose",
    type: "Pub & Gastropub",
    address: "KG 5 Ave, Kigali",
    opening_hours: "12:00 – 00:00",
    phone: "+250788100019",
    email: "info@wildgoose.rw",
    logo: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80",
    description:
      "Craft beer heaven with 20+ taps, hearty pub food, and live sports screenings. Rooftop terrace available.",
    rating: 4.2,
    review_count: 41,
  },
  {
    name: "Green Bowl Vegan Kitchen",
    type: "Vegan & Plant-Based",
    address: "KG 11 Ave, Nyarutarama, Kigali",
    opening_hours: "08:00 – 20:00",
    phone: "+250788100020",
    email: "eat@greenbowl.rw",
    logo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    description:
      "100% plant-based restaurant. Buddha bowls, jackfruit tacos, smoothies, and raw desserts.",
    rating: 4.7,
    review_count: 23,
  },
  {
    name: "Nyanza Fried Chicken",
    type: "Fast Food & Chicken",
    address: "KN 1 Rd, Kigali",
    opening_hours: "10:00 – 22:00",
    phone: "+250788100021",
    email: "info@nyanzafc.rw",
    logo: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=600&q=80",
    description:
      "Spicy and crispy fried chicken combos with coleslaw, fries, and我们的signature hot sauce.",
    rating: 3.9,
    review_count: 53,
  },
  {
    name: "Meze Fresh",
    type: "Turkish & Middle Eastern",
    address: "KG 9 Ave, Kacyiru, Kigali",
    opening_hours: "11:00 – 22:00",
    phone: "+250788100022",
    email: "info@mezefresh.rw",
    logo: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80",
    description:
      "Fresh mezze platters, shawarma wraps, falafel bowls, and homemade hummus. Quick and flavourful.",
    rating: 4.3,
    review_count: 28,
  },
  {
    name: "Skyline Rooftop Bar",
    type: "Bar & Lounge",
    address: "KG 7 Ave, Kimihurura, Kigali",
    opening_hours: "17:00 – 02:00",
    phone: "+250788100023",
    email: "vip@skylinerw.rw",
    logo: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80",
    description:
      "Breathtaking rooftop views of Kigali at sunset. Signature cocktails, sushi bar, and live DJ sets.",
    rating: 4.6,
    review_count: 37,
  },
];

// ─── Extra menu items per restaurant type ───────────────────────────────────
const EXTRA_MENUS: Record<
  string,
  Array<{
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
  }>
> = {
  "Italian & Mediterranean": [
    {
      name: "Margherita Pizza",
      category: "Pizza",
      price: 12.0,
      description: "Classic tomato, mozzarella, and fresh basil on thin crust.",
      image:
        "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&q=80",
    },
    {
      name: "Truffle Risotto",
      category: "Main Course",
      price: 18.5,
      description:
        "Creamy Arborio rice with black truffle shavings and parmesan.",
      image:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80",
    },
    {
      name: "Bruschetta",
      category: "Starters",
      price: 7.5,
      description:
        "Grilled sourdough topped with diced tomatoes, garlic, and basil.",
      image:
        "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80",
    },
    {
      name: "Tiramisu",
      category: "Desserts",
      price: 8.0,
      description:
        "Classic Italian coffee-soaked ladyfingers with mascarpone cream.",
      image:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80",
    },
  ],
  "Coffee & Brunch": [
    {
      name: "Avocado Toast",
      category: "Brunch",
      price: 9.0,
      description:
        "Sourdough topped with smashed avocado, poached egg, and chilli flakes.",
      image:
        "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&q=80",
    },
    {
      name: "Flat White",
      category: "Coffee",
      price: 4.0,
      description: "Double shot espresso with velvety microfoam.",
      image:
        "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80",
    },
    {
      name: "Blueberry Pancakes",
      category: "Brunch",
      price: 10.5,
      description:
        "Fluffy buttermilk pancakes loaded with fresh blueberries and maple syrup.",
      image:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
    },
    {
      name: "Cold Brew",
      category: "Coffee",
      price: 4.5,
      description: "Slow-steeped 18-hour cold brew, smooth and refreshing.",
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80",
    },
  ],
  "African & Traditional": [
    {
      name: "Isombe Cassava",
      category: "Main Course",
      price: 8.0,
      description: "Mashed cassava leaves with groundnuts and palm oil.",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    },
    {
      name: "Brochettes",
      category: "Grill",
      price: 10.0,
      description: "Grilled goat meat skewers with onions and peppers.",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
    },
    {
      name: "Ugali & Fish",
      category: "Main Course",
      price: 9.5,
      description: "Maize meal served with fried tilapia in tomato sauce.",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    },
    {
      name: "Akabenz",
      category: "Main Course",
      price: 11.0,
      description: "Slow-roasted pork belly with traditional spices.",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
    },
  ],
  "Japanese & Sushi": [
    {
      name: "Salmon Nigiri (6pc)",
      category: "Sushi",
      price: 14.0,
      description: "Fresh Atlantic salmon over seasoned rice.",
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80",
    },
    {
      name: "Dragon Roll",
      category: "Sushi",
      price: 16.0,
      description: "Eel and avocado roll topped with tobiko and eel sauce.",
      image:
        "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&q=80",
    },
    {
      name: "Miso Soup",
      category: "Starters",
      price: 4.0,
      description: "Traditional miso broth with tofu, wakame, and green onion.",
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
    },
    {
      name: "Green Tea Ice Cream",
      category: "Desserts",
      price: 5.5,
      description: "Creamy matcha-flavoured ice cream.",
      image:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80",
    },
  ],
  "Cafe & Bakery": [
    {
      name: "Croissant",
      category: "Bakery",
      price: 3.5,
      description: "Buttery, flaky French croissant baked fresh every morning.",
      image:
        "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400&q=80",
    },
    {
      name: "Espresso",
      category: "Coffee",
      price: 2.5,
      description: "Double shot of rich Rwandan single-origin espresso.",
      image:
        "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&q=80",
    },
    {
      name: "Almond Biscotti",
      category: "Bakery",
      price: 2.0,
      description: "Crunchy almond biscotti, perfect for dipping.",
      image:
        "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
    },
  ],
  "Grill & BBQ": [
    {
      name: "Peri-Peri Chicken",
      category: "Grill",
      price: 13.0,
      description:
        "Half chicken marinated in spicy peri-peri sauce, flame-grilled.",
      image:
        "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80",
    },
    {
      name: "Beef Ribs",
      category: "Grill",
      price: 18.0,
      description: "Smoky BBQ beef ribs slow-cooked for 8 hours.",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
    },
    {
      name: "Grilled Tilapia",
      category: "Grill",
      price: 12.0,
      description: "Whole tilapia grilled with lemon, garlic, and herbs.",
      image:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
    },
    {
      name: "Coleslaw",
      category: "Sides",
      price: 3.5,
      description: "Creamy coleslaw with crunchy cabbage and carrots.",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
    },
  ],
  "Indian & Curry": [
    {
      name: "Butter Chicken",
      category: "Curry",
      price: 14.0,
      description: "Tender chicken in a creamy tomato-butter sauce.",
      image:
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80",
    },
    {
      name: "Garlic Naan",
      category: "Bread",
      price: 3.0,
      description: "Soft naan bread with garlic butter, baked in tandoor.",
      image:
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
    },
    {
      name: "Lamb Biryani",
      category: "Rice",
      price: 15.0,
      description:
        "Fragrant basmati rice layered with spiced lamb and saffron.",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
    },
    {
      name: "Samosa (3pc)",
      category: "Starters",
      price: 5.0,
      description: "Crispy pastry filled with spiced potatoes and peas.",
      image:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80",
    },
  ],
  "Bar & cocktails": [
    {
      name: "Old Fashioned",
      category: "Cocktails",
      price: 10.0,
      description: "Bourbon, bitters, sugar, and orange peel.",
      image:
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80",
    },
    {
      name: "Nachos Supreme",
      category: "Bar Food",
      price: 8.0,
      description:
        "Loaded nachos with cheese, jalapeños, sour cream, and guacamole.",
      image:
        "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80",
    },
    {
      name: "Mojito",
      category: "Cocktails",
      price: 9.0,
      description: "White rum, fresh mint, lime, soda, and sugar.",
      image:
        "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80",
    },
  ],
  "French & European": [
    {
      name: "Croque Monsieur",
      category: "Mains",
      price: 11.0,
      description: "Classic French ham and cheese grilled sandwich.",
      image:
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
    },
    {
      name: "French Onion Soup",
      category: "Starters",
      price: 7.0,
      description: "Caramelised onion soup with melted Gruyère on top.",
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80",
    },
    {
      name: "Pain au Chocolat",
      category: "Bakery",
      price: 4.0,
      description: "Flaky pastry with dark chocolate filling.",
      image:
        "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400&q=80",
    },
  ],
  "Asian Fusion": [
    {
      name: "Teriyaki Chicken Bowl",
      category: "Rice Bowls",
      price: 11.0,
      description: "Grilled chicken with teriyaki glaze over steamed rice.",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    },
    {
      name: "Bao Buns (3pc)",
      category: "Bao",
      price: 8.0,
      description: "Steamed buns filled with crispy pork belly and pickles.",
      image:
        "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80",
    },
    {
      name: "Bubble Tea",
      category: "Drinks",
      price: 5.0,
      description: "Taro milk tea with chewy tapioca pearls.",
      image:
        "https://images.unsplash.com/photo-1558857563-b371033873b8?w=400&q=80",
    },
  ],
  "Healthy & Organic": [
    {
      name: "Buddha Bowl",
      category: "Bowls",
      price: 12.0,
      description: "Quinoa, roasted veggies, tahini, and microgreens.",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    },
    {
      name: "Green Smoothie",
      category: "Drinks",
      price: 6.0,
      description: "Spinach, banana, mango, and chia seeds.",
      image:
        "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400&q=80",
    },
    {
      name: "Overnight Oats",
      category: "Breakfast",
      price: 7.5,
      description: "Rolled oats soaked in almond milk with berries and honey.",
      image:
        "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&q=80",
    },
  ],
  "Fast Food & Chicken": [
    {
      name: "Chicken Burger",
      category: "Burgers",
      price: 7.0,
      description:
        "Crispy chicken fillet with lettuce and mayo in a brioche bun.",
      image:
        "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80",
    },
    {
      name: "Loaded Fries",
      category: "Sides",
      price: 5.5,
      description: "Fries topped with cheese sauce, bacon bits, and jalapeños.",
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
    },
    {
      name: "Milkshake",
      category: "Drinks",
      price: 4.5,
      description:
        "Thick and creamy milkshake - chocolate, vanilla, or strawberry.",
      image:
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80",
    },
    {
      name: "Spicy Wings (8pc)",
      category: "Chicken",
      price: 8.0,
      description: "Hot and crispy chicken wings with blue cheese dip.",
      image:
        "https://images.unsplash.com/photo-1608039755401-85383b23c0c8?w=400&q=80",
    },
    {
      name: "Chicken Wrap",
      category: "Wraps",
      price: 6.5,
      description:
        "Grilled chicken, lettuce, tomato, and ranch in a flour tortilla.",
      image:
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
    },
  ],
  "Continental & Grill": [
    {
      name: "Ribeye Steak",
      category: "Steaks",
      price: 28.0,
      description:
        "300g grain-fed ribeye, cooked to your liking, with peppercorn sauce.",
      image:
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80",
    },
    {
      name: "Caesar Salad",
      category: "Starters",
      price: 9.0,
      description: "Romaine, parmesan, croutons, and classic Caesar dressing.",
      image:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80",
    },
    {
      name: "Crème Brûlée",
      category: "Desserts",
      price: 7.5,
      description: "Vanilla custard with a caramelised sugar top.",
      image:
        "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80",
    },
  ],
  "Snacks & Street Food": [
    {
      name: "Mandazi (6pc)",
      category: "Snacks",
      price: 3.0,
      description: "Freshly fried East African doughnuts, golden and fluffy.",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    },
    {
      name: "Masala Chai",
      category: "Drinks",
      price: 2.0,
      description: "Spiced tea brewed with cardamom, ginger, and cinnamon.",
      image:
        "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&q=80",
    },
  ],
  "Desserts & Chocolates": [
    {
      name: "Chocolate Truffles (6pc)",
      category: "Chocolates",
      price: 12.0,
      description: "Hand-rolled dark chocolate truffles dusted in cocoa.",
      image:
        "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80",
    },
    {
      name: "Hot Chocolate",
      category: "Drinks",
      price: 5.0,
      description: "Rich Belgian chocolate melted into steamed milk.",
      image:
        "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&q=80",
    },
    {
      name: "Chocolate Cake Slice",
      category: "Cakes",
      price: 7.0,
      description: "Moist three-layer chocolate cake with ganache frosting.",
      image:
        "https://images.unsplash.com/photo-1578985545062-3949766c0173?w=400&q=80",
    },
  ],
  "Hotel & Fine Dining": [
    {
      name: "International Buffet",
      category: "Buffet",
      price: 35.0,
      description:
        "All-you-can-eat buffet with salads, mains, desserts, and live cooking stations.",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    },
    {
      name: "Grilled Lamb Chops",
      category: "Mains",
      price: 25.0,
      description: "Herb-crusted lamb chops with roasted root vegetables.",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
    },
  ],
  "West African": [
    {
      name: "Jollof Rice",
      category: "Rice",
      price: 10.0,
      description: "One-pot spiced tomato rice, a West African classic.",
      image:
        "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80",
    },
    {
      name: "Suya Kebabs",
      category: "Grill",
      price: 8.0,
      description: "Spiced grilled beef skewers with groundnut seasoning.",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
    },
    {
      name: "Fried Plantain",
      category: "Sides",
      price: 4.0,
      description: "Sweet ripe plantain slices, golden fried.",
      image:
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80",
    },
  ],
  "Italian & Pizza": [
    {
      name: "Quattro Formaggi",
      category: "Pizza",
      price: 13.0,
      description:
        "Four-cheese pizza with mozzarella, gorgonzola, parmesan, and ricotta.",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
    },
    {
      name: "Spaghetti Carbonara",
      category: "Pasta",
      price: 12.0,
      description: "Spaghetti with pancetta, egg, pecorino, and black pepper.",
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80",
    },
    {
      name: "Caprese Salad",
      category: "Starters",
      price: 7.5,
      description: "Fresh mozzarella, tomato, and basil with balsamic glaze.",
      image:
        "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&q=80",
    },
  ],
  "Pub & Gastropub": [
    {
      name: "Fish & Chips",
      category: "Mains",
      price: 12.0,
      description: "Beer-battered cod with thick-cut chips and tartar sauce.",
      image:
        "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&q=80",
    },
    {
      name: "Craft IPA",
      category: "Drinks",
      price: 5.0,
      description: "Local craft IPA with citrus hop notes.",
      image:
        "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&q=80",
    },
    {
      name: "Beef Burger",
      category: "Burgers",
      price: 11.0,
      description:
        "Double smash patty with cheddar, pickles, and special sauce.",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
    },
  ],
  "Vegan & Plant-Based": [
    {
      name: "Jackfruit Taco",
      category: "Tacos",
      price: 9.0,
      description:
        "Pulled jackfruit in smoky BBQ sauce with slaw in corn tortillas.",
      image:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
    },
    {
      name: "Acai Bowl",
      category: "Bowls",
      price: 10.0,
      description:
        "Frozen acai blended with banana, topped with granola and berries.",
      image:
        "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80",
    },
  ],

  "Turkish & Middle Eastern": [
    {
      name: "Lamb Shawarma Wrap",
      category: "Wraps",
      price: 9.0,
      description:
        "Slow-roasted lamb in a warm pita with garlic sauce and pickles.",
      image:
        "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80",
    },
    {
      name: "Hummus Platter",
      category: "Mezze",
      price: 7.0,
      description: "Creamy chickpea hummus with warm pita and olive oil.",
      image:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
    },
    {
      name: "Falafel Bowl",
      category: "Bowls",
      price: 10.0,
      description:
        "Crispy falafel over rice with tahini, salad, and pickled turnip.",
      image:
        "https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=400&q=80",
    },
  ],
  "Bar & Lounge": [
    {
      name: "Sushi Platter",
      category: "Sushi",
      price: 22.0,
      description: "Chef's selection of 18 pieces - nigiri, maki, and sashimi.",
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80",
    },
    {
      name: "Signature Martini",
      category: "Cocktails",
      price: 11.0,
      description: "Gin, dry vermouth, and a twist of lemon.",
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80",
    },
  ],
};

// ─── Review comments pool ───────────────────────────────────────────────────
const REVIEW_COMMENTS = [
  "Absolutely loved it! The food was fresh, flavourful, and beautifully presented. Will definitely come back.",
  "Great atmosphere and even better food. The service was quick and friendly.",
  "A hidden gem in Kigali! Everything we ordered was delicious. Highly recommend.",
  "Good food but the wait time was a bit long. Still worth it for the quality.",
  "Perfect spot for a date night. Ambiance is top-notch and the cocktails are amazing.",
  "Solid portions and fair prices. The chef really knows what they're doing.",
  "Best [food] I've had in Kigali, hands down. The seasoning is just right.",
  "Came here with friends and we all loved it. Will be regulars now!",
  "The presentation alone is worth the visit. Food tasted as good as it looked.",
  "Consistently excellent. This is my go-to restaurant in the city.",
  "Friendly staff, cosy atmosphere, and the [dish] was out of this world!",
  "A bit pricey but the quality justifies it. Treat yourself - you won't regret it.",
  "I've been to many restaurants in Kigali and this is easily in my top 3.",
  "The brunch here is fantastic! Fresh ingredients and creative menu options.",
  "Lovely place. The [dish] was the highlight - perfectly cooked and seasoned.",
];

const CUSTOMER_NAMES = [
  { first: "Jean", last: "Baptiste" },
  { first: "Marie", last: "Claire" },
  { first: "David", last: "Nshimiyimana" },
  { first: "Sarah", last: "Ingabire" },
  { first: "Emmanuel", last: "Bizimana" },
  { first: "Diane", last: "Mukamana" },
  { first: "Alex", last: "Hakizimana" },
  { first: "Cynthia", last: "Uwimana" },
  { first: "Kevin", last: "Niyonsaba" },
  { first: "Grace", last: "Kabera" },
];

async function seed() {
  console.log("🌱  Connecting to Supabase…\n");

  // ── Find or create owner ──────────────────────────────────────────────
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
    console.log(
      `   Found existing owner: ${owner.first_name} ${owner.last_name}`,
    );

    if (owner.restaurant_id) {
      restaurantId = owner.restaurant_id;
      isFromOnboarding = true;
    } else {
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
      await supabase
        .from("users")
        .update({ restaurant_id: restaurantId })
        .eq("id", ownerId);
      console.log(`   Created restaurant for owner: ${restaurantId}`);
    }
  } else {
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

    await supabase
      .from("users")
      .update({ restaurant_id: restaurantId })
      .eq("id", ownerId);
    console.log("✅  Demo owner + restaurant created");
  }

  // ── Seed extra restaurants ────────────────────────────────────────────
  const { count: existingRestCount } = await supabase
    .from("restaurants")
    .select("id", { count: "exact", head: true });

  if (existingRestCount && existingRestCount > EXTRA_RESTAURANTS.length + 1) {
    console.log(
      `   Restaurants already seeded (${existingRestCount}) - skipping`,
    );
  } else {
    // Get existing restaurant names to avoid duplicates
    const { data: existingNames } = await supabase
      .from("restaurants")
      .select("name");
    const existingNameSet = new Set(
      (existingNames || []).map((r: any) => r.name),
    );

    const newRestaurants = EXTRA_RESTAURANTS.filter(
      (r) => !existingNameSet.has(r.name),
    ).map((r) => ({
      owner_id: ownerId,
      ...r,
      plan: "Professional",
      billing_cycle: "monthly",
      subscription_status: "active",
    }));

    if (newRestaurants.length > 0) {
      const { data: inserted, error } = await supabase
        .from("restaurants")
        .insert(newRestaurants)
        .select("id, name, type");

      if (error) {
        console.error("   Restaurants error:", error.message);
      } else {
        console.log(`✅  Extra restaurants seeded: ${inserted?.length || 0}`);

        // Seed menu items for each extra restaurant
        let menuCount = 0;
        for (const rest of inserted || []) {
          const menus = EXTRA_MENUS[rest.type];
          if (!menus) continue;

          const items = menus.map((m) => ({
            restaurant_id: rest.id,
            ...m,
            available: true,
          }));

          const { error: menuErr } = await supabase
            .from("menu_items")
            .insert(items);
          if (!menuErr) menuCount += items.length;
        }
        console.log(`✅  Menu items for extra restaurants: ${menuCount}`);
      }
    }
  }

  // ── Seed menu items for owner's restaurant ────────────────────────────
  const { count: existingMenuCount } = await supabase
    .from("menu_items")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  if (existingMenuCount && existingMenuCount > 0) {
    console.log(`   Menu already has ${existingMenuCount} items - skipping`);
  } else {
    const menuItems = [
      {
        restaurant_id: restaurantId,
        name: "Herb-Roasted Chicken",
        category: "Main Course",
        price: 25.98,
        description:
          "Roasted chicken breast seasoned with aromatic herbs, served with seasonal vegetables.",
        image:
          "https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Crispy Chicken Noodles",
        category: "Main Course",
        price: 14.98,
        description:
          "Stir-fried noodles topped with breaded fried chicken in savoury sauce.",
        image:
          "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 11.0,
        description:
          "Thin crust pizza with tomato sauce, mozzarella, and premium pepperoni.",
        image:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Garlic Bread",
        category: "Starters",
        price: 5.99,
        description:
          "Toasted sourdough with herb garlic butter and fresh parsley.",
        image:
          "https://images.unsplash.com/photo-1619531040576-f9416740661f?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Spicy Chicken Wings",
        category: "Starters",
        price: 9.99,
        description:
          "Crispy wings in house buffalo sauce with blue cheese dip.",
        image:
          "https://images.unsplash.com/photo-1608039755401-85383b23c0c8?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Classic Beef Burger",
        category: "Burgers",
        price: 13.5,
        description:
          "Juicy beef patty with lettuce, tomato, pickles, and signature sauce.",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Caesar Salad",
        category: "Salads",
        price: 8.5,
        description:
          "Crisp romaine with parmesan, croutons, and Caesar dressing.",
        image:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Chocolate Lava Cake",
        category: "Desserts",
        price: 7.5,
        description:
          "Warm chocolate cake with molten centre and vanilla ice cream.",
        image:
          "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Grilled Salmon",
        category: "Seafood",
        price: 22.0,
        description: "Atlantic salmon with lemon butter sauce and asparagus.",
        image:
          "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
        available: true,
      },
      {
        restaurant_id: restaurantId,
        name: "Fresh Fruit Smoothie",
        category: "Drinks",
        price: 4.5,
        description: "Blended seasonal fruits with yogurt and honey.",
        image:
          "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80",
        available: true,
      },
    ];

    const { data: menuResult } = await supabase
      .from("menu_items")
      .insert(menuItems)
      .select("id");
    console.log(`✅  Menu items seeded: ${(menuResult || []).length}`);
  }

  // ── Seed customers ────────────────────────────────────────────────────
  const { count: existingCustCount } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("role", "customer");

  if (existingCustCount && existingCustCount >= CUSTOMER_NAMES.length) {
    console.log(
      `   Customers already seeded (${existingCustCount}) - skipping`,
    );
  } else {
    const custPass = await hash("password123");
    const customers = CUSTOMER_NAMES.map((c) => ({
      first_name: c.first,
      last_name: c.last,
      email: `${c.first.toLowerCase()}.${c.last.toLowerCase()}@dinely.com`,
      phone: `+250788${String(Math.floor(100000 + Math.random() * 900000))}`,
      password_hash: custPass,
      role: "customer" as const,
      favourites: [] as string[],
    }));

    const { data: custResult, error: custErr } = await supabase
      .from("users")
      .insert(customers)
      .select("id, first_name");

    if (custErr) {
      console.error("   Customers error:", custErr.message);
    } else {
      console.log(`✅  Customers seeded: ${custResult?.length || 0}`);

      // Also create the original demo customer if not exists
      const { data: demoCust } = await supabase
        .from("users")
        .select("id")
        .eq("email", "customer@dinely.com")
        .single();

      const allCustIds = [
        ...(custResult || []).map((c: any) => c.id),
        ...(demoCust ? [demoCust.id] : []),
      ];

      // Assign random favourites to customers
      const { data: allRestaurants } = await supabase
        .from("restaurants")
        .select("id");

      if (
        allRestaurants &&
        allRestaurants.length > 0 &&
        allCustIds.length > 0
      ) {
        for (const custId of allCustIds) {
          // Each customer favs 3-6 random restaurants
          const favCount = 3 + Math.floor(Math.random() * 4);
          const shuffled = [...allRestaurants]
            .sort(() => Math.random() - 0.5)
            .slice(0, favCount);
          const favIds = shuffled.map((r: any) => r.id);

          await supabase
            .from("users")
            .update({ favourites: favIds })
            .eq("id", custId);
        }
        console.log(
          `✅  Favourites assigned to ${allCustIds.length} customers`,
        );
      }
    }
  }

  // ── Seed tables ───────────────────────────────────────────────────────
  const { count: existingTableCount } = await supabase
    .from("restaurant_tables")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  if (existingTableCount && existingTableCount > 0) {
    console.log(`   Tables already exist (${existingTableCount}) - skipping`);
  } else {
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
    const { error } = await supabase
      .from("restaurant_tables")
      .insert(tableData);
    if (error) console.error("   Tables error:", error.message);
    console.log(`✅  Tables seeded: ${tableData.length}`);
  }

  // ── Seed employees ────────────────────────────────────────────────────
  const { count: existingEmpCount } = await supabase
    .from("employees")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  if (existingEmpCount && existingEmpCount > 0) {
    console.log(`   Employees already exist (${existingEmpCount}) - skipping`);
  } else {
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
      {
        restaurant_id: restaurantId,
        first_name: "Diane",
        last_name: "Umutoni",
        email: "diane@goldenplate.com",
        phone: "+250788001006",
        role: "Bartender",
        salary: 400,
        start_date: "2024-03-15",
      },
    ];
    const { error } = await supabase.from("employees").insert(employeeData);
    if (error) console.error("   Employees error:", error.message);
    console.log(`✅  Employees seeded: ${employeeData.length}`);
  }

  // ── Seed orders ───────────────────────────────────────────────────────
  const { count: existingOrderCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  if (existingOrderCount && existingOrderCount > 0) {
    console.log(`   Orders already exist (${existingOrderCount}) - skipping`);
  } else {
    const { data: menuItems } = await supabase
      .from("menu_items")
      .select("id, name, price")
      .eq("restaurant_id", restaurantId);

    if (!menuItems || menuItems.length === 0) {
      console.log("   No menu items found - skipping order seed");
    } else {
      const { data: customers } = await supabase
        .from("users")
        .select("id, first_name, last_name")
        .eq("role", "customer")
        .limit(3);

      if (customers && customers.length >= 2) {
        const cust1 = customers[0];
        const cust2 = customers[1];
        const now = new Date();
        const orderData = [
          {
            restaurant_id: restaurantId,
            customer_id: cust1.id,
            customer_name: `${cust1.first_name} ${cust1.last_name}`,
            items: [
              {
                menuItemId: menuItems[0].id,
                name: menuItems[0].name,
                price: menuItems[0].price,
                quantity: 1,
              },
            ],
            type: "Delivery",
            status: "Completed",
            total: menuItems[0].price,
            delivery_address: "KG 7 Ave, Kigali",
            created_at: daysAgo(1),
            updated_at: daysAgo(1),
          },
          {
            restaurant_id: restaurantId,
            customer_id: cust1.id,
            customer_name: `${cust1.first_name} ${cust1.last_name}`,
            items: [
              {
                menuItemId: menuItems[5].id,
                name: menuItems[5].name,
                price: menuItems[5].price,
                quantity: 2,
              },
            ],
            type: "Delivery",
            status: "Completed",
            total: menuItems[5].price * 2,
            delivery_address: "KG 7 Ave, Kigali",
            created_at: daysAgo(3),
            updated_at: daysAgo(3),
          },
          {
            restaurant_id: restaurantId,
            customer_id: cust2.id,
            customer_name: `${cust2.first_name} ${cust2.last_name}`,
            items: [
              {
                menuItemId: menuItems[2].id,
                name: menuItems[2].name,
                price: menuItems[2].price,
                quantity: 1,
              },
              {
                menuItemId: menuItems[7].id,
                name: menuItems[7].name,
                price: menuItems[7].price,
                quantity: 1,
              },
            ],
            type: "Dine-in",
            status: "Completed",
            total: menuItems[2].price + menuItems[7].price,
            created_at: daysAgo(5),
            updated_at: daysAgo(5),
          },
          {
            restaurant_id: restaurantId,
            customer_id: cust1.id,
            customer_name: `${cust1.first_name} ${cust1.last_name}`,
            items: [
              {
                menuItemId: menuItems[1].id,
                name: menuItems[1].name,
                price: menuItems[1].price,
                quantity: 3,
              },
            ],
            type: "Takeaway",
            status: "Completed",
            total: menuItems[1].price * 3,
            created_at: daysAgo(7),
            updated_at: daysAgo(7),
          },
          {
            restaurant_id: restaurantId,
            customer_id: cust2.id,
            customer_name: `${cust2.first_name} ${cust2.last_name}`,
            items: [
              {
                menuItemId: menuItems[5].id,
                name: menuItems[5].name,
                price: menuItems[5].price,
                quantity: 1,
              },
              {
                menuItemId: menuItems[6].id,
                name: menuItems[6].name,
                price: menuItems[6].price,
                quantity: 1,
              },
            ],
            type: "Delivery",
            status: "Active",
            total: menuItems[5].price + menuItems[6].price,
            delivery_address: "KN 3 Rd, Kigali",
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
          },
          {
            restaurant_id: restaurantId,
            customer_id: cust1.id,
            customer_name: `${cust1.first_name} ${cust1.last_name}`,
            items: [
              {
                menuItemId: menuItems[0].id,
                name: menuItems[0].name,
                price: menuItems[0].price,
                quantity: 2,
              },
              {
                menuItemId: menuItems[4].id,
                name: menuItems[4].name,
                price: menuItems[4].price,
                quantity: 1,
              },
            ],
            type: "Delivery",
            status: "Pending",
            total: menuItems[0].price * 2 + menuItems[4].price,
            delivery_address: "KG 7 Ave, Kigali",
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
          },
          ...Array.from({ length: 12 }, (_, i) => ({
            restaurant_id: restaurantId,
            customer_id: i % 2 === 0 ? cust1.id : cust2.id,
            customer_name:
              i % 2 === 0
                ? `${cust1.first_name} ${cust1.last_name}`
                : `${cust2.first_name} ${cust2.last_name}`,
            items: [
              {
                menuItemId: menuItems[i % menuItems.length].id,
                name: menuItems[i % menuItems.length].name,
                price: menuItems[i % menuItems.length].price,
                quantity: 1,
              },
            ],
            type:
              i % 3 === 0 ? "Dine-in" : i % 3 === 1 ? "Delivery" : "Takeaway",
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

  // ── Seed bookings ─────────────────────────────────────────────────────
  const { count: existingBookingCount } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  if (existingBookingCount && existingBookingCount > 0) {
    console.log(
      `   Bookings already exist (${existingBookingCount}) - skipping`,
    );
  } else {
    const { data: customers } = await supabase
      .from("users")
      .select("id, first_name, last_name, email")
      .eq("role", "customer")
      .limit(3);

    if (customers && customers.length >= 2) {
      const bookingData = [
        {
          restaurant_id: restaurantId,
          customer_id: customers[0].id,
          customer_name: `${customers[0].first_name} ${customers[0].last_name}`,
          customer_email: customers[0].email,
          date: "2026-08-28",
          time: "19:00",
          party_size: 4,
          status: "Confirmed",
          notes: "Window seat preferred",
          created_at: daysAgo(1),
          updated_at: daysAgo(1),
        },
        {
          restaurant_id: restaurantId,
          customer_id: customers[1].id,
          customer_name: `${customers[1].first_name} ${customers[1].last_name}`,
          customer_email: customers[1].email,
          date: "2026-08-30",
          time: "13:00",
          party_size: 2,
          status: "Pending",
          created_at: daysAgo(0),
          updated_at: daysAgo(0),
        },
        {
          restaurant_id: restaurantId,
          customer_id: customers[0].id,
          customer_name: `${customers[0].first_name} ${customers[0].last_name}`,
          customer_email: customers[0].email,
          date: "2026-08-20",
          time: "20:00",
          party_size: 6,
          status: "Completed",
          notes: "Anniversary dinner",
          created_at: daysAgo(10),
          updated_at: daysAgo(10),
        },
      ];
      const { error } = await supabase.from("bookings").insert(bookingData);
      if (error) console.error("   Bookings error:", error.message);
      console.log(`✅  Bookings seeded: ${bookingData.length}`);
    }
  }

  // ── Seed reviews ──────────────────────────────────────────────────────
  const { count: existingReviewCount } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);

  if (existingReviewCount && existingReviewCount > 0) {
    console.log(`   Reviews already exist (${existingReviewCount}) - skipping`);
  } else {
    const { data: customers } = await supabase
      .from("users")
      .select("id, first_name, last_name")
      .eq("role", "customer")
      .limit(5);

    if (customers && customers.length >= 2) {
      const reviewData = [
        {
          restaurant_id: restaurantId,
          customer_id: customers[0].id,
          customer_name: `${customers[0].first_name} ${customers[0].last_name}`,
          rating: 5,
          comment:
            "Absolutely fantastic food! The herb-roasted chicken was perfectly cooked. Service was attentive and the ambiance was wonderful.",
          helpful: 12,
          created_at: daysAgo(2),
          updated_at: daysAgo(2),
        },
        {
          restaurant_id: restaurantId,
          customer_id: customers[1].id,
          customer_name: `${customers[1].first_name} ${customers[1].last_name}`,
          rating: 4,
          comment:
            "Great spot for dinner. The pizza was crispy and delicious. Slightly long wait but the food made up for it.",
          helpful: 7,
          created_at: daysAgo(5),
          updated_at: daysAgo(5),
        },
      ];
      if (customers.length >= 3) {
        reviewData.push({
          restaurant_id: restaurantId,
          customer_id: customers[2].id,
          customer_name: `${customers[2].first_name} ${customers[2].last_name}`,
          rating: 5,
          comment:
            "One of the best dining experiences in Kigali. Everything from the starters to dessert was top-notch. Highly recommend!",
          helpful: 9,
          created_at: daysAgo(8),
          updated_at: daysAgo(8),
        });
      }
      const { error } = await supabase.from("reviews").insert(reviewData);
      if (error) console.error("   Reviews error:", error.message);
      console.log(`✅  Reviews seeded: ${reviewData.length}`);
    }
  }

  // ── Seed reviews for extra restaurants ─────────────────────────────────
  const { count: totalReviews } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true });

  if (totalReviews && totalReviews > 10) {
    console.log(`   Reviews already seeded (${totalReviews}) - skipping extra`);
  } else {
    const { data: allRests } = await supabase
      .from("restaurants")
      .select("id")
      .neq("id", restaurantId)
      .limit(15);

    const { data: customers } = await supabase
      .from("users")
      .select("id, first_name, last_name")
      .eq("role", "customer")
      .limit(10);

    if (allRests && allRests.length > 0 && customers && customers.length > 0) {
      const reviewData: any[] = [];
      for (const rest of allRests) {
        // 1-3 reviews per restaurant
        const reviewCount = 1 + Math.floor(Math.random() * 3);
        const usedCustomers = new Set<string>();

        for (let j = 0; j < reviewCount; j++) {
          // Pick a customer that hasn't reviewed this restaurant yet
          let cust;
          let attempts = 0;
          do {
            cust = customers[Math.floor(Math.random() * customers.length)];
            attempts++;
          } while (usedCustomers.has(cust.id) && attempts < 20);

          if (usedCustomers.has(cust.id)) continue;
          usedCustomers.add(cust.id);

          const rating = 3 + Math.floor(Math.random() * 3); // 3-5
          const comment =
            REVIEW_COMMENTS[Math.floor(Math.random() * REVIEW_COMMENTS.length)];

          reviewData.push({
            restaurant_id: rest.id,
            customer_id: cust.id,
            customer_name: `${cust.first_name} ${cust.last_name}`,
            rating,
            comment,
            helpful: Math.floor(Math.random() * 15),
            created_at: daysAgo(Math.floor(Math.random() * 30)),
            updated_at: daysAgo(Math.floor(Math.random() * 30)),
          });
        }
      }

      if (reviewData.length > 0) {
        const { error } = await supabase.from("reviews").insert(reviewData);
        if (error) console.error("   Extra reviews error:", error.message);
        else
          console.log(
            `✅  Reviews for extra restaurants: ${reviewData.length}`,
          );
      }
    }
  }

  // ── Update restaurant ratings from reviews ────────────────────────────
  const { data: allRestaurants } = await supabase
    .from("restaurants")
    .select("id");

  if (allRestaurants) {
    for (const rest of allRestaurants) {
      const { data: revs } = await supabase
        .from("reviews")
        .select("rating")
        .eq("restaurant_id", rest.id);

      if (revs && revs.length > 0) {
        const avg =
          revs.reduce((s: number, r: any) => s + r.rating, 0) / revs.length;
        await supabase
          .from("restaurants")
          .update({
            rating: Math.round(avg * 10) / 10,
            review_count: revs.length,
          })
          .eq("id", rest.id);
      }
    }
    console.log(`✅  Restaurant ratings updated`);
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
