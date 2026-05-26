const localCafes = [
  {
    id: 'demo-brown-roastery',
    name: 'BROWN Roastery | BKK',
    description: 'Specialty coffee roastery in BKK1 with strong WiFi and a calm study vibe.',
    tags: ['specialty coffee', 'Fast WiFi', 'Study-friendly'],
    facilities: ['WiFi', 'Seating', 'Study-friendly'],
    rating: 4.7,
    priceLevel: 2,
    wifiSpeed: 80,
    images: ['/images/cafe-placeholder-1.svg'],
    location: { address: 'BKK1, Phnom Penh', googleMapsUrl: 'https://www.google.com/maps/search/BROWN+Roastery+Phnom+Penh' },
    popularity: 90,
    isOpen: true,
    openingHours: {
      Mon: '8:00 AM - 10:00 PM',
      Tue: '8:00 AM - 10:00 PM',
      Wed: '8:00 AM - 10:00 PM',
      Thu: '8:00 AM - 10:00 PM',
      Fri: '8:00 AM - 10:00 PM',
      Sat: '8:00 AM - 11:00 PM',
      Sun: '8:00 AM - 11:00 PM'
    }
  },
  {
    id: 'demo-feel-good',
    name: 'Feel Good Coffee',
    description: 'Bright specialty cafe with reliable Internet and an easy remote-work setup.',
    tags: ['specialty coffee', 'Air conditioning', 'Fast WiFi'],
    facilities: ['WiFi', 'Seating', 'Air conditioning'],
    rating: 4.8,
    priceLevel: 2,
    wifiSpeed: 85,
    images: ['/images/cafe-placeholder-2.svg'],
    location: { address: 'Chamkar Mon, Phnom Penh', googleMapsUrl: 'https://www.google.com/maps/search/Feel+Good+Coffee+Phnom+Penh' },
    popularity: 94,
    isOpen: true,
    openingHours: {
      Mon: '7:30 AM - 9:30 PM',
      Tue: '7:30 AM - 9:30 PM',
      Wed: '7:30 AM - 9:30 PM',
      Thu: '7:30 AM - 9:30 PM',
      Fri: '7:30 AM - 9:30 PM',
      Sat: '8:00 AM - 10:00 PM',
      Sun: '8:00 AM - 10:00 PM'
    }
  },
  {
    id: 'demo-java-tk',
    name: 'Java Creative Cafe Toul Kork',
    description: 'Creative cafe in Toul Kork with a comfortable workspace feel.',
    tags: ['creative', 'Quiet atmosphere', 'Study-friendly'],
    facilities: ['WiFi', 'Seating', 'Quiet atmosphere'],
    rating: 4.4,
    priceLevel: 2,
    wifiSpeed: 72,
    images: ['/images/cafe-placeholder-3.svg'],
    location: { address: 'Tuol Kork, Phnom Penh', googleMapsUrl: 'https://www.google.com/maps/search/Java+Creative+Cafe+Toul+Kork' },
    popularity: 78,
    isOpen: true,
    openingHours: {
      Mon: '8:00 AM - 10:00 PM',
      Tue: '8:00 AM - 10:00 PM',
      Wed: '8:00 AM - 10:00 PM',
      Thu: '8:00 AM - 10:00 PM',
      Fri: '8:00 AM - 10:00 PM',
      Sat: '8:00 AM - 10:00 PM',
      Sun: '8:00 AM - 10:00 PM'
    }
  },
  {
    id: 'demo-backyard',
    name: 'Backyard Cafe',
    description: 'Healthy cafe with outdoor seating and a relaxed neighborhood atmosphere.',
    tags: ['healthy cafe', 'Outdoor seating', 'Family-friendly'],
    facilities: ['WiFi', 'Seating', 'Outdoor seating'],
    rating: 4.5,
    priceLevel: 2,
    wifiSpeed: 70,
    images: ['/images/cafe-placeholder-4.svg'],
    location: { address: 'Daun Penh, Phnom Penh', googleMapsUrl: 'https://www.google.com/maps/search/Backyard+Cafe+Phnom+Penh' },
    popularity: 84,
    isOpen: true,
    openingHours: {
      Mon: '8:00 AM - 9:00 PM',
      Tue: '8:00 AM - 9:00 PM',
      Wed: '8:00 AM - 9:00 PM',
      Thu: '8:00 AM - 9:00 PM',
      Fri: '8:00 AM - 9:00 PM',
      Sat: '8:00 AM - 10:00 PM',
      Sun: '8:00 AM - 10:00 PM'
    }
  },
  {
    id: 'demo-living-room',
    name: 'Living Room',
    description: 'Comfortable and spacious cafe for long study sessions or casual meetings.',
    tags: ['relaxing', 'Fast WiFi', 'Air conditioning'],
    facilities: ['WiFi', 'Seating', 'Air conditioning'],
    rating: 4.3,
    priceLevel: 2,
    wifiSpeed: 75,
    images: ['/images/cafe-placeholder-1.svg'],
    location: { address: 'Phnom Penh', googleMapsUrl: 'https://www.google.com/maps/search/Living+Room+Cafe+Phnom+Penh' },
    popularity: 76,
    isOpen: true,
    openingHours: {
      Mon: '8:00 AM - 10:00 PM',
      Tue: '8:00 AM - 10:00 PM',
      Wed: '8:00 AM - 10:00 PM',
      Thu: '8:00 AM - 10:00 PM',
      Fri: '8:00 AM - 10:00 PM',
      Sat: '8:00 AM - 10:00 PM',
      Sun: '8:00 AM - 10:00 PM'
    }
  },
  {
    id: 'demo-market-cafe',
    name: 'Market Cafe Lounge',
    description: 'Upscale cafe and lounge for work, conversation, and a slower coffee pace.',
    tags: ['lounge', 'Premium', 'Quiet atmosphere'],
    facilities: ['WiFi', 'Seating', 'Lounge'],
    rating: 4.6,
    priceLevel: 3,
    wifiSpeed: 68,
    images: ['/images/cafe-placeholder-2.svg'],
    location: { address: 'Phnom Penh', googleMapsUrl: 'https://www.google.com/maps/search/Market+Cafe+Lounge+Phnom+Penh' },
    popularity: 81,
    isOpen: true,
    openingHours: {
      Mon: '8:30 AM - 10:30 PM',
      Tue: '8:30 AM - 10:30 PM',
      Wed: '8:30 AM - 10:30 PM',
      Thu: '8:30 AM - 10:30 PM',
      Fri: '8:30 AM - 11:00 PM',
      Sat: '8:30 AM - 11:00 PM',
      Sun: '8:30 AM - 10:30 PM'
    }
  }
]

export function getLocalCafeById(id) {
  return localCafes.find((cafe) => String(cafe.id) === String(id)) || null
}

export default localCafes
