import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('token/', {
                username,
                password
            });

            const { access, refresh } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            const decodedToken = jwtDecode(access);
            console.log("Utilisateur :", decodedToken.username);
            console.log("Agence :", decodedToken.agency_name);
            console.log("Rôle :", decodedToken.role);

            // Redirection vers le tableau de bord
            navigate('/dashboard');

        } catch (err) {
            if (!err.response) {
                setError("Erreur de connexion : Vérifiez que le serveur Django est bien lancé sur le port 8000.");
            } else if (err.response.status === 401) {
                setError("Nom d'utilisateur ou mot de passe incorrect !");
            } else {
                setError("Une erreur est survenue (" + err.response.status + ")");
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ padding: '30px', border: '1px solid #ddd', borderRadius: '8px', width: '320px', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', color: '#e74c3c', margin: '0 0 10px 0' }}>Car Rental</h2>
                <h4 style={{ textAlign: 'center', color: '#555', marginBottom: '20px' }}>Espace d'Administration</h4>

                {error && <p style={{ color: 'white', backgroundColor: '#e74c3c', padding: '10px', borderRadius: '4px', textAlign: 'center', fontSize: '14px' }}>{error}</p>}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <button type="submit" style={{ padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                        Se Connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;