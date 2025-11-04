import {
  Booking,
  Certificate,
  Professional,
  Review,
  Service,
  WorkPhoto,
} from "@/types";

export const services: Service[] = [
  { id: 1, name: "Plumber", icon: "water", color: "#3B82F6", jobs: 234 },
  { id: 2, name: "Electrician", icon: "flash", color: "#EAB308", jobs: 189 },
  { id: 3, name: "Teacher", icon: "book", color: "#A855F7", jobs: 312 },
  { id: 4, name: "House Help", icon: "home", color: "#EC4899", jobs: 445 },
  { id: 5, name: "Chef", icon: "restaurant", color: "#F97316", jobs: 156 },
  { id: 6, name: "Driver", icon: "car", color: "#10B981", jobs: 267 },
  { id: 7, name: "Barber", icon: "cut", color: "#EF4444", jobs: 198 },
  { id: 8, name: "Cleaner", icon: "sparkles", color: "#14B8A6", jobs: 321 },
];

export const recentBookings: Booking[] = [
  {
    id: 1,
    professional: "Adebayo Okon",
    service: "Plumber",
    status: "Completed",
    rating: 4.8,
    date: "Oct 28",
    emoji: "👨🏿",
  },
  {
    id: 2,
    professional: "Chioma Nwosu",
    service: "House Help",
    status: "In Progress",
    rating: 4.9,
    date: "Nov 2",
    emoji: "👩🏿",
  },
  {
    id: 3,
    professional: "Ibrahim Musa",
    service: "Electrician",
    status: "Scheduled",
    rating: 4.7,
    date: "Nov 5",
    emoji: "👨🏿",
  },
];

export const featuredPros: Professional[] = [
  {
    id: 1,
    name: "Funke Akande",
    service: "Teacher",
    rating: 4.9,
    jobs: 156,
    rate: "₦5,000/hr",
    emoji: "👩🏿‍🏫",
  },
  {
    id: 2,
    name: "Emeka Okafor",
    service: "Plumber",
    rating: 4.8,
    jobs: 203,
    rate: "₦8,000/job",
    emoji: "👨🏿‍🔧",
  },
  {
    id: 3,
    name: "Aisha Bello",
    service: "Chef",
    rating: 5.0,
    jobs: 89,
    rate: "₦15,000/day",
    emoji: "👩🏿‍🍳",
  },
];

export const professional = {
  id: 2,
  name: "Emeka Okafor",
  service: "Professional Plumber",
  rating: 4.8,
  reviews: 156,
  jobs: 203,
  rate: "₦8,000/job",
  hourlyRate: 8000,
  emoji: "👨🏿‍🔧",
  location: "Lekki, Lagos",
  availability: "Available Today",
  memberSince: "2018",
  responseTime: "~10 mins",
  completionRate: "98%",
  verified: true,
  about:
    "Professional plumber with 8+ years experience in residential and commercial plumbing. Specialized in modern plumbing systems, leak detection, and emergency repairs. Licensed and insured with a commitment to quality workmanship and customer satisfaction.",
  languages: ["English", "Igbo", "Yoruba"],
  skills: [
    "Pipe Installation",
    "Leak Repairs",
    "Drain Cleaning",
    "Water Heater",
    "Bathroom Fitting",
    "Kitchen Plumbing",
  ],
};

export const workPhotos: WorkPhoto[] = [
  {
    id: 1,
    url: "🚿",
    title: "Bathroom Renovation",
    date: "Oct 2024",
    likes: 45,
  },
  {
    id: 2,
    url: "🔧",
    title: "Kitchen Sink Installation",
    date: "Oct 2024",
    likes: 32,
  },
  {
    id: 3,
    url: "💧",
    title: "Water Heater Setup",
    date: "Sep 2024",
    likes: 28,
  },
  {
    id: 4,
    url: "🛁",
    title: "Bathtub Installation",
    date: "Sep 2024",
    likes: 51,
  },
  {
    id: 5,
    url: "🚰",
    title: "Modern Faucet Install",
    date: "Aug 2024",
    likes: 39,
  },
  {
    id: 6,
    url: "🏠",
    title: "Full House Plumbing",
    date: "Aug 2024",
    likes: 67,
  },
];

export const reviews: Review[] = [
  {
    id: 1,
    name: "Tunde Adeyemi",
    rating: 5,
    comment:
      "Excellent work! Very professional and punctual. Fixed my kitchen plumbing issues quickly and explained everything clearly.",
    date: "2 days ago",
    emoji: "👨🏿",
    helpful: 12,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    rating: 5,
    comment:
      "Fixed my kitchen sink perfectly. Highly recommend! Best plumber I've worked with in Lagos.",
    date: "1 week ago",
    emoji: "👩🏿",
    helpful: 8,
  },
  {
    id: 3,
    name: "Chidi Okonkwo",
    rating: 4,
    comment:
      "Good service, fair pricing. Came on time and completed the job as promised.",
    date: "2 weeks ago",
    emoji: "👨🏿",
    helpful: 5,
  },
  {
    id: 4,
    name: "Amara Nnamdi",
    rating: 5,
    comment:
      "Absolutely fantastic! Solved a complex leak issue that others couldn't fix. Very knowledgeable.",
    date: "3 weeks ago",
    emoji: "👩🏿",
    helpful: 15,
  },
  {
    id: 5,
    name: "Bola Adebayo",
    rating: 5,
    comment:
      "Professional and courteous. Will definitely hire again for future projects.",
    date: "1 month ago",
    emoji: "👨🏿",
    helpful: 6,
  },
];

export const certificates: Certificate[] = [
  {
    id: 1,
    title: "Master Plumber Certification",
    issuer: "NAPB",
    year: "2019",
    verified: true,
  },
  {
    id: 2,
    title: "Gas Fitting License",
    issuer: "Lagos State Govt",
    year: "2020",
    verified: true,
  },
  {
    id: 3,
    title: "Advanced Drain Systems",
    issuer: "IPLN",
    year: "2021",
    verified: true,
  },
];
