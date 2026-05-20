// Simple recommendation util combining content-based and popularity
function scoreCafe(cafe, prefs = {}) {
  let score = 0;
  if (prefs.tags) {
    const common = cafe.tags.filter(t => prefs.tags.includes(t)).length;
    score += common * 2;
  }
  if (prefs.minRating) score += Math.max(0, cafe.rating - prefs.minRating) * 1.5;
  if (prefs.pricePref) score += (4 - Math.abs(cafe.priceLevel - prefs.pricePref));
  score += (cafe.popularity || 0) * 0.1;
  if (prefs.fastWifi && cafe.wifiSpeed && cafe.wifiSpeed >= 20) score += 3;
  return score;
}

exports.recommend = function (cafes, prefs = {}) {
  const scored = cafes.map(c => ({ cafe: c, score: scoreCafe(c, prefs) }));
  scored.sort((a, b) => b.score - a.score || b.cafe.rating - a.cafe.rating);
  return scored.map(s => ({
    id: s.cafe._id,
    name: s.cafe.name,
    image: s.cafe.images && s.cafe.images[0],
    rating: s.cafe.rating,
    location: s.cafe.location,
    priceLevel: s.cafe.priceLevel,
    tags: s.cafe.tags,
    score: s.score
  }));
};
