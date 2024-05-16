import React, { useState, useEffect } from 'react';
import logo from './logo.png';

function LiveScores() {
  const [liveScores, setLiveScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLiveScores = async () => {
      try {
        // getting todays date
        const date = new Date();
        const currDate = date.toISOString().slice(0, 10);

        //fetch
        const response = await fetch(`https://v1.basketball.api-sports.io/games?date=${currDate}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': 'c24ffdc02f5e049971023a6115d52f23', // Replace with your actual API key
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch live scores');
        }

        // get data as json file
        const data = await response.json();
        // filter only ongoing games
        const filteredGames = data.response.filter(game => game.status.long !== "Game Finished" && game.status.long !== "Not Started");
        // add to liveScores[] array
        setLiveScores(filteredGames);
        setLoading(false);
      } 
      catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    // const intervalId = setInterval(fetchLiveScores, 6000); // Fetch live scores every minute
    // return () => clearInterval(intervalId); // Cleanup interval on component unmount

    fetchLiveScores()
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Live Football Scores</h2>
      {/* Display live games */}
      {liveScores.map((game) => (
        <div key={game.fixture.id} className="game">
          <div className="teams">
            <div className="team">
              <span>{game.teams.home.name}</span>
              <img src={game.teams.home.logo} alt="Home Team Logo" className="team-logo" />
            </div>
            <div className="status-score">
              <span className="score">{game.scores.home.total} - {game.scores.away.total}</span>
              <br />
              <span className="status">{game.fixture.status.long} </span>
            </div>
            <div className="team">
              <img src={game.teams.away.logo} alt="Away Team Logo" className="team-logo" />
              <span>{game.teams.away.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LiveScores;