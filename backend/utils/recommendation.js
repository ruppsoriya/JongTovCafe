function asArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
}

function normalizeTextList(value) {
  return asArray(value).map((item) => String(item).toLowerCase());
}

function scoreCafe(cafe, prefs = {}) {
  const cafeTags = normalizeTextList(cafe.tags);
  const cafeFacilities = normalizeTextList(cafe.facilities);
  const prefTags = normalizeTextList(prefs.tags);

  let score = 0;

  if (prefTags.length) {
    const overlap = prefTags.filter((tag) => cafeTags.includes(tag) || cafeFacilities.includes(tag)).length;
    score += overlap * 3;
  }

  if (prefs.minRating) {
    score += Math.max(0, Number(cafe.rating || 0) - Number(prefs.minRating)) * 2;
  }

  if (prefs.pricePref) {
    score += Math.max(0, 4 - Math.abs(Number(cafe.priceLevel || 0) - Number(prefs.pricePref)));
  }

  if (prefs.fastWifi && Number(cafe.wifiSpeed || 0) >= 20) score += 3;
  if (prefs.studyFriendly && (cafeTags.includes('study-friendly') || cafeFacilities.includes('study-friendly'))) score += 3;
  if (prefs.quiet && (cafeTags.includes('quiet') || cafeFacilities.includes('quiet') || cafeFacilities.includes('quiet atmosphere'))) score += 3;
  if (prefs.outdoorSeating && (cafeTags.includes('outdoor') || cafeFacilities.includes('outdoor seating'))) score += 2;
  if (prefs.familyFriendly && (cafeTags.includes('family-friendly') || cafeFacilities.includes('family-friendly'))) score += 2;

  score += Number(cafe.popularity || 0) * 0.1;
  score += Number(cafe.rating || 0);

  return score;
}

exports.recommend = function (cafes, prefs = {}) {
  const scored = cafes.map((cafe) => {
    const score = scoreCafe(cafe, prefs);
    const tags = asArray(cafe.tags);
    const facilities = asArray(cafe.facilities);
    const highlights = [];

    if (Number(cafe.wifiSpeed || 0) >= 70 || tags.some((tag) => /wifi/i.test(tag))) highlights.push('Best WiFi');
    if (tags.some((tag) => /quiet/i.test(tag)) || facilities.some((facility) => /quiet/i.test(facility))) highlights.push('Quiet');
    if (tags.some((tag) => /coffee|specialty/i.test(tag))) highlights.push('Best Coffee');
    if (Number(cafe.rating || 0) >= 4.5) highlights.push('Top Rated');

    return { cafe, score, highlights };
  });

  scored.sort((a, b) => b.score - a.score || Number(b.cafe.rating || 0) - Number(a.cafe.rating || 0));

  return scored.map((entry) => ({
    id: entry.cafe.id || entry.cafe._id,
    name: entry.cafe.name,
    image: entry.cafe.images && entry.cafe.images[0],
    rating: entry.cafe.rating,
    location: entry.cafe.location,
    priceLevel: entry.cafe.priceLevel,
    tags: entry.cafe.tags,
    facilities: entry.cafe.facilities,
    score: entry.score,
    highlights: entry.highlights
  }));
};
