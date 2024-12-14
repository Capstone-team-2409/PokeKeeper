import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Account.module.css';
import api from '../api';

const Account = ({ teamName, setTeamName, setIsAuthenticated }) => {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [localTeamName, setLocalTeamName] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/teams', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          setTeams(response.data);
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

  const teamPost = async (teamName) => {
    try {
      const response = await api.post('/teams', {
        name: teamName
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const makeTeam = async (event) => {
    event.preventDefault();
    const newTeam = await teamPost(localTeamName);
    if (newTeam && localTeamName.trim()) {
      setTeams((prev) => [...prev, newTeam]);
      setTeamName(localTeamName);  
      setLocalTeamName('');  
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
    setTeams([]);
    console.log('Teams cleared:', teams);
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
          value={localTeamName}
          onChange={(event) => setLocalTeamName(event.target.value)}
          placeholder="Team Name"
        />
        <button type="submit">Make Team</button>
      </form>

      <h3>My Teams</h3>
      <section id="teams">
        <ul className={styles.teams}>
          {teams.map((team) => (
            <li key={team.id} className={styles.team}>
              <section id="teamName-and-deleteButton">
                <h3>{team.name}</h3>
                <button onClick={() => deleteTeam(team)}>Delete Team</button>
              </section>
              {team.pokemon && (
                <section id="team-members">
                  {team.pokemon.map((pokemon, index) => (
                    <section id="member" key={index} className={styles.member}>
                      <img src={pokemon.sprite} onClick={() => navigate(`/NationalDex/${pokemon.name}`)} alt={pokemon.name} />
                      <p onClick={() => navigate(`/NationalDex/${pokemon.name}`)}>
                        {pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}
                      </p>
                      <button onClick={() => removeFromTeam(team, index)}>Remove from Team</button>
                    </section>
                  ))}
                </section>
              )}
            </li>
          ))}
        </ul>
      </section>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Account;
