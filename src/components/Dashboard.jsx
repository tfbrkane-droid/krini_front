import React, { useState, useEffect } from 'react';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
    const [userRole, setUserRole] = useState("");
    const [data, setData] = useState({
        stats: { total_vehicles: 0, available_vehicles: 0, rented_vehicles: 0, active_contracts: 0, total_clients: 0, revenue_this_month: 0 },
        alerts: { insurance_expiring: [], visite_expiring: [] },
        recent_contracts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUserRole(decoded.role || "");
            } catch (error) {
                console.error("Erreur lecture token", error);
            }
        }

        const fetchDashboardData = async () => {
            try {
                const response = await api.get('dashboard/');
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const statusLabels = {
        'RESERVE': { label: 'Réservé', class: 'bg-blue-100 text-blue-700' },
        'EN_COURS': { label: 'En cours', class: 'bg-tertiary-container/20 text-on-tertiary-container' },
        'TERMINE': { label: 'Terminé', class: 'bg-gray-100 text-gray-600' },
        'ANNULE': { label: 'Annulé', class: 'bg-error-container/30 text-error' },
    };

    if (loading) return <div className="text-center mt-20 font-bold text-primary">Chargement des données...</div>;

    return (
        <>
            <div className="flex justify-between items-end">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block font-label">Aperçu</span>
                    <h2 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">Intelligence de Flotte - {data.stats.agency_name}</h2>
                </div>
                <div className="flex gap-2 bg-surface-container-low p-1 rounded-lg">
                    <button className="px-4 py-1.5 rounded-md text-xs font-bold bg-white shadow-sm text-primary">Temps Réel</button>
                    <button className="px-4 py-1.5 rounded-md text-xs font-bold text-slate-500 hover:bg-white/50">Historique</button>
                </div>
            </div>

            {/* Bento Grid KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* KPI 1: Revenue */}
                <div className="col-span-1 lg:col-span-2 bg-primary p-8 rounded-3xl text-white relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <p className="text-white/70 font-label text-sm uppercase tracking-wider font-semibold">Revenu Mensuel</p>
                            <span className="material-symbols-outlined text-white/40">payments</span>
                        </div>
                        <h3 className="text-5xl font-extrabold font-headline mt-4 tracking-tighter">{data.stats.revenue_this_month} DH</h3>
                    </div>
                    <div className="relative z-10 flex items-center gap-2">
                        <span className="text-on-tertiary-container font-bold flex items-center bg-white/10 px-2 py-0.5 rounded-lg text-xs">
                            <span className="material-symbols-outlined text-sm">trending_up</span> +8.2%
                        </span>
                        <span className="text-white/50 text-xs font-medium">vs mois dernier</span>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                {/* KPI 2: Total Vehicles */}
                <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-primary">directions_car</span>
                        </div>
                        <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold">Total Véhicules</p>
                        <h4 className="text-3xl font-extrabold font-headline mt-1">{data.stats.total_vehicles}</h4>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-50">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Utilisation Flotte</span>
                            <span className="text-primary font-bold">{data.stats.total_vehicles > 0 ? Math.round((data.stats.rented_vehicles / data.stats.total_vehicles) * 100) : 0}%</span>
                        </div>
                    </div>
                </div>

                {/* KPI 3: Active Contracts */}
                <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 bg-secondary-fixed rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-primary">description</span>
                        </div>
                        <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest font-bold">Contrats Actifs</p>
                        <h4 className="text-3xl font-extrabold font-headline mt-1">{data.stats.active_contracts}</h4>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-50">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">Nouveaux aujourd'hui</span>
                            <span className="text-on-tertiary-container font-bold">+0</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Fleet Status & Alerts */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-surface-container-low p-5 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            </div>
                            <div>
                                <h5 className="text-xl font-bold font-headline leading-tight">{data.stats.available_vehicles}</h5>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">Disponibles</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-low p-5 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>key</span>
                            </div>
                            <div>
                                <h5 className="text-xl font-bold font-headline leading-tight">{data.stats.rented_vehicles}</h5>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">Loués</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-low p-5 rounded-2xl flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-600" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                            </div>
                            <div>
                                <h5 className="text-xl font-bold font-headline leading-tight">{data.stats.total_clients}</h5>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-tighter">Total Clients</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface-container-lowest p-8 rounded-3xl editorial-shadow">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-lg font-bold font-headline">Performance des Revenus</h4>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                                    <span className="text-xs font-medium text-slate-500">Revenu</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-secondary-fixed"></div>
                                    <span className="text-xs font-medium text-slate-500">Contrats</span>
                                </div>
                            </div>
                        </div>
                        {/* Mock Chart */}
                        <div className="h-64 flex items-end justify-between gap-4 px-2">
                            {[40, 55, 75, 65, 90, 100].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full bg-surface-container-low rounded-t-lg h-full relative overflow-hidden" style={{height: `${h}%`}}>
                                        <div className="absolute bottom-0 w-full bg-secondary-fixed" style={{height: '80%'}}></div>
                                        <div className="absolute bottom-0 w-full bg-primary opacity-80" style={{height: '60%'}}></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-surface-container-lowest p-6 rounded-3xl editorial-shadow">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="material-symbols-outlined text-error">warning</span>
                            <h4 className="text-lg font-bold font-headline">Alertes Urgentes</h4>
                        </div>
                        <div className="space-y-4">
                            {data.alerts.insurance_expiring.map(alert => (
                                <div key={alert.id} className="p-4 bg-error-container/30 border-l-4 border-error rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-on-error-container uppercase font-label">Assurance Expirante</span>
                                    </div>
                                    <p className="text-xs text-on-error-container font-medium">{alert.marque} ({alert.matricule}) - Expire le {alert.date_assurance}</p>
                                    <button className="mt-3 text-xs font-bold text-error flex items-center gap-1 hover:underline">
                                        Renouveler <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            ))}
                            {data.alerts.visite_expiring.map(alert => (
                                <div key={alert.id} className="p-4 bg-surface-container-low rounded-xl border-l-4 border-primary">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-on-surface-variant uppercase font-label">Visite Technique</span>
                                    </div>
                                    <p className="text-xs text-on-surface-variant font-medium">{alert.marque} ({alert.matricule}) - Prévue le {alert.date_visite_technique}</p>
                                    <button className="mt-3 text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                                        Programmer <span className="material-symbols-outlined text-sm">event</span>
                                    </button>
                                </div>
                            ))}
                            {data.alerts.insurance_expiring.length === 0 && data.alerts.visite_expiring.length === 0 && (
                                <p className="text-sm text-green-600 font-bold">✅ Aucune alerte critique.</p>
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 border border-outline-variant/30 rounded-xl text-xs font-bold text-slate-500 hover:bg-surface-container-low transition-colors">
                            Voir toutes les notifications
                        </button>
                    </div>

                    {userRole !== 'SUPERADMIN' && (
                        <div className="bg-[#00236f] p-6 rounded-3xl text-white editorial-shadow">
                            <h4 className="font-headline font-bold mb-4">Gestion Rapide</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all">
                                    <span className="material-symbols-outlined">directions_car</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Véhicule</span>
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all">
                                    <span className="material-symbols-outlined">person_add</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Client</span>
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all">
                                    <span className="material-symbols-outlined">analytics</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Rapports</span>
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all">
                                    <span className="material-symbols-outlined">support_agent</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter">Support</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-surface-container-lowest rounded-3xl editorial-shadow overflow-hidden">
                <div className="px-8 py-6 flex justify-between items-center border-b border-slate-50">
                    <h4 className="text-lg font-bold font-headline">Contrats Récents</h4>
                    <a className="text-xs font-bold text-primary hover:underline" href="#">Voir tout</a>
                </div>
                <div className="p-4 overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left">
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Client</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Véhicule</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Durée</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Valeur</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data.recent_contracts.map(contract => (
                                <tr key={contract.id} className="group hover:bg-surface-container-low/50 transition-colors">
                                    <td className="px-4 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-primary">
                                                {contract.client__nom[0]}{contract.client__prenom[0]}
                                            </div>
                                            <span className="text-sm font-semibold">{contract.client__nom} {contract.client__prenom}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-sm">{contract.vehicle__marque} {contract.vehicle__modele}</td>
                                    <td className="px-4 py-5 text-sm text-slate-500">{contract.jours} Jours</td>
                                    <td className="px-4 py-5 text-sm font-bold">{contract.montant_total} DH</td>
                                    <td className="px-4 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusLabels[contract.statut]?.class || ''}`}>
                                            {statusLabels[contract.statut]?.label || contract.statut}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Dashboard;