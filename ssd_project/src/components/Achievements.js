export const ACHIEVEMENT_LEVELS = {
    NONE: 'none',
    IRON: 'iron',
    BRONZE: 'bronze',
    SILVER: 'silver',
    GOLD: 'gold',
    PLATINUM: 'platinum',
    DIAMOND: 'diamond'
  };
  
  export const THRESHOLDS = {
    MESSAGES: {
      [ACHIEVEMENT_LEVELS.IRON]: 100,
      [ACHIEVEMENT_LEVELS.BRONZE]: 500,
      [ACHIEVEMENT_LEVELS.SILVER]: 1000,
      [ACHIEVEMENT_LEVELS.GOLD]: 5000,
      [ACHIEVEMENT_LEVELS.PLATINUM]: 10000,
      [ACHIEVEMENT_LEVELS.DIAMOND]: 50000
    },
    FRIENDS: {
      [ACHIEVEMENT_LEVELS.IRON]: 5,
      [ACHIEVEMENT_LEVELS.BRONZE]: 10,
      [ACHIEVEMENT_LEVELS.SILVER]: 25,
      [ACHIEVEMENT_LEVELS.GOLD]: 50,
      [ACHIEVEMENT_LEVELS.PLATINUM]: 100,
      [ACHIEVEMENT_LEVELS.DIAMOND]: 200
    },
    GROUPS: {
      [ACHIEVEMENT_LEVELS.IRON]: 2,
      [ACHIEVEMENT_LEVELS.BRONZE]: 5,
      [ACHIEVEMENT_LEVELS.SILVER]: 10,
      [ACHIEVEMENT_LEVELS.GOLD]: 20,
      [ACHIEVEMENT_LEVELS.PLATINUM]: 50,
      [ACHIEVEMENT_LEVELS.DIAMOND]: 100
    }
  };
  
  export const calculateLevel = (count, type) => {
    const thresholds = THRESHOLDS[type];
    let level = ACHIEVEMENT_LEVELS.NONE;
    
    for (const [achievementLevel, threshold] of Object.entries(thresholds)) {
      if (count >= threshold) {
        level = achievementLevel;
      } else {
        break;
      }
    }
    
    return level;
  };
  
  export const getNextThreshold = (count, type) => {
    const thresholds = THRESHOLDS[type];
    for (const [, threshold] of Object.entries(thresholds)) {
      if (count < threshold) {
        return threshold;
      }
    }
    return null;
  };
  
  export const getProgress = (count, type) => {
    const currentLevel = calculateLevel(count, type);
    const nextThreshold = getNextThreshold(count, type);
    
    if (!nextThreshold) return 100;
    
    const prevThreshold = currentLevel === ACHIEVEMENT_LEVELS.NONE ? 
      0 : 
      THRESHOLDS[type][currentLevel];
      
    return ((count - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
  };