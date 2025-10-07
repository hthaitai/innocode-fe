import React from 'react';
import './ContestCard.css';

const ContestCard = ({ contest, onClick }) => {
  return (
    <div className="contest-card" onClick={onClick}>
      <div className="contest-card__icon">
        {contest.icon && <span className="contest-card__icon-content">{contest.icon}</span>}
      </div>
      
      <div className="contest-card__content">
        <h3 className="contest-card__title">{contest.title}</h3>
        <p className="contest-card__description">{contest.description}</p>
        <div className="contest-card__meta">
          <span className="contest-card__difficulty">Difficulty - {contest.difficulty}</span>
          <span className="contest-card__teams">{contest.teams} Teams</span>
          <span className="contest-card__time">{contest.timeLeft} to go</span>
        </div>
      </div>
      
      
      <div className="contest-card__arrow">
        <span>&gt;</span>
      </div>
    </div>
  );
};

export default ContestCard;
