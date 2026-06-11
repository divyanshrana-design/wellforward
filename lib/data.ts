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
  instagram?: string;
  linkedin?: string;
  avatarColor: string;
  isNew?: boolean;
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
  email?: string;
  linkedin?: string;
  avatarColor: string;
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
  "Engineering",
  "Arts & Humanities",
  "Science",
  "Law",
  "Medicine",
  "Social Sciences",
];

export const PROGRAMMES: Record<string, string[]> = {
  "Smurfit Business School": [
    "MSc Business Analytics",
    "MSc Management (Business)",
    "MSc Management (Corporate Finance)",
    "MSc Management (Marketing)",
    "MSc Human Resource Management",
    "MSc Project Management",
    "MSc Supply Chain Management",
    "MSc International Business",
    "MBA",
    "MSc Accounting",
    "MSc Finance",
    "MSc Digital Marketing",
  ],
  "Engineering": [
    "MSc Computer Science",
    "MSc Data Science",
    "MSc Electrical Engineering",
    "MSc Civil Engineering",
    "MSc Mechanical Engineering",
    "BE Computer Science",
    "BE Civil Engineering",
  ],
  "Arts & Humanities": [
    "MA International Relations",
    "MA Cultural Policy",
    "BA English & History",
    "BA Philosophy",
    "MA Linguistics",
  ],
  "Science": [
    "MSc Bioinformatics",
    "MSc Biotechnology",
    "BSc Mathematics",
    "MSc Physics",
    "MSc Environmental Science",
  ],
  "Law": ["LLM International Commercial Law", "BCL Law", "LLM", "Diploma in Professional Legal Studies"],
  "Medicine": ["Medicine (MB BCh BAO)", "MSc Public Health", "MSc Physiotherapy"],
  "Social Sciences": ["MSc Social Policy", "MA Sociology", "MSc Psychology"],
};

// ─── Seed Data: Student Profiles ─────────────────────────────────────────────

export const STUDENT_PROFILES: StudentProfile[] = [
  {
    id: "1",
    name: "Mei Lin",
    course: "MSc Business Analytics",
    school: "Smurfit Business School",
    year: "2024/25",
    country: "China",
    countryFlag: "🇨🇳",
    bio: "Looking for someone to grab coffee with between lectures, or explore Dublin on weekends. Love hiking and terrible at directions 😅",
    tags: ["Coffee shops", "Hiking", "Photography", "Cooking"],
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    avatarColor: "from-violet-400 to-purple-600",
    isNew: true,
  },
  {
    id: "2",
    name: "Arjun",
    course: "MSc Computer Science",
    school: "Engineering",
    year: "2024/25",
    country: "India",
    countryFlag: "🇮🇳",
    bio: "First time in Ireland, still figuring out the buses. Into gaming, football, and finding the best curry in Dublin.",
    tags: ["Gaming", "Football", "Coding", "Live music"],
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    avatarColor: "from-blue-400 to-indigo-600",
    isNew: true,
  },
  {
    id: "3",
    name: "Sofia",
    course: "MSc International Business",
    school: "Smurfit Business School",
    year: "2024/25",
    country: "Brazil",
    countryFlag: "🇧🇷",
    bio: "Moved from São Paulo. Finding Dublin quieter than expected but really beautiful. Want to explore every coastal walk possible.",
    tags: ["Hiking", "Travel", "Coffee shops", "Yoga"],
    linkedin: "https://linkedin.com",
    avatarColor: "from-green-400 to-teal-600",
    isNew: false,
  },
  {
    id: "4",
    name: "Kofi",
    course: "MBA",
    school: "Smurfit Business School",
    year: "2024/25",
    country: "Ghana",
    countryFlag: "🇬🇭",
    bio: "MBA student, 5 years in consulting before this. Looking to expand my network and maybe find a 5-a-side football team.",
    tags: ["Football", "Gym", "Travel", "Board games"],
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    avatarColor: "from-orange-400 to-red-500",
    isNew: false,
  },
  {
    id: "5",
    name: "Yuki",
    course: "MSc Data Science",
    school: "Engineering",
    year: "2024/25",
    country: "Japan",
    countryFlag: "🇯🇵",
    bio: "Into coding, anime, and the quieter side of Dublin. Looking for people to visit galleries or walk along the Bray cliff walk with.",
    tags: ["Anime", "Coding", "Art", "Reading"],
    instagram: "https://instagram.com",
    avatarColor: "from-pink-400 to-rose-600",
    isNew: true,
  },
  {
    id: "6",
    name: "Amara",
    course: "MSc Human Resource Management",
    school: "Smurfit Business School",
    year: "2024/25",
    country: "Nigeria",
    countryFlag: "🇳🇬",
    bio: "Arrived from Lagos, very cold, could use a friend to share heating bills with 😂 Genuinely: love music, podcasts, and deep conversations.",
    tags: ["Live music", "Volunteering", "Languages", "Gym"],
    linkedin: "https://linkedin.com",
    avatarColor: "from-yellow-400 to-orange-500",
    isNew: false,
  },
  {
    id: "7",
    name: "Léa",
    course: "MA International Relations",
    school: "Arts & Humanities",
    year: "2024/25",
    country: "France",
    countryFlag: "🇫🇷",
    bio: "From Lyon, addicted to coffee, allergic to bad croissants. Here for the crack (I've been told that's the right spelling).",
    tags: ["Coffee shops", "Languages", "Travel", "Film & TV"],
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    avatarColor: "from-cyan-400 to-blue-500",
    isNew: true,
  },
  {
    id: "8",
    name: "Diego",
    course: "MSc Finance",
    school: "Smurfit Business School",
    year: "2024/25",
    country: "Mexico",
    countryFlag: "🇲🇽",
    bio: "Into markets, running, and pub quizzes. Planning to run the Wicklow Way if I can convince enough people to join.",
    tags: ["Running", "Pub quizzes", "Hiking", "Gym"],
    linkedin: "https://linkedin.com",
    avatarColor: "from-lime-400 to-green-600",
    isNew: false,
  },
  {
    id: "9",
    name: "Priya",
    course: "MSc Marketing",
    school: "Smurfit Business School",
    year: "2024/25",
    country: "India",
    countryFlag: "🇮🇳",
    bio: "Ex-creative, now studying the science behind it. Love K-pop, cooking elaborate meals on Sundays, and finding new coffee shops.",
    tags: ["K-pop", "Cooking", "Coffee shops", "Photography"],
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    avatarColor: "from-purple-400 to-fuchsia-500",
    isNew: true,
  },
  {
    id: "10",
    name: "Tomás",
    course: "BE Civil Engineering",
    school: "Engineering",
    year: "2024/25",
    country: "Colombia",
    countryFlag: "🇨🇴",
    bio: "Big on cycling — already mapped out half the Greenways. Also very into board games if anyone wants to start a weekly thing.",
    tags: ["Cycling", "Board games", "Hiking", "Football"],
    instagram: "https://instagram.com",
    avatarColor: "from-teal-400 to-cyan-600",
    isNew: false,
  },
  {
    id: "11",
    name: "Hana",
    course: "MSc Biotechnology",
    school: "Science",
    year: "2024/25",
    country: "South Korea",
    countryFlag: "🇰🇷",
    bio: "Science nerd, K-pop enthusiast, and trying to learn enough Irish to get through a pub quiz. Looking for study buddies and weekend adventures.",
    tags: ["K-pop", "Reading", "Swimming", "Languages"],
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    avatarColor: "from-rose-400 to-pink-600",
    isNew: true,
  },
  {
    id: "12",
    name: "Omar",
    course: "LLM International Commercial Law",
    school: "Law",
    year: "2024/25",
    country: "Egypt",
    countryFlag: "🇪🇬",
    bio: "Lawyer by training, student by choice. Here to meet interesting people and debate anything. Also a surprisingly good cook.",
    tags: ["Cooking", "Travel", "Reading", "Pub quizzes"],
    linkedin: "https://linkedin.com",
    avatarColor: "from-amber-400 to-yellow-500",
    isNew: false,
  },
];

// ─── Seed Data: Senior Profiles ───────────────────────────────────────────────

export const SENIOR_PROFILES: SeniorProfile[] = [
  {
    id: "s1",
    name: "Rachel Chen",
    programme: "MSc Business Analytics",
    school: "Smurfit Business School",
    graduationYear: "2024",
    country: "China",
    countryFlag: "🇨🇳",
    askMeAbout: "IRP appointments, finding housing, Smurfit social life",
    bio: "I arrived in Dublin with two suitcases and absolutely no idea what an IRP was. A year later I'm still here doing a placement. Reach out — I was exactly where you are twelve months ago and I'm happy to chat about anything, no question too small.",
    email: "mailto:r.chen@ucdconnect.ie",
    linkedin: "https://linkedin.com",
    avatarColor: "from-violet-400 to-purple-600",
  },
  {
    id: "s2",
    name: "James Okafor",
    programme: "MBA",
    school: "Smurfit Business School",
    graduationYear: "2024",
    country: "Nigeria",
    countryFlag: "🇳🇬",
    askMeAbout: "Career services, networking events, surviving case studies",
    bio: "Did the full MBA — the panic, the group projects, the career fair, the placement. I know which parts of the programme to lean into and which parts to survive. Happy to review your CV or just tell you which lecturers actually answer emails.",
    email: "mailto:j.okafor@ucdconnect.ie",
    linkedin: "https://linkedin.com",
    avatarColor: "from-orange-400 to-amber-500",
  },
  {
    id: "s3",
    name: "Ana Martínez",
    programme: "MSc Project Management",
    school: "Smurfit Business School",
    graduationYear: "2024",
    country: "Spain",
    countryFlag: "🇪🇸",
    askMeAbout: "Banking, cheap eats in Blackrock, group project dynamics",
    bio: "Project management at Smurfit is intense but manageable once you understand the rhythm. I also had to navigate setting up a bank account and getting my PPS in the first week — I can walk you through all of that.",
    email: "mailto:a.martinez@ucdconnect.ie",
    linkedin: "https://linkedin.com",
    avatarColor: "from-red-400 to-rose-500",
  },
  {
    id: "s4",
    name: "Ravi Sharma",
    programme: "MSc Computer Science",
    school: "Engineering",
    graduationYear: "2024",
    country: "India",
    countryFlag: "🇮🇳",
    askMeAbout: "UCD Belfield campus, research modules, internships in tech",
    bio: "Belfield is a completely different vibe from Smurfit — bigger, easier to get lost in. I did a research placement with a startup in Dublin through the programme. Ask me anything about the tech scene in Dublin or how to navigate the CS modules.",
    email: "mailto:r.sharma@ucdconnect.ie",
    linkedin: "https://linkedin.com",
    avatarColor: "from-blue-400 to-indigo-500",
  },
  {
    id: "s5",
    name: "Zara Ahmed",
    programme: "MSc Human Resource Management",
    school: "Smurfit Business School",
    graduationYear: "2024",
    country: "Pakistan",
    countryFlag: "🇵🇰",
    askMeAbout: "Making friends as an international student, mental health resources",
    bio: "I want to be honest: the first semester was lonely and I didn't expect that. By semester two I had a great group. I'm happy to talk about the social side of being international at UCD — the real stuff, not the glossy version.",
    email: "mailto:z.ahmed@ucdconnect.ie",
    linkedin: "https://linkedin.com",
    avatarColor: "from-green-400 to-teal-500",
  },
  {
    id: "s6",
    name: "Luca Ferrari",
    programme: "MSc Finance",
    school: "Smurfit Business School",
    graduationYear: "2024",
    country: "Italy",
    countryFlag: "🇮🇹",
    askMeAbout: "Finance industry in Dublin, DART vs bus to campus, housing areas",
    bio: "Finance at Smurfit opened a lot of doors in Dublin's IFSC. I'll tell you which financial firms recruit from Smurfit, which areas to live near the campus in Blackrock, and whether Revolut is enough of a bank account (short answer: not really).",
    email: "mailto:l.ferrari@ucdconnect.ie",
    linkedin: "https://linkedin.com",
    avatarColor: "from-cyan-400 to-sky-500",
  },
];

// ─── Checklist Tasks ──────────────────────────────────────────────────────────

export const CHECKLIST_TASKS: ChecklistTask[] = [
  {
    id: "irp",
    title: "IRP — Irish Residence Permit",
    phase: "before",
    icon: "🪪",
    what: "The IRP is your official permission to live in Ireland as a non-EU student. It's issued by the Irish immigration service (ISD) and you need to get it within 90 days of arrival.",
    why: "Without it, you're technically in the country without valid permission. You'll also need it to open a bank account, get a PPS number, and prove your right to work during your studies.",
    howLong: "The appointment itself takes about 20 minutes. But getting an appointment can take weeks — slots open unpredictably on the ISD portal and disappear within minutes.",
    whatToBring: [
      "Valid passport (and all previous passports you've had)",
      "Letter of acceptance from UCD",
      "Proof of accommodation in Ireland",
      "Private health insurance (required by law)",
      "Evidence of financial means (€10,000 per year recommended)",
      "€300 registration fee (card payment only at the GNIB office in Dublin)",
      "2 passport photos",
    ],
    pitfall: "The #1 mistake: waiting too long to book. Slots on inisonline.ie go live at random hours and get snapped up fast. Set a reminder to check the site at midnight and early morning. If you can't get an appointment in time, email the ISD — they have a process for this, but it's stressful.",
    link: "https://www.irishimmigration.ie/registering-your-immigration-permission/how-to-register-your-immigration-permission/",
    linkLabel: "ISD Registration Guide →",
  },
  {
    id: "pps",
    title: "PPS Number",
    phase: "week1",
    icon: "🔢",
    what: "Your Personal Public Service number — Ireland's equivalent of a National Insurance or Social Security number. It's a 7-character number that identifies you for all government services.",
    why: "You need it to work (even part-time), access public healthcare, sign up for utilities, and sometimes for private services like gyms. It's not urgent in week 1 but get it early.",
    howLong: "The online application takes 10 minutes. You'll get a letter in the post with your number in about 5–10 working days.",
    whatToBring: [
      "Proof of identity (passport)",
      "Proof of address in Ireland (a utility bill or bank statement with your address)",
      "Reason for applying (employment, student, etc.)",
    ],
    pitfall: "You can't get a PPS number until you have a permanent address in Ireland — a hostel or temporary Airbnb usually won't count. Sort your accommodation first.",
    link: "https://www.mywelfare.ie/",
    linkLabel: "Apply on MyWelfare.ie →",
  },
  {
    id: "leap",
    title: "Student Leap Card",
    phase: "week1",
    icon: "🚌",
    what: "A discounted travel card for students in Ireland. Works on Dublin Bus, DART, Luas, and most buses nationwide. Student fares are significantly cheaper than regular fares.",
    why: "Dublin's public transport adds up fast. A monthly Student Leap Card pays for itself in about a week of commuting. It also just makes getting around much easier — tap in, tap out, don't think about it.",
    howLong: "Apply online in 15 minutes. The physical card arrives in 7–10 working days. Use the digital version in the app in the meantime.",
    whatToBring: [
      "UCD student email and ID number",
      "Passport photo (digital upload)",
      "Credit/debit card for payment",
    ],
    pitfall: "Your UCD student number is not the same as your UCD student ID number — use the one on your student card, not your admission letter.",
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
    what: "A GP (General Practitioner) is a family doctor — they're the first port of call for any health issue in Ireland. Unlike many countries, you can't just walk into a hospital for non-emergencies. Your GP is the gatekeeper.",
    why: "If you get sick (and everyone does at some point), you'll need a GP referral to see a specialist. A GP appointment costs €50–€65 privately. Register early because popular practices often have full lists.",
    howLong: "Phone or email registration takes 5 minutes. Some practices require an in-person registration appointment.",
    whatToBring: [
      "Passport/ID",
      "Proof of address",
      "Previous medical history if relevant",
    ],
    pitfall: "Belfield students: go to the UCD Student Health Service on campus first — it's specifically for students and cheaper. Smurfit students in Blackrock: register with a local Blackrock/Stillorgan GP.",
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
    pitfall: "GoMo (€9.99/month, unlimited data on Three's network) is widely considered the best value SIM for students. Buy it in a Tesco. Three is the main network it runs on — coverage is good in Dublin but patchy in rural areas.",
    link: "https://gomo.ie/",
    linkLabel: "GoMo — Best Value SIM →",
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
    pitfall: "Check that the property is registered with the RTB (Residential Tenancies Board). Unregistered rentals have fewer protections. Threshold (the housing charity) offers free legal advice — use it if anything seems off.",
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
    pitfall: "Don't skip the online registration steps — many students assume they're registered when they've just accepted an offer. Full module registration happens separately on SISWeb.",
    link: "https://sisweb.ucd.ie/",
    linkLabel: "UCD SISWeb →",
  },
  {
    id: "mygovid",
    title: "MyGovID Setup",
    phase: "month1",
    icon: "🔐",
    what: "MyGovID is Ireland's digital identity platform — a single login for all government services. You'll use it to access welfare services, tax information, and eventually apply for driving licences.",
    why: "Once you have your PPS, setting up MyGovID takes 10 minutes and saves time accessing government services later in the year.",
    howLong: "10–20 minutes online, may require a video verification call.",
    whatToBring: ["Your PPS number", "Passport", "Irish mobile number"],
    pitfall: "Verified MyGovID requires additional steps — the basic account works for most student needs.",
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
    pitfall: "Lidl and Aldi are dramatically cheaper than Tesco and Dunnes for basics. For home-country ingredients: Asian Market (Drury St, city centre) has huge variety; there are Indian and Polish grocers scattered across Dublin — Google 'Indian grocery [your area]'.",
    link: "https://www.asian-market.ie/",
    linkLabel: "Asian Market, Drury St →",
  },
];

// ─── Glossary Terms ───────────────────────────────────────────────────────────

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "g1",
    term: "GP",
    definition: "General Practitioner — your family doctor. The first stop for any health issue in Ireland. Not free (€50–65 a visit unless you have a medical card), but essential. Book one before you need one.",
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
    definition: "Personal Public Service number — Ireland's equivalent of a National Insurance number. You need it to work, access government services, and more. Get it from MyWelfare.ie.",
    category: "official",
  },
  {
    id: "g4",
    term: "Leap Card",
    definition: "Ireland's travel card — tap it to pay for buses, DART, and Luas. The Student Leap Card gets you cheaper fares. Worth getting in your first week.",
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
    definition: "Dublin Area Rapid Transit — a commuter rail line running along the coast from Howth in the north to Greystones in the south. Smurfit students at Blackrock campus use it daily.",
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
    definition: "A chip shop — a takeaway serving fish and chips, battered sausages, and curry sauce. A sacred Dublin institution. Your first trip to Leo Burdock or Beshoff's is a rite of passage.",
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
    definition: "Transport for Ireland — the national transport authority. Their app (TFI Live) shows real-time bus arrivals. Download it immediately.",
    category: "transport",
  },
  {
    id: "g15",
    term: "MyGovID",
    definition: "Ireland's digital identity system — like a national login for all government websites. Set it up once you have your PPS number.",
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
    quote: "I even get nervous when locals greet me with 'how are you' — I struggle with natural replies.",
    profile: "Experienced professional, first semester",
    gradient: "from-indigo-400/20 to-blue-500/20",
  },
  {
    id: "v3",
    quote: "Practical daily guidance matters more than pure mental support — knowing what to do on day one would have changed everything.",
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
    quote: "At Smurfit I do feel like the Irish students kind of keep to themselves. Not unfriendly — just… separate.",
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
    quote: "Finding your people is the whole game. Once you do, everything else — the weather, the prices, the paperwork — becomes manageable.",
    profile: "MBA graduate, now working in Dublin",
    gradient: "from-fuchsia-400/20 to-purple-500/20",
  },
];
