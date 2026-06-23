import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/leaderboard')
      .then((response) => {
        setLeaders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>EcoEducation Leaderboard 🏆</h2>

        {loading && <p>Loading leaderboard...</p>}

        {!loading && leaders.length === 0 && <p>No data available right now.</p>}

        {!loading && leaders.length > 0 && (
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Eco Points</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, index) => (
                <tr key={leader._id}>
                  <td>{index + 1}</td>
                  <td>{leader.name}</td>
                  <td>{leader.ecoPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Leaderboard;