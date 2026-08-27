export const restaurantProfile = {
  name: "Fork & Knife",
  ownerName: "Robert Fisher",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop",
};

export const dashboardMetrics = {
  totalSales: { value: "$385,432", change: 20, label: "Than Yesterday" },
  totalOrders: { value: "342", change: 12, label: "Than Yesterday" },
  bookings: { value: "197", change: 13, label: "Than Yesterday" },
};

export const salesChartData = [
  { day: "Sun", value: 28, sales: 48200 },
  { day: "Mon", value: 35, sales: 52100 },
  { day: "Tue", value: 50, sales: 68400 },
  { day: "Wed", value: 42, sales: 59800 },
  { day: "Thu", value: 38, sales: 54300 },
  { day: "Fri", value: 45, sales: 62100 },
  { day: "Sat", value: 40, sales: 57600 },
];

export const popularMenuItems = [
  {
    id: "1",
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&h=120&fit=crop",
    revenue: "$12,450",
    change: 18,
  },
  {
    id: "2",
    name: "Spaghetti",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=120&h=120&fit=crop",
    revenue: "$9,820",
    change: 12,
  },
  {
    id: "3",
    name: "Chips",
    image: "https://images.unsplash.com/photo-1573080496219-998f39ebbd5a?w=120&h=120&fit=crop",
    revenue: "$6,340",
    change: 8,
  },
];

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  mealTimes: string[];
  priceRange: string;
  promo?: string;
  rating: number;
  reviews: number;
  orders: number;
  favourites: number;
  description: string;
  ingredients: string[];
  reviewSnippets: { author: string; text: string; avatar: string }[];
};

export const menuCategories = ["Pizza", "Chicken", "Pasta", "Salad", "Desserts", "Burger", "Seafood"];
export const mealTimes = ["Breakfast", "Lunch", "Dinner", "Snack"];
export const priceRanges = ["$5 - $10", "$10 - $20", "$20 - $30", "Above $30"];
export const promos = ["Buy 1 get 1 free", "10% off"];

export const menuItems: MenuItem[] = [
  {
    id: "banana-orange-dessert",
    name: "Banana Orange Dessert",
    category: "Desserts",
    price: 9,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=500&fit=crop",
    mealTimes: ["Snack", "Dinner"],
    priceRange: "$5 - $10",
    rating: 4.6,
    reviews: 45,
    orders: 81,
    favourites: 45,
    description:
      "A refreshing blend of ripe bananas and citrus oranges, layered with honey and a hint of vanilla. Light, creamy, and perfect as a finish to any meal.",
    ingredients: ["Banana", "Orange", "Honey", "Vanilla Extract", "Cinnamon"],
    reviewSnippets: [
      {
        author: "Salah. L",
        text: "Absolutely delicious! The perfect balance of sweet and tangy.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop",
      },
      {
        author: "Maria K.",
        text: "My kids loved it. Will order again for sure!",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop",
      },
    ],
  },
  {
    id: "classic-burger",
    name: "Classic Burger",
    category: "Burger",
    price: 27,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    mealTimes: ["Lunch", "Dinner"],
    priceRange: "$20 - $30",
    rating: 4.8,
    reviews: 120,
    orders: 210,
    favourites: 88,
    description: "Juicy beef patty with fresh lettuce, tomato, and our signature sauce on a toasted brioche bun.",
    ingredients: ["Beef Patty", "Lettuce", "Tomato", "Brioche Bun", "Signature Sauce"],
    reviewSnippets: [
      { author: "James T.", text: "Best burger in town. Cooked perfectly every time.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop" },
      { author: "Amina R.", text: "Generous portion and great flavor.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" },
    ],
  },
  {
    id: "margherita-pizza",
    name: "Margherita Pizza",
    category: "Pizza",
    price: 18,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    mealTimes: ["Lunch", "Dinner"],
    priceRange: "$10 - $20",
    promo: "10% off",
    rating: 4.7,
    reviews: 89,
    orders: 156,
    favourites: 62,
    description: "Wood-fired pizza with fresh mozzarella, basil, and San Marzano tomato sauce.",
    ingredients: ["Mozzarella", "Basil", "Tomato Sauce", "Olive Oil", "Dough"],
    reviewSnippets: [
      { author: "Chris P.", text: "Authentic Italian taste. Crust is amazing.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop" },
      { author: "Elena V.", text: "Fresh ingredients, not too greasy.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop" },
    ],
  },
  {
    id: "caesar-salad",
    name: "Caesar Salad",
    category: "Salad",
    price: 12,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    mealTimes: ["Lunch"],
    priceRange: "$10 - $20",
    rating: 4.4,
    reviews: 34,
    orders: 67,
    favourites: 28,
    description: "Crisp romaine lettuce with parmesan, croutons, and classic Caesar dressing.",
    ingredients: ["Romaine", "Parmesan", "Croutons", "Caesar Dressing", "Lemon"],
    reviewSnippets: [
      { author: "Nina S.", text: "Light and fresh. Perfect side dish.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop" },
      { author: "Tom H.", text: "Good portion size for the price.", avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=64&h=64&fit=crop" },
    ],
  },
  {
    id: "grilled-chicken",
    name: "Grilled Chicken",
    category: "Chicken",
    price: 22,
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
    mealTimes: ["Lunch", "Dinner"],
    priceRange: "$20 - $30",
    rating: 4.5,
    reviews: 56,
    orders: 98,
    favourites: 41,
    description: "Herb-marinated chicken breast served with seasonal vegetables and lemon butter sauce.",
    ingredients: ["Chicken Breast", "Herbs", "Seasonal Vegetables", "Lemon Butter", "Garlic"],
    reviewSnippets: [
      { author: "David M.", text: "Tender and flavorful. Highly recommend.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop" },
      { author: "Lisa W.", text: "Healthy option that still tastes indulgent.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop" },
    ],
  },
  {
    id: "spaghetti-bolognese",
    name: "Spaghetti Bolognese",
    category: "Pasta",
    price: 16,
    image: "https://images.unsplash.com/photo-1622973536968-481d61f9e6ec?w=400&h=300&fit=crop",
    mealTimes: ["Lunch", "Dinner"],
    priceRange: "$10 - $20",
    promo: "Buy 1 get 1 free",
    rating: 4.6,
    reviews: 72,
    orders: 134,
    favourites: 55,
    description: "Slow-cooked beef ragù tossed with al dente spaghetti and finished with parmesan.",
    ingredients: ["Spaghetti", "Beef Ragù", "Parmesan", "Onion", "Tomato"],
    reviewSnippets: [
      { author: "Paul R.", text: "Rich sauce, generous serving.", avatar: "https://images.unsplash.com/photo-1463453091185-320cebbfeaf0?w=64&h=64&fit=crop" },
      { author: "Sara B.", text: "Comfort food at its best.", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=64&h=64&fit=crop" },
    ],
  },
  {
    id: "fruit-platter",
    name: "Seasonal Fruit Platter",
    category: "Desserts",
    price: 14,
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e3c?w=400&h=300&fit=crop",
    mealTimes: ["Breakfast", "Snack"],
    priceRange: "$10 - $20",
    rating: 4.3,
    reviews: 28,
    orders: 52,
    favourites: 19,
    description: "A colorful assortment of seasonal fruits, perfect for sharing.",
    ingredients: ["Strawberry", "Kiwi", "Melon", "Grapes", "Mint"],
    reviewSnippets: [
      { author: "Amy L.", text: "Fresh and beautifully presented.", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=64&h=64&fit=crop" },
      { author: "Mark D.", text: "Great for brunch tables.", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop" },
    ],
  },
  {
    id: "garden-salad",
    name: "Garden Salad",
    category: "Salad",
    price: 11,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    mealTimes: ["Lunch"],
    priceRange: "$10 - $20",
    rating: 4.2,
    reviews: 22,
    orders: 44,
    favourites: 15,
    description: "Mixed greens with cucumber, cherry tomatoes, and balsamic vinaigrette.",
    ingredients: ["Mixed Greens", "Cucumber", "Cherry Tomato", "Balsamic", "Olive Oil"],
    reviewSnippets: [
      { author: "Kate F.", text: "Simple and satisfying.", avatar: "https://images.unsplash.com/photo-1595152772835-e39e27e523c1?w=64&h=64&fit=crop" },
      { author: "Ben C.", text: "Nice crunch, not overdressed.", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303a12?w=64&h=64&fit=crop" },
    ],
  },
  {
    id: "chicken-wings",
    name: "Spicy Chicken Wings",
    category: "Chicken",
    price: 19,
    image: "https://images.unsplash.com/photo-1608039755401-85383b23c0c8?w=400&h=300&fit=crop",
    mealTimes: ["Dinner", "Snack"],
    priceRange: "$10 - $20",
    rating: 4.7,
    reviews: 95,
    orders: 178,
    favourites: 73,
    description: "Crispy wings tossed in our house buffalo sauce with blue cheese dip.",
    ingredients: ["Chicken Wings", "Buffalo Sauce", "Blue Cheese", "Celery", "Butter"],
    reviewSnippets: [
      { author: "Ryan G.", text: "Perfect spice level. Crispy outside.", avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=64&h=64&fit=crop" },
      { author: "Jen P.", text: "Game night favorite at our place.", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=64&h=64&fit=crop" },
    ],
  },
];

export const reservations = [
  { id: "1", time: "06:30 AM", customer: "Telly Joe", phone: "+1 555 0123", status: "Payed" as const, statusType: "time" as const },
  { id: "2", time: "07:15 AM", customer: "RockT", phone: "+1 555 0456", status: "On Dine", statusType: "dine" as const },
  { id: "3", time: "08:00 AM", customer: "Sarah M.", phone: "+1 555 0789", status: "Payed", statusType: "time" as const },
  { id: "4", time: "09:30 AM", customer: "Mike D.", phone: "+1 555 0321", status: "On Dine", statusType: "dine" as const },
  { id: "5", time: "10:00 AM", customer: "Emma L.", phone: "+1 555 0654", status: "Payed", statusType: "time" as const },
];

export type TableStatus = "available" | "on-dine";

export interface FloorTable {
  id: number;
  label: string;
  status: TableStatus;
  shape: "rect-large" | "circle" | "square";
  seats: number;
}

export const floorTables: FloorTable[] = [
  { id: 1, label: "Table #1", status: "available", shape: "rect-large", seats: 6 },
  { id: 2, label: "Table #2", status: "on-dine", shape: "circle", seats: 10 },
  { id: 3, label: "Table #3", status: "on-dine", shape: "rect-large", seats: 6 },
  { id: 4, label: "Table #4", status: "available", shape: "rect-large", seats: 6 },
  { id: 5, label: "Table #5", status: "available", shape: "square", seats: 4 },
  { id: 6, label: "Table #6", status: "on-dine", shape: "square", seats: 4 },
];
