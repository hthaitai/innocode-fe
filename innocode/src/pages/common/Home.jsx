import React from 'react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                The Digital Platform for High School Programming Contests
              </h1>
              <p className="hero-description">
                Automated judging, multi-round contests, real-time leaderboards — designed for schools, mentors, and organizers.
              </p>
              <div className="hero-actions">
                <button className="cta-button">Get started</button>
                <span className="student-count">200+ Students</span>
              </div>
            </div>
            <div className="hero-illustration">
              <div className="illustration-container">
                <div className="classroom-scene">
                  {/* <div className="students-studying">
                    <div className="student student-1"></div>
                    <div className="student student-2"></div>
                    <div className="student student-3"></div>
                  </div>
                  <div className="teacher-interacting">
                    <div className="teacher teacher-1"></div>
                    <div className="teacher teacher-2"></div>
                  </div>
                  <div className="classroom-elements">
                    <div className="bookshelf left"></div>
                    <div className="bookshelf right"></div>
                    <div className="window"></div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="home-container">
        <h1>Welcome to InnoCode</h1>
        <p>Your coding competition platform</p>
      </div>
    </div>
  );
};

export default Home;
