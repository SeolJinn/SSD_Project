import React from 'react';
import { ACHIEVEMENT_LEVELS } from './Achievements';
import badge1 from '../badges/badge1.png';
import badge2 from '../badges/badge2.png';
import badge3 from '../badges/badge3.png';
import badge4 from '../badges/badge4.png';
import badge5 from '../badges/badge5.png';
import badge6 from '../badges/badge6.png';

const AchievementBadge = ({ level, size = 'md' }) => {
  const sizes = {
    sm: '24px',
    md: '32px',
    lg: '48px'
  };

  const getBadgeImage = (level) => {
    switch (level) {
      case ACHIEVEMENT_LEVELS.NONE:
        return badge1;
      case ACHIEVEMENT_LEVELS.IRON:
        return badge2;
      case ACHIEVEMENT_LEVELS.BRONZE:
        return badge3;
      case ACHIEVEMENT_LEVELS.SILVER:
        return badge4;
      case ACHIEVEMENT_LEVELS.GOLD:
        return badge5;
      case ACHIEVEMENT_LEVELS.DIAMOND:
        return badge6;
      default:
        return badge1;
    }
  };

  return (
    <div className="relative inline-block">
      <img 
        src={getBadgeImage(level)} 
        alt={`${level} badge`}
        style={{ 
          width: sizes[size],
          height: sizes[size],
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default AchievementBadge;