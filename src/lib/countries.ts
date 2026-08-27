export interface Country {
  code: string;      // ISO 3166-1 alpha-2
  name: string;
  dialCode: string;
  flag: string;      // Emoji flag
}

export const countries: Country[] = [
  // East Africa
  { code: "RW", name: "Rwanda",          dialCode: "+250", flag: "🇷🇼" },
  { code: "KE", name: "Kenya",           dialCode: "+254", flag: "🇰🇪" },
  { code: "UG", name: "Uganda",          dialCode: "+256", flag: "🇺🇬" },
  { code: "TZ", name: "Tanzania",        dialCode: "+255", flag: "🇹🇿" },
  { code: "BI", name: "Burundi",         dialCode: "+257", flag: "🇧🇮" },
  { code: "SS", name: "South Sudan",     dialCode: "+211", flag: "🇸🇸" },
  { code: "CD", name: "Congo (DRC)",     dialCode: "+243", flag: "🇨🇩" },
  { code: "ET", name: "Ethiopia",        dialCode: "+251", flag: "🇪🇹" },
  { code: "SO", name: "Somalia",         dialCode: "+252", flag: "🇸🇴" },
  { code: "DJ", name: "Djibouti",        dialCode: "+253", flag: "🇩🇯" },
  { code: "MG", name: "Madagascar",      dialCode: "+261", flag: "🇲🇬" },
  { code: "MZ", name: "Mozambique",      dialCode: "+258", flag: "🇲🇿" },
  { code: "ZM", name: "Zambia",          dialCode: "+260", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe",        dialCode: "+263", flag: "🇿🇼" },
  { code: "MW", name: "Malawi",          dialCode: "+265", flag: "🇲🇼" },

  // Africa
  { code: "NG", name: "Nigeria",         dialCode: "+234", flag: "🇳🇬" },
  { code: "ZA", name: "South Africa",    dialCode: "+27",  flag: "🇿🇦" },
  { code: "GH", name: "Ghana",           dialCode: "+233", flag: "🇬🇭" },
  { code: "SN", name: "Senegal",         dialCode: "+221", flag: "🇸🇳" },
  { code: "CM", name: "Cameroon",        dialCode: "+237", flag: "🇨🇲" },
  { code: "CI", name: "Ivory Coast",     dialCode: "+225", flag: "🇨🇮" },
  { code: "EG", name: "Egypt",           dialCode: "+20",  flag: "🇪🇬" },
  { code: "MA", name: "Morocco",         dialCode: "+212", flag: "🇲🇦" },
  { code: "TN", name: "Tunisia",         dialCode: "+216", flag: "🇹🇳" },
  { code: "DZ", name: "Algeria",         dialCode: "+213", flag: "🇩🇿" },
  { code: "UG", name: "Uganda",          dialCode: "+256", flag: "🇺🇬" },
  { code: "BF", name: "Burkina Faso",    dialCode: "+226", flag: "🇧🇫" },
  { code: "ML", name: "Mali",            dialCode: "+223", flag: "🇲🇱" },
  { code: "NE", name: "Niger",           dialCode: "+227", flag: "🇳🇪" },
  { code: "TD", name: "Chad",            dialCode: "+235", flag: "🇹🇩" },
  { code: "CG", name: "Congo",           dialCode: "+242", flag: "🇨🇬" },
  { code: "GA", name: "Gabon",           dialCode: "+241", flag: "🇬🇦" },
  { code: "AO", name: "Angola",          dialCode: "+244", flag: "🇦🇴" },
  { code: "MU", name: "Mauritius",       dialCode: "+230", flag: "🇲🇺" },
  { code: "RW", name: "Rwanda",          dialCode: "+250", flag: "🇷🇼" },
  { code: "NA", name: "Namibia",         dialCode: "+264", flag: "🇳🇦" },
  { code: "BW", name: "Botswana",        dialCode: "+267", flag: "🇧🇼" },
  { code: "SZ", name: "Eswatini",        dialCode: "+268", flag: "🇸🇿" },
  { code: "LS", name: "Lesotho",         dialCode: "+266", flag: "🇱🇸" },

  // North America
  { code: "US", name: "United States",   dialCode: "+1",   flag: "🇺🇸" },
  { code: "CA", name: "Canada",          dialCode: "+1",   flag: "🇨🇦" },
  { code: "MX", name: "Mexico",          dialCode: "+52",  flag: "🇲🇽" },

  // Europe
  { code: "GB", name: "United Kingdom",  dialCode: "+44",  flag: "🇬🇧" },
  { code: "DE", name: "Germany",         dialCode: "+49",  flag: "🇩🇪" },
  { code: "FR", name: "France",          dialCode: "+33",  flag: "🇫🇷" },
  { code: "IT", name: "Italy",           dialCode: "+39",  flag: "🇮🇹" },
  { code: "ES", name: "Spain",           dialCode: "+34",  flag: "🇪🇸" },
  { code: "PT", name: "Portugal",        dialCode: "+351", flag: "🇵🇹" },
  { code: "NL", name: "Netherlands",     dialCode: "+31",  flag: "🇳🇱" },
  { code: "BE", name: "Belgium",         dialCode: "+32",  flag: "🇧🇪" },
  { code: "CH", name: "Switzerland",     dialCode: "+41",  flag: "🇨🇭" },
  { code: "AT", name: "Austria",         dialCode: "+43",  flag: "🇦🇹" },
  { code: "SE", name: "Sweden",          dialCode: "+46",  flag: "🇸🇪" },
  { code: "NO", name: "Norway",          dialCode: "+47",  flag: "🇳🇴" },
  { code: "DK", name: "Denmark",         dialCode: "+45",  flag: "🇩🇰" },
  { code: "FI", name: "Finland",         dialCode: "+358", flag: "🇫🇮" },
  { code: "IE", name: "Ireland",         dialCode: "+353", flag: "🇮🇪" },
  { code: "PL", name: "Poland",          dialCode: "+48",  flag: "🇵🇱" },
  { code: "CZ", name: "Czech Republic",  dialCode: "+420", flag: "🇨🇿" },
  { code: "RO", name: "Romania",         dialCode: "+40",  flag: "🇷🇴" },
  { code: "HU", name: "Hungary",         dialCode: "+36",  flag: "🇭🇺" },
  { code: "GR", name: "Greece",          dialCode: "+30",  flag: "🇬🇷" },
  { code: "UA", name: "Ukraine",         dialCode: "+380", flag: "🇺🇦" },
  { code: "BG", name: "Bulgaria",        dialCode: "+359", flag: "🇧🇬" },
  { code: "HR", name: "Croatia",         dialCode: "+385", flag: "🇭🇷" },
  { code: "RS", name: "Serbia",          dialCode: "+381", flag: "🇷🇸" },
  { code: "SK", name: "Slovakia",        dialCode: "+421", flag: "🇸🇰" },
  { code: "LT", name: "Lithuania",       dialCode: "+370", flag: "🇱🇹" },
  { code: "LV", name: "Latvia",          dialCode: "+371", flag: "🇱🇻" },
  { code: "EE", name: "Estonia",         dialCode: "+372", flag: "🇪🇪" },

  // Asia
  { code: "IN", name: "India",           dialCode: "+91",  flag: "🇮🇳" },
  { code: "PK", name: "Pakistan",        dialCode: "+92",  flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh",      dialCode: "+880", flag: "🇧🇩" },
  { code: "LK", name: "Sri Lanka",       dialCode: "+94",  flag: "🇱🇰" },
  { code: "NP", name: "Nepal",           dialCode: "+977", flag: "🇳🇵" },
  { code: "PH", name: "Philippines",     dialCode: "+63",  flag: "🇵🇭" },
  { code: "ID", name: "Indonesia",       dialCode: "+62",  flag: "🇮🇩" },
  { code: "MY", name: "Malaysia",        dialCode: "+60",  flag: "🇲🇾" },
  { code: "SG", name: "Singapore",       dialCode: "+65",  flag: "🇸🇬" },
  { code: "TH", name: "Thailand",        dialCode: "+66",  flag: "🇹🇭" },
  { code: "VN", name: "Vietnam",         dialCode: "+84",  flag: "🇻🇳" },
  { code: "KH", name: "Cambodia",        dialCode: "+855", flag: "🇰🇭" },
  { code: "MM", name: "Myanmar",         dialCode: "+95",  flag: "🇲🇲" },
  { code: "JP", name: "Japan",           dialCode: "+81",  flag: "🇯🇵" },
  { code: "KR", name: "South Korea",     dialCode: "+82",  flag: "🇰🇷" },
  { code: "CN", name: "China",           dialCode: "+86",  flag: "🇨🇳" },
  { code: "HK", name: "Hong Kong",       dialCode: "+852", flag: "🇭🇰" },
  { code: "TW", name: "Taiwan",          dialCode: "+886", flag: "🇹🇼" },
  { code: "BD", name: "Bangladesh",      dialCode: "+880", flag: "🇧🇩" },
  { code: "TR", name: "Turkey",          dialCode: "+90",  flag: "🇹🇷" },
  { code: "AE", name: "UAE",             dialCode: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia",    dialCode: "+966", flag: "🇸🇦" },
  { code: "QA", name: "Qatar",           dialCode: "+974", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait",          dialCode: "+965", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain",         dialCode: "+973", flag: "🇧🇭" },
  { code: "OM", name: "Oman",            dialCode: "+968", flag: "🇴🇲" },
  { code: "JO", name: "Jordan",          dialCode: "+962", flag: "🇯🇴" },
  { code: "LB", name: "Lebanon",         dialCode: "+961", flag: "🇱🇧" },
  { code: "IL", name: "Israel",          dialCode: "+972", flag: "🇮🇱" },
  { code: "IQ", name: "Iraq",            dialCode: "+964", flag: "🇮🇶" },
  { code: "IR", name: "Iran",            dialCode: "+98",  flag: "🇮🇷" },
  { code: "AF", name: "Afghanistan",     dialCode: "+93",  flag: "🇦🇫" },

  // Oceania
  { code: "AU", name: "Australia",       dialCode: "+61",  flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand",     dialCode: "+64",  flag: "🇳🇿" },

  // South America
  { code: "BR", name: "Brazil",          dialCode: "+55",  flag: "🇧🇷" },
  { code: "AR", name: "Argentina",       dialCode: "+54",  flag: "🇦🇷" },
  { code: "CO", name: "Colombia",        dialCode: "+57",  flag: "🇨🇴" },
  { code: "CL", name: "Chile",           dialCode: "+56",  flag: "🇨🇱" },
  { code: "PE", name: "Peru",            dialCode: "+51",  flag: "🇵🇪" },
  { code: "VE", name: "Venezuela",       dialCode: "+58",  flag: "🇻🇪" },
  { code: "EC", name: "Ecuador",         dialCode: "+593", flag: "🇪🇨" },
  { code: "BO", name: "Bolivia",         dialCode: "+591", flag: "🇧🇴" },
  { code: "PY", name: "Paraguay",        dialCode: "+595", flag: "🇵🇾" },
  { code: "UY", name: "Uruguay",         dialCode: "+598", flag: "🇺🇾" },
  { code: "GY", name: "Guyana",          dialCode: "+592", flag: "🇬🇾" },
];

// Default country
export const DEFAULT_COUNTRY = countries.find((c) => c.code === "RW")!;

// Search countries by name or dial code
export function searchCountries(query: string): Country[] {
  const q = query.toLowerCase().trim();
  if (!q) return countries;
  return countries.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q),
  );
}
