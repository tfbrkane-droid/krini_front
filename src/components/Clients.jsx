import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get('clients/');
                setClients(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des clients", error);
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    if (loading) return <div className="text-center mt-20 font-bold text-primary">Chargement de l'annuaire clients...</div>;

    return (
        <div className="p-0">
            {/* Breadcrumbs & Actions */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-2 uppercase tracking-widest font-bold">
                        <span>Annuaire</span>
                        <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                        <span className="text-primary">Clients</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-[#00236f] tracking-tight">Annuaire des Clients</h2>
                </div>
                <div className="flex gap-3">
                    <Link to="/clients/add" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/10 hover:opacity-90 transition-all">
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        <span>Nouveau Client</span>
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors border border-slate-100">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        <span>Filtres Avancés</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors border border-slate-100">
                        <span className="material-symbols-outlined text-lg">download</span>
                        <span>Exporter CSV</span>
                    </button>
                </div>
            </div>

            {/* Client Directory Table */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nom du Client</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coordonnées</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Détails Permis</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dernière Location</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {clients.map(client => (
                                <tr key={client.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                {client.nom[0]}{client.prenom[0]}
                                            </div>
                                            <div>
                                                <p className="font-headline font-bold text-slate-900">{client.nom} {client.prenom}</p>
                                                <p className="text-xs text-slate-500">{client.cin_passport}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-medium text-slate-900">{client.telephone}</p>
                                        <p className="text-xs text-slate-500">{client.email || 'Pas d\'email'}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-mono text-slate-700">{client.permis_conduite}</span>
                                            <span className="text-[10px] font-bold text-primary mt-1 uppercase">VALIDE</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {client.last_rental ? (
                                            <div className="flex flex-col">
                                                <span className="text-sm text-slate-900 font-medium">{client.last_rental.vehicle}</span>
                                                <span className="text-xs text-slate-500">{client.last_rental.date}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400">Jamais</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors" title="Historique">
                                                <span className="material-symbols-outlined">history</span>
                                            </button>
                                            <Link 
                                                to={`/clients/edit/${client.id}`}
                                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" 
                                                title="Modifier"
                                            >
                                                <span className="material-symbols-outlined">edit</span>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400">Aucun client trouvé dans l'annuaire.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination (Static in UI for now) */}
                <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-sm text-slate-500 font-medium">Affichage de <span className="text-slate-900 font-bold">{clients.length}</span> clients</p>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-primary font-bold text-xs">1</button>
                    </div>
                </div>
            </div>

            {/* Dashboard Analytics Quick View */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-50 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-primary/5 rounded-xl text-primary">
                            <span className="material-symbols-outlined">person_add</span>
                        </div>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-tighter">+12% vs mois dernier</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Inscriptions</p>
                        <h3 className="text-2xl font-extrabold text-[#00236f]">{clients.length}</h3>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-50 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-red-50 rounded-xl text-red-600">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase tracking-tighter">Vérification Requise</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Permis Expirés</p>
                        <h3 className="text-2xl font-extrabold text-[#00236f]">0</h3>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-50 flex flex-col justify-between h-40">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-primary/5 rounded-xl text-primary">
                            <span className="material-symbols-outlined font-fill">stars</span>
                        </div>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-tighter">Clients VIP</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Comptes Premium</p>
                        <h3 className="text-2xl font-extrabold text-[#00236f]">0</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Clients;
