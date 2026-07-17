
export function calculateLevel(totalXp: number) {
  let level = 1;
  let xpRemaining = totalXp;
  let xpNeededForNextLevel = 500; // Requirement to reach Level 2

  while (xpRemaining >= xpNeededForNextLevel) {
    xpRemaining -= xpNeededForNextLevel;
    level++;
    xpNeededForNextLevel = 500 + (level - 1) * 200;
  }

  const progress = (xpRemaining / xpNeededForNextLevel) * 100;

  return {
    level,
    currentXpInLevel: Math.floor(xpRemaining),
    nextLevelXp: xpNeededForNextLevel,
    progress
  };
}

export function getRankName(level: number) {
  if (level >= 50) return "Diamond";
  if (level >= 30) return "Platinum";
  if (level >= 20) return "Gold";
  if (level >= 10) return "Silver";
  return "Bronze";
}
