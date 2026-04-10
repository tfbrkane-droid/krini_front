import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importer la bibliothèque pour lire le Token

const Layout = ({ children }) => {
    const location = useLocation();
    // État pour stocker le nom de l'agence
    const [agencyName, setAgencyName] = useState("Chargement...");
    const [userRole, setUserRole] = useState("");
    const [userName, setUserName] = useState("Utilisateur");

    // Utiliser useEffect pour lire le token au chargement du composant
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // On récupère les infos depuis le Token !
                setAgencyName(decoded.agency_name || "Mon Agence");
                setUserRole(decoded.role || "");
                setUserName(decoded.username || "Utilisateur");
            } catch (error) {
                console.error("Erreur de lecture du token", error);
                setAgencyName("Mon Agence");
            }
        }
    }, []);

    return (
        <div className="bg-surface font-body text-on-surface min-h-screen">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full z-40 flex flex-col p-4 bg-slate-50/80 backdrop-blur-xl w-64 border-r border-slate-200">
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shrink-0">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>directions_car</span>
                    </div>
                    <div className="overflow-hidden">
                        {/* Ici, on affiche le vrai nom de l'agence dynamiquement */}
                        <h1 className="text-xl font-bold text-[#00236f] font-headline tracking-tight truncate" title={agencyName}>
                            {agencyName}
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Gestion de Flotte</p>
                    </div>
                </div>
                <nav className="flex-1 space-y-1">
                    <Link 
                        to="/dashboard" 
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold tracking-tight transition-colors ${location.pathname === '/dashboard' ? 'bg-[#00236f] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                    >
                        <span className="material-symbols-outlined">dashboard</span>
                        <span>Tableau de bord</span>
                    </Link>

                    {userRole !== 'SUPERADMIN' && (
                        <>
                            <Link 
                                to="/vehicles" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold tracking-tight transition-colors ${location.pathname === '/vehicles' ? 'bg-[#00236f] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                            >
                                <span className="material-symbols-outlined">directions_car</span>
                                <span>Véhicules</span>
                            </Link>
                            <Link 
                                to="/clients" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold tracking-tight transition-colors ${location.pathname === '/clients' ? 'bg-[#00236f] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                            >
                                <span className="material-symbols-outlined">group</span>
                                <span>Clients</span>
                            </Link>
                            <Link 
                                to="/contracts" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold tracking-tight transition-colors ${location.pathname === '/contracts' ? 'bg-[#00236f] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                            >
                                <span className="material-symbols-outlined">description</span>
                                <span>Contrats</span>
                            </Link>
                            <Link 
                                to="/reservations" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold tracking-tight transition-colors ${location.pathname === '/reservations' ? 'bg-[#00236f] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                            >
                                <span className="material-symbols-outlined">event_note</span>
                                <span>Réservations</span>
                            </Link>
                            <Link 
                                to="/calendar" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold tracking-tight transition-colors ${location.pathname === '/calendar' ? 'bg-[#00236f] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                            >
                                <span className="material-symbols-outlined">calendar_today</span>
                                <span>Calendrier</span>
                            </Link>
                            <Link 
                                to="/payments" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold tracking-tight transition-colors ${location.pathname === '/payments' ? 'bg-[#00236f] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                            >
                                <span className="material-symbols-outlined">payments</span>
                                <span>Paiements</span>
                            </Link>
                            <Link 
                                to="/expenses" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold tracking-tight transition-colors ${location.pathname === '/expenses' ? 'bg-[#00236f] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                            >
                                <span className="material-symbols-outlined">receipt_long</span>
                                <span>Dépenses</span>
                            </Link>
                        </>
                    )}

                    {userRole === 'SUPERADMIN' && (
                        <>
                            <Link 
                                to="/admin/agencies" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold tracking-tight transition-colors ${location.pathname === '/admin/agencies' ? 'bg-[#e74c3c] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                            >
                                <span className="material-symbols-outlined">admin_panel_settings</span>
                                <span>Gestion Agences</span>
                            </Link>
                            <Link 
                                to="/admin/users" 
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold tracking-tight transition-colors ${location.pathname === '/admin/users' ? 'bg-[#e74c3c] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                            >
                                <span className="material-symbols-outlined">manage_accounts</span>
                                <span>Gestion Utilisateurs</span>
                            </Link>
                        </>
                    )}
                    <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-200/50 rounded-lg font-semibold tracking-tight transition-colors" href="#">
                        <span className="material-symbols-outlined">payments</span>
                        <span>Paiements</span>
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 min-h-screen">
                {/* Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between w-full px-8 py-4 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-slate-200/50">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="relative w-full max-w-md group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-[#00236f]/20 outline-none" placeholder="Rechercher..." type="text" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-full transition-colors mr-2">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="h-8 w-[1px] bg-slate-200"></div>

                        {/* User Profile Dropdown */}
                        <div className="relative group ml-2">
                            <button className="flex items-center gap-2 p-1 pl-4 pr-1 bg-white border border-slate-200 rounded-full hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20">
                                <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                                    {userName}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-inner">
                                    <span className="material-symbols-outlined text-sm">person</span>
                                </div>
                            </button>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                                <div className="p-3 border-b border-slate-50">
                                    <p className="text-sm font-bold text-slate-800 px-2 truncate">{userName}</p>
                                    <p className="text-[10px] text-slate-500 px-2 truncate uppercase font-bold tracking-widest mt-0.5">{userRole || "Admin Agence"}</p>
                                </div>
                                <div className="p-2 space-y-1">
                                    <Link to="/settings" className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">settings</span> Paramètres
                                    </Link>
                                    <div className="h-[1px] bg-slate-100 my-1 !my-2"></div>
                                    <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-semibold">
                                        <span className="material-symbols-outlined text-[18px]">logout</span> Se déconnecter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Le contenu des autres pages (Dashboard, etc.) */}
                <div className="p-8 space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;