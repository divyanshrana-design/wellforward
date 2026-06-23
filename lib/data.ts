// ─── Types ───────────────────────────────────────────────────────────────────

export interface StudentProfile {
  id: string;
  name: string;
  course: string;
  school: string;
  year: string;
  country: string;
  countryFlag: string;
  bio: string;
  tags: string[];
  instagram?: string | null;
  linkedin?: string | null;
  contactEmail?: string | null;
  avatarColor: string;
  isNew?: boolean;
  photoUrl?: string | null;
}

export interface SeniorProfile {
  id: string;
  name: string;
  programme: string;
  school: string;
  graduationYear: string;
  country: string;
  countryFlag: string;
  askMeAbout: string;
  bio: string;
  email?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  avatarColor: string;
  photoUrl?: string | null;
}

export interface ChecklistTask {
  id: string;
  title: string;
  phase: "before" | "week1" | "month1";
  icon: string;
  what: string;
  why: string;
  howLong: string;
  whatToBring: string[];
  pitfall: string;
  link: string;
  linkLabel: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  pronunciation?: string;
  definition: string;
  category: "official" | "irish-slang" | "transport" | "healthcare";
}

export interface VoiceQuote {
  id: string;
  quote: string;
  profile: string;
  gradient: string;
}

// ─── Interest Tags ────────────────────────────────────────────────────────────

export const INTEREST_TAGS = [
  "Hiking", "Coffee shops", "Gaming", "Cooking", "Football",
  "Photography", "Reading", "Gym", "Live music", "Travel",
  "Languages", "Volunteering", "K-pop", "Anime", "Cycling",
  "Board games", "Yoga", "Clubbing", "Quiet nights in", "Art",
  "Coding", "Film & TV", "Running", "Swimming", "Pub quizzes",
];

export const SCHOOLS = [
  "Smurfit Business School",
];

// Full list of UCD Michael Smurfit Graduate Business School programmes,
// grouped by subject area and ordered to mirror the official Smurfit
// masters listing (smurfitschool.ie/programmes/masters/).
export const PROGRAMMES: Record<string, string[]> = {
  "Smurfit Business School": [
    // Accounting
    "Master of Accounting",
    "MSc Accounting & Financial Management",
    // Finance
    "MSc Aviation Finance",
    "MSc Finance",
    "MSc Financial Data Science",
    "MSc Quantitative Finance",
    "MSc Sustainable Finance",
    // Human Resource Management
    "MSc Human Resource Management",
    // Management
    "MSc Food Business Strategy",
    "MSc International Business",
    "MSc International Management / CEMS MIM",
    "MSc Management",
    "MSc Management Consultancy",
    "MSc Project Management",
    "MSc Project Management (Online, Part-Time)",
    "MSc Strategic Management",
    "MSc Sustainable Supply Chain Management",
    // Management Information Systems
    "MSc Business Analytics",
    "MSc Digital Innovation",
    // Marketing
    "MSc Digital Marketing",
    "MSc Marketing",
    "MSc Marketing & Retail Innovation",
    "MSc Marketing Practice",
    // UCD Belfield courses run in conjunction with Smurfit
    "MSc Biotechnology & Business",
    "MSc Biotherapeutics & Business",
    "MSc International Law & Business",
    // MBA
    "Full-Time MBA",
    "Executive MBA",
    // Fallback
    "Other / Not listed",
  ],
};

// ─── Checklist Tasks ──────────────────────────────────────────────────────────

export const CHECKLIST_TASKS: ChecklistTask[] = [
  {
    id: "irp",
    title: "IRP: Irish Residence Permit",
    phase: "before",
    icon: "🪪",
    what: "The IRP is your official permission to live in Ireland as a non-EU student. It's issued by the Irish immigration service (ISD) and you need to get it within 90 days of arrival.",
    why: "Without it, you're technically in the country without valid permission. You'll also need it to open a bank account, get a PPS number, and prove your right to work during your studies.",
    howLong: "The appointment itself takes about 20 minutes. But getting an appointment can take weeks. Slots open unpredictably on the ISD portal and disappear within minutes.",
    whatToBring: [
      "Valid passport (and all previous passports you've had)",
      "Letter of acceptance from UCD",
      "Proof of accommodation in Ireland",
      "Private health insurance (required by law)",
      "Evidence of financial means (€10,000 per year recommended)",
      "€300 registration fee (card payment only at the GNIB office in Dublin)",
      "2 passport photos",
    ],
    pitfall: "The #1 mistake: waiting too long to book. Slots on inisonline.ie go live at random hours and get snapped up fast. Set a reminder to check the site at midnight and early morning. If you can't get an appointment in time, email the ISD directly. They have a process for this, but it is stressful.",
    link: "https://www.irishimmigration.ie/registering-your-immigration-permission/how-to-register-your-immigration-permission/how-to-register-your-immigration-permission-for-the-first-time/",
    linkLabel: "ISD Registration Guide →",
  },
  {
    id: "pps",
    title: "PPS Number",
    phase: "week1",
    icon: "🔢",
    what: "Your Personal Public Service number. Ireland's equivalent of a National Insurance or Social Security number. It's a 7-character number that identifies you for all government services.",
    why: "You need it to work (even part-time), access public healthcare, sign up for utilities, and sometimes for private services like gyms. It's not urgent in week 1 but get it early.",
    howLong: "The online application takes 10 minutes. You'll get a letter in the post with your number in about 5–10 working days.",
    whatToBring: [
      "Proof of identity (passport)",
      "Proof of address in Ireland (a utility bill or bank statement with your address)",
      "Reason for applying (employment, student, etc.)",
    ],
    pitfall: "You can't get a PPS number until you have a permanent address in Ireland. A hostel or temporary Airbnb usually won't count. Sort your accommodation first.",
    link: "https://www.mywelfare.ie/",
    linkLabel: "Apply on MyWelfare.ie →",
  },
  {
    id: "leap",
    title: "Student Leap Card",
    phase: "week1",
    icon: "🚌",
    what: "A discounted travel card for students in Ireland. Works on Dublin Bus, DART, Luas, and most buses nationwide. Student fares are significantly cheaper than regular fares.",
    why: "Dublin's public transport adds up fast. A monthly Student Leap Card pays for itself in about a week of commuting. It also just makes getting around much easier. Tap in, tap out, don't think about it.",
    howLong: "Apply online in 15 minutes. The physical card arrives in 7–10 working days. Use the digital version in the app in the meantime.",
    whatToBring: [
      "UCD student email and ID number",
      "Passport photo (digital upload)",
      "Credit/debit card for payment",
    ],
    pitfall: "Your UCD student number is not the same as your UCD student ID number. Use the one on your student card, not your admission letter.",
    link: "https://www.studentleapcard.ie/",
    linkLabel: "Apply at studentleapcard.ie →",
  },
  {
    id: "bank",
    title: "Bank Account",
    phase: "week1",
    icon: "🏦",
    what: "You'll need an Irish bank account to receive a salary, pay rent (landlords often won't accept foreign accounts), and generally exist financially in Ireland.",
    why: "Revolut is fine as a stopgap for day-to-day spending, but it won't work for paying rent to most landlords, and many employers need a proper Irish IBAN to process payroll.",
    howLong: "AIB and Bank of Ireland both take 1–2 weeks. Revolut is instant. N26 is also an option but requires EU residency.",
    whatToBring: [
      "Passport",
      "Proof of address (the university accommodation letter works in week 1)",
      "Your PPS number (required by BOI, helpful for AIB)",
      "Student ID or UCD acceptance letter",
    ],
    pitfall: "Bank of Ireland explicitly requires a PPS number to open an account. AIB can sometimes open an account without one in the first weeks. Go to AIB first if you haven't got your PPS yet.",
    link: "https://aib.ie/personal/bank-accounts/current-accounts",
    linkLabel: "AIB Student Account →",
  },
  {
    id: "gp",
    title: "Registering with a GP",
    phase: "week1",
    icon: "🩺",
    what: "A GP (General Practitioner) is a family doctor. They are the first port of call for any health issue in Ireland. Unlike many countries, you can't just walk into a hospital for non-emergencies. Your GP is the gatekeeper.",
    why: "If you get sick (and everyone does at some point), you'll need a GP referral to see a specialist. A GP appointment costs €50–€65 privately. Register early because popular practices often have full lists.",
    howLong: "Phone or email registration takes 5 minutes. Some practices require an in-person registration appointment.",
    whatToBring: [
      "Passport/ID",
      "Proof of address",
      "Previous medical history if relevant",
    ],
    pitfall: "UCD has its own Student Health Service on the Belfield campus, and Smurfit students can register with a GP at the Blackrock clinic nearby. The UCD Student Health GP is considerably cheaper than a regular private practice in town (around €30–40 per visit compared to €50–65 elsewhere). It is also staffed by people who understand the student context. Register there first before looking elsewhere.",
    link: "https://www.ucd.ie/studenthealth/",
    linkLabel: "UCD Student Health Service →",
  },
  {
    id: "sim",
    title: "SIM Card",
    phase: "before",
    icon: "📱",
    what: "Irish mobile phone service. You'll want a local number and data plan as soon as you arrive.",
    why: "You need mobile data to navigate Dublin, find your way to campus, and contact your accommodation. Don't rely on Wi-Fi for your first few days.",
    howLong: "Buy a SIM and top up in any convenience store, supermarket, or the network's own shop. Takes 10 minutes.",
    whatToBring: ["Your phone (make sure it's unlocked before travelling)", "Cash or card"],
    pitfall: "48 (runs on Three's network) is the best value SIM for students - unlimited calls, texts and data from €12.99/month. Use the referral link below and you get a €20 voucher on your first top-up. Buy the SIM in any Centra, Spar, or Tesco.",
    link: "https://refer.48.ie/divyanshr-26",
    linkLabel: "Get 48 SIM + €20 voucher →",
  },
  {
    id: "accommodation",
    title: "Understanding Your Accommodation Contract",
    phase: "before",
    icon: "🏠",
    what: "Before you sign anything, understand what you're signing. Irish rental law is complex and landlords vary hugely in quality.",
    why: "Students frequently lose deposits or end up in illegal contracts. Knowing the basics protects you.",
    howLong: "Reading a lease takes an hour. It's worth it.",
    whatToBring: ["The lease document", "Your passport for identity verification"],
    pitfall: "Check that the property is registered with the RTB (Residential Tenancies Board). Unregistered rentals have fewer protections. Threshold (the housing charity) offers free legal advice. Use it if anything seems off.",
    link: "https://www.rtb.ie/",
    linkLabel: "Check RTB Registration →",
  },
  {
    id: "ucd-reg",
    title: "UCD Registration & Student Card",
    phase: "before",
    icon: "🎓",
    what: "Complete your official UCD registration through SISWeb and collect your student card.",
    why: "Your student card is required for the Leap Card application, many discounts in Dublin, and library access.",
    howLong: "SISWeb registration: 20 minutes online. Student card collection: visit the Student Centre at Belfield or the Smurfit main office.",
    whatToBring: ["UCD student number from your offer letter", "Passport photo for student card"],
    pitfall: "Don't skip the online registration steps. Many students assume they're registered when they've just accepted an offer. Full module registration happens separately on SISWeb.",
    link: "https://sisweb.ucd.ie/",
    linkLabel: "UCD SISWeb →",
  },
  {
    id: "mygovid",
    title: "MyGovID Setup",
    phase: "month1",
    icon: "🔐",
    what: "MyGovID is Ireland's digital identity platform. One login for all government services. You'll use it to access welfare services, tax information, and eventually apply for driving licences.",
    why: "Once you have your PPS, setting up MyGovID takes 10 minutes and saves time accessing government services later in the year.",
    howLong: "10–20 minutes online, may require a video verification call.",
    whatToBring: ["Your PPS number", "Passport", "Irish mobile number"],
    pitfall: "Verified MyGovID requires additional steps. The basic account works for most student needs.",
    link: "https://www.mygovid.ie/",
    linkLabel: "Set Up MyGovID →",
  },
  {
    id: "groceries",
    title: "Groceries & Home-Country Food",
    phase: "week1",
    icon: "🛒",
    what: "Finding affordable food and home comforts in Dublin.",
    why: "Knowing where to shop makes a real difference to your budget and mental health in the first few weeks.",
    howLong: "One exploratory trip, then routine.",
    whatToBring: ["Reusable bags (mandatory at checkouts, costs 25c otherwise)", "A list of staples you need"],
    pitfall: "Lidl and Aldi are dramatically cheaper than Tesco and Dunnes for basics. For home-country ingredients: Asian Market (Drury St, city centre) has huge variety; there are Indian and Polish grocers scattered across Dublin. Google 'Indian grocery [your area]'.",
    link: "https://maps.app.goo.gl/7sP2Y3x8K9mQ4vZe8",
    linkLabel: "Asian Market on Google Maps →",
  },
];

// ─── Glossary Terms ───────────────────────────────────────────────────────────

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "g1",
    term: "GP",
    definition: "General Practitioner. Your family doctor. The first stop for any health issue in Ireland. Not free (€50–65 a visit unless you have a medical card), but essential. Book one before you need one.",
    category: "healthcare",
  },
  {
    id: "g2",
    term: "IRP",
    definition: "Irish Residence Permit. The card that proves you have legal permission to live in Ireland. Every non-EU student needs one within 90 days of arrival. See the checklist.",
    category: "official",
  },
  {
    id: "g3",
    term: "PPS Number",
    definition: "Personal Public Service number. Ireland's equivalent of a National Insurance number. You need it to work, access government services, and more. Get it from MyWelfare.ie.",
    category: "official",
  },
  {
    id: "g4",
    term: "Leap Card",
    definition: "Ireland's travel card. Tap it to pay for buses, DART, and Luas. The Student Leap Card gets you cheaper fares. Worth getting in your first week.",
    category: "transport",
  },
  {
    id: "g5",
    term: "Garda",
    pronunciation: "GAR-da",
    definition: "The Irish police. Plural: Gardaí (GAR-dee). Friendly, generally. The Garda National Immigration Bureau (GNIB) handles IRP appointments.",
    category: "official",
  },
  {
    id: "g6",
    term: "RTB",
    definition: "Residential Tenancies Board. The body that regulates renting in Ireland and handles disputes between landlords and tenants. If your landlord is being difficult, the RTB is your friend.",
    category: "official",
  },
  {
    id: "g7",
    term: "DART",
    definition: "Dublin Area Rapid Transit. A commuter rail line running along the coast from Howth in the north to Greystones in the south. Smurfit students at Blackrock campus use it daily.",
    category: "transport",
  },
  {
    id: "g8",
    term: "Luas",
    pronunciation: "LOO-as",
    definition: "Dublin's tram network. Two lines: the Red Line and the Green Line. The Green Line runs through central Dublin and towards Stillorgan, useful for Smurfit students.",
    category: "transport",
  },
  {
    id: "g9",
    term: "The chipper",
    definition: "A chip shop. A takeaway serving fish and chips, battered sausages, and curry sauce. A sacred Dublin institution. Your first trip to Leo Burdock or Beshoff's is a rite of passage.",
    category: "irish-slang",
  },
  {
    id: "g10",
    term: "Grand",
    definition: "Fine, okay, no problem. 'How are you?' → 'Grand, thanks.' The most versatile word in the Irish lexicon. Said by everyone, about everything, all the time.",
    category: "irish-slang",
  },
  {
    id: "g11",
    term: "Press",
    definition: "A cupboard or wardrobe. 'The cups are in the press.' Genuinely confusing the first time you hear it.",
    category: "irish-slang",
  },
  {
    id: "g12",
    term: "The jacks",
    definition: "The toilet / bathroom. 'Just going to the jacks.' Informal. You'll hear it everywhere once you start listening.",
    category: "irish-slang",
  },
  {
    id: "g13",
    term: "The craic",
    pronunciation: "crack",
    definition: "Fun, good times, conversation, atmosphere. 'What's the craic?' means 'what's going on?' or 'how are you?' 'Good craic' is high praise.",
    category: "irish-slang",
  },
  {
    id: "g14",
    term: "TFI",
    definition: "Transport for Ireland. The national transport authority. Their app (TFI Live) shows real-time bus arrivals. Download it immediately.",
    category: "transport",
  },
  {
    id: "g15",
    term: "MyGovID",
    definition: "Ireland's digital identity system. One login for all government websites. Set it up once you have your PPS number.",
    category: "official",
  },
  {
    id: "g16",
    term: "Sláinte",
    pronunciation: "SLAWN-cha",
    definition: "Cheers! What you say when you raise a glass. The most important Irish phrase for pub visits, which in Dublin are somewhat frequent.",
    category: "irish-slang",
  },
];

// ─── Voice Quotes ─────────────────────────────────────────────────────────────

export const VOICE_QUOTES: VoiceQuote[] = [
  {
    id: "v1",
    quote: "I had lots of lonely moments, but luckily I had my flatmate to get me through them.",
    profile: "Fresh graduate, first time abroad",
    gradient: "from-violet-400/20 to-purple-500/20",
  },
  {
    id: "v2",
    quote: "I even get nervous when locals greet me with 'how are you' - I struggle with natural replies.",
    profile: "Experienced professional, first semester",
    gradient: "from-indigo-400/20 to-blue-500/20",
  },
  {
    id: "v3",
    quote: "Practical daily guidance matters more than pure mental support - knowing what to do on day one would have changed everything.",
    profile: "Fresh graduate, third week in Dublin",
    gradient: "from-pink-400/20 to-rose-500/20",
  },
  {
    id: "v4",
    quote: "I couldn't ask my friends back home or my family, because they don't know what I'm currently dealing with.",
    profile: "Postgraduate student, international student network",
    gradient: "from-blue-400/20 to-cyan-500/20",
  },
  {
    id: "v5",
    quote: "At Smurfit I do feel like the Irish students kind of keep to themselves. Not unfriendly - just… separate.",
    profile: "European student, semester two",
    gradient: "from-teal-400/20 to-emerald-500/20",
  },
  {
    id: "v6",
    quote: "It's only one year… so a deep friendship cannot last a long period. That's what a local told me once.",
    profile: "Experienced professional, Smurfit cohort",
    gradient: "from-amber-400/20 to-orange-500/20",
  },
  {
    id: "v7",
    quote: "The city is actually really beautiful and people are genuinely kind. It just takes a few weeks before it starts to feel that way.",
    profile: "Masters student, second month",
    gradient: "from-lime-400/20 to-green-500/20",
  },
  {
    id: "v8",
    quote: "Finding your people is the whole game. Once you do, everything else - the weather, the prices, the paperwork - becomes manageable.",
    profile: "MBA graduate, now working in Dublin",
    gradient: "from-fuchsia-400/20 to-purple-500/20",
  },
];
