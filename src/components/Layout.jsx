import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importer la bibliothèque pour lire le Token

const Layout = ({ children }) => {
    const location = useLocation();
    // État pour stocker le nom de l'agence
    const [agencyName, setAgencyName] = useState("Chargement...");
    const [userRole, setUserRole] = useState("");

    // Utiliser useEffect pour lire le token au chargement du composant
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // On récupère le nom de l'agence depuis le Token !
                setAgencyName(decoded.agency_name || "Mon Agence");
                setUserRole(decoded.role || "");
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
                        {userRole !== 'SUPERADMIN' && (
                            <Link 
                                to="/contracts/new"
                                className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg font-headline font-bold text-sm editorial-shadow hover:scale-[0.98] transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Nouveau Contrat
                            </Link>
                        )}
                        <div className="h-8 w-[1px] bg-outline-variant/30 mx-2"></div>
                        <button
                            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                            className="flex items-center justify-center p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            title="Se déconnecter"
                        >
                            <span className="material-symbols-outlined">logout</span>
                        </button>
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