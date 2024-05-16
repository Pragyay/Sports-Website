import React, { useState, useEffect } from 'react';

function LiveScores() {
  const [liveScores, setLiveScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeagues, setSelectedLeagues] = useState([]);

  useEffect(() => {
    const fetchLiveScores = async () => {
      try {
        let url;
        if (selectedLeagues.length === 0) {
          url = 'https://v3.football.api-sports.io/fixtures?live=all';
        } else {
          const leagueIds = selectedLeagues.join('-');
          url = `https://v3.football.api-sports.io/fixtures?live=000-${leagueIds}`;
        }
        console.log(url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'https://v3.football.api-sports.io',
            'x-rapidapi-key': 'c24ffdc02f5e049971023a6115d52f23', // Replace with your actual API key
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch live scores');
        }
        const data = await response.json();
        setLiveScores(data.response);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLiveScores();
      
  }, [selectedLeagues]);

  const handleLeagueFilter = (leagueId) => {
    if (selectedLeagues.includes(leagueId)) {
      setSelectedLeagues(selectedLeagues.filter(id => id !== leagueId));
    } else {
      setSelectedLeagues([...selectedLeagues, leagueId]);
    }
  };
  
  const handleAllLeagues = () => {
    setSelectedLeagues([]);
  };
  
  return (
    <div>
      <nav id='navbar'>
        <h1>Daily Football Scores</h1>
      </nav>
      <div className='main'>
        <div className="league-buttons">
          <button className={selectedLeagues.length === 0 ? 'active' : ''} onClick={handleAllLeagues}>All</button>
          <button className={selectedLeagues.includes(39) ? 'active' : ''} onClick={() => handleLeagueFilter(39)}>Premier League</button>
          <button className={selectedLeagues.includes(140) ? 'active' : ''} onClick={() => handleLeagueFilter(140)}>La Liga</button>
          <button className={selectedLeagues.includes(78) ? 'active' : ''} onClick={() => handleLeagueFilter(78)}>Bundesliga</button>
          <button className={selectedLeagues.includes(135) ? 'active' : ''} onClick={() => handleLeagueFilter(135)}>Serie A</button>
          <button className={selectedLeagues.includes(61) ? 'active' : ''} onClick={() => handleLeagueFilter(61)}>Ligue 1</button>
        </div>
  
        {liveScores.length === 0 ? (
          <div>No matches ongoing right now</div>
        ) : (
          liveScores.map((fixture) => (
            <div key={fixture.fixture.id} className="game">
              <div className="teams">
                <div className="teamHome">
                  <span>{fixture.teams.home.name}</span>
                  <img src={fixture.teams.home.logo} alt="Home Team Logo" className="team-logo" />
                </div>
                <div className="status-score">
                  <span className="score">{fixture.goals.home} - {fixture.goals.away}</span>
                  <br />
                  <span className="status">{fixture.fixture.status.long} </span>
                </div>
                <div className="teamAway">
                  <img src={fixture.teams.away.logo} alt="Away Team Logo" className="team-logo" />
                  <span>{fixture.teams.away.name}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LiveScores;
