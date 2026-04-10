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
        <div className="bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
            <main className="flex min-h-screen">
                {/* Left Side: Premium Lifestyle Image */}
                <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            alt="Luxury Car Interior"
                            className="h-full w-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBHiJKD-7uWgOBCFPc8y6TiqTbcRJyjeOVQVEwDLMm36K3pHQxu8Q2AmAuMyxqsOsuNws5g1RL60Ano1fRJaRa91T7eHCjL-cL7_xDmTDbISjqNN4-lY3bzIJ0Jk7Yp_jErMlva5xqBxNM-I3PfJb1L51yOZYh20ltrKcq5XvocS9I0dq1wTsYKqMN28EXs95ZBHwMNF24VnRhiFR47135m3_OOmVqX2s7SU3lTooV5LUvjN2BWhFEKkkJlmSLpk41g4CAqhqCQ_8"
                        />
                        {/* Overlay for depth and branding integration */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-transparent mix-blend-multiply"></div>
                    </div>
                    <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                        <div className="flex items-center gap-3">
                            <span className="text-on-primary text-3xl font-headline font-extrabold tracking-tighter">KRINI</span>
                        </div>
                        <div className="max-w-md">
                            <h2 className="text-on-primary font-headline text-4xl font-bold leading-tight mb-4">Le standard de précision pour la gestion de flotte.</h2>
                            <p className="text-on-primary/80 font-body text-lg">Intelligence au service de l'entrepreneur moderne de la mobilité.</p>
                        </div>
                        <div className="text-on-primary/60 text-sm font-label uppercase tracking-widest">
                            ERP de Conciergerie de Précision © 2024
                        </div>
                    </div>
                </section>

                {/* Right Side: Login Content */}
                <section className="w-full lg:w-1/2 flex items-center justify-center bg-surface-container-lowest p-8 md:p-16 lg:p-24">
                    <div className="w-full max-w-md space-y-10">
                        {/* Header Section */}
                        <header className="space-y-2">
                            <div className="lg:hidden mb-8">
                                <span className="text-primary text-2xl font-headline font-extrabold tracking-tighter">KRINI</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-secondary font-label text-xs uppercase tracking-[0.2em] mb-1">Autorisation</span>
                                <h1 className="text-on-surface font-headline text-4xl font-extrabold tracking-tight">Bienvenue</h1>
                            </div>
                            <p className="text-on-surface-variant font-body text-base">Accédez à votre tableau de bord de gestion de flotte</p>
                        </header>

                        {error && (
                            <div className="bg-error-container text-on-error-container p-4 rounded-md text-sm font-body">
                                {error}
                            </div>
                        )}

                        {/* Login Form */}
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-4">
                                {/* Username Field */}
                                <div className="relative group">
                                    <label className="block text-secondary font-label text-xs uppercase tracking-wider mb-2" htmlFor="username">
                                        Nom d'utilisateur
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:ring-0 focus:border-primary transition-all duration-300 py-3 px-4 text-on-surface placeholder:text-outline"
                                            id="username"
                                            name="username"
                                            placeholder="Nom d'utilisateur"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="relative group">
                                    <label className="block text-secondary font-label text-xs uppercase tracking-wider mb-2" htmlFor="password">
                                        Mot de passe
                                    </label>
                                    <div className="relative flex items-center">
                                        <input
                                            className="w-full bg-surface-container-low border-none border-b-2 border-transparent focus:ring-0 focus:border-primary transition-all duration-300 py-3 px-4 text-on-surface placeholder:text-outline"
                                            id="password"
                                            name="password"
                                            placeholder="••••••••"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button className="absolute right-3 text-outline hover:text-primary transition-colors" type="button">
                                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input className="peer h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface-container-low transition-all" type="checkbox" />
                                    </div>
                                    <span className="text-on-surface-variant font-body text-sm group-hover:text-on-surface transition-colors">Se souvenir de moi</span>
                                </label>
                                <a className="text-primary font-body text-sm font-semibold hover:text-primary-container transition-colors" href="#">Mot de passe oublié ?</a>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="w-full group relative flex items-center justify-center gap-2 bg-primary text-on-primary py-4 rounded-md font-headline font-bold text-lg hover:bg-primary-container active:scale-[0.98] transition-all duration-200"
                                type="submit"
                            >
                                Se connecter
                                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                            </button>
                        </form>

                        {/* Footer/Secondary Action */}
                        <footer className="pt-6 border-t border-outline-variant/15 text-center">
                            <p className="text-on-surface-variant font-body text-sm">
                                Nouveau sur la plateforme ? 
                                <a className="text-primary font-bold ml-1 hover:underline underline-offset-4 decoration-2 transition-all" href="#">Demander un accès</a>
                            </p>
                        </footer>
                    </div>
                </section>
            </main>

            {/* Support Link Footer Overlay */}
            <div className="fixed bottom-6 right-8 hidden lg:flex items-center gap-4">
                <a className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-full hover:bg-surface-container-high transition-colors text-secondary font-label text-xs uppercase tracking-widest" href="#">
                    <span className="material-symbols-outlined text-sm">help_outline</span>
                    Support
                </a>
                <div className="flex items-center gap-2 text-outline-variant">
                    <span className="material-symbols-outlined text-lg">language</span>
                    <span className="font-label text-xs uppercase">FR</span>
                </div>
            </div>
        </div>
    );
};

export default Login;