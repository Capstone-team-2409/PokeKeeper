import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Account.module.css';
import api from '../api';

const Account = ({ teamName, setTeamName, setIsAuthenticated }) => {
  const [user, setUser] = useState(null); 
  const [teams, setTeams] = useState({}); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data); 
          setTeams(response.data.teams || {}); 
        } catch (error) {
          console.error('Error fetching user data:', error);
          if (error.response?.status === 401) {
            
            setIsAuthenticated(false);
            navigate('/login');
          }
        }
      }
    };

    fetchUserData();
  }, [setIsAuthenticated, navigate]);

  
  const makeTeam = (event) => {
    event.preventDefault();
    if (teamName.trim()) {
      setTeams((previous) => ({
        ...previous, [teamName]: [] 
      }));
      setTeamName(''); 
    }
  };

  
  const removeFromTeam = (team, index) => {
    setTeams((prevTeams) => ({
      ...prevTeams,
      [team]: prevTeams[team].filter((_, i) => i !== index),
    }));
  };

  
  const deleteTeam = (team) => {
    setTeams((prevTeams) => {
      const updatedTeams = { ...prevTeams };
      delete updatedTeams[team];
      return updatedTeams;
    });
  };

  
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('username'); 
    setIsAuthenticated(false); 
    navigate('/login');
  };

  const username = localStorage.getItem('username'); 
  if (!user) {
    return <p>Loading...</p>; 
  }

  return (
    <div className={styles.container}>
      <h2>Hello, {username || user.username}</h2>
      <p>Make a New Team</p>
      <form onSubmit={makeTeam} className={styles.form}>
        <input
          value={teamName}
          onChange={(event) => setTeamName(event.target.value)}
          placeholder="Team Name"
        />
        <button type="submit">Make Team</button>
      </form>

      <h3>My Teams</h3>
      <section id="teams">
        <ul className={styles.teams}>
          {Object.keys(teams).map((team) => (
            <li key={team} className={styles.team}>
              <section id="teamName-and-deleteButton">
                <h3>{team}</h3>
                <button onClick={() => deleteTeam(team)}>Delete Team</button>
              </section>
              <section id="team-members">
                {teams[team].map((pokemon, index) => (
                  <section id="member" key={index} className={styles.member}>
                    <img src={pokemon.sprite} onClick={() => navigate(`/NationalDex/${pokemon.name}`)} alt={pokemon.name} />
                    <p onClick={() => navigate(`/NationalDex/${pokemon.name}`)}>
                      {pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}
                    </p>
                    <button onClick={() => removeFromTeam(team, index)}>Remove from Team</button>
                  </section>
                ))}
              </section>
            </li>
          ))}
        </ul>
      </section>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Account;
