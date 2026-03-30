import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AddClient = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        cin_passport: '',
        email: '',
        telephone: '',
        adresse: '',
        permis_conduite: '',
        date_delivrance_permis: '',
        remarques: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('clients/', formData);
            navigate('/clients');
        } catch (err) {
            console.error("Error creating client:", err);
            setError(err.response?.data ? JSON.stringify(err.response.data) : "Une erreur est survenue lors de la création du client.");
            setLoading(false);
        }
    };

    return (
        <div className="p-0">
            {/* Page Header & Actions */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <nav className="flex text-xs font-label text-slate-400 uppercase tracking-widest mb-2 gap-2">
                        <button onClick={() => navigate('/clients')} className="hover:text-primary">Clients</button>
                        <span>/</span>
                        <span className="text-on-surface">Ajouter un nouveau client</span>
                    </nav>
                    <h1 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">Ajouter un Client</h1>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/clients')}
                        className="px-6 py-2.5 font-label text-sm font-semibold text-primary bg-surface-container-lowest border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-2.5 font-label text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-container rounded-lg shadow-lg shadow-primary/10 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer le Client'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                    {error}
                </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-12 gap-8">
                {/* Left Column: Primary Form */}
                <div className="col-span-8 space-y-8">
                    {/* Section: Personal Information */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                <h2 className="text-xl font-bold font-headline text-on-surface">Informations Personnelles</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Prénom</label>
                                    <input 
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 rounded-lg text-on-surface font-body transition-all" 
                                        placeholder="ex. Jonathan" 
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Nom</label>
                                    <input 
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 rounded-lg text-on-surface font-body transition-all" 
                                        placeholder="ex. Wick" 
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">CIN / Passeport</label>
                                    <input 
                                        name="cin_passport"
                                        value={formData.cin_passport}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 rounded-lg text-on-surface font-body transition-all" 
                                        placeholder="ex. AB123456" 
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Adresse Email</label>
                                    <input 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 rounded-lg text-on-surface font-body transition-all" 
                                        placeholder="jonathan.wick@example.com" 
                                        type="email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Numéro de Téléphone</label>
                                    <input 
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 rounded-lg text-on-surface font-body transition-all" 
                                        placeholder="+212 600-000000" 
                                        type="tel"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2 pt-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Adresse Résidentielle</label>
                                    <textarea 
                                        name="adresse"
                                        value={formData.adresse}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 rounded-lg text-on-surface font-body resize-none transition-all" 
                                        placeholder="Rue, Numéro, Ville, Code Postal" 
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>
                        </section>

                        {/* Section: Identity Documents */}
                        <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1.5 h-6 bg-tertiary-container rounded-full"></div>
                                <h2 className="text-xl font-bold font-headline text-on-surface">Documents d'Identité</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Numéro du Permis de Conduire</label>
                                    <div className="relative">
                                        <input 
                                            name="permis_conduite"
                                            value={formData.permis_conduite}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-slate-50 border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 pl-11 rounded-lg text-on-surface font-body transition-all" 
                                            placeholder="AB12345678" 
                                            type="text"
                                        />
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">badge</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Date de délivrance du permis</label>
                                    <div className="relative">
                                        <input 
                                            name="date_delivrance_permis"
                                            value={formData.date_delivrance_permis}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border-none border-b-2 border-transparent focus:border-primary focus:ring-0 px-4 py-3 pl-11 rounded-lg text-on-surface font-body transition-all" 
                                            type="date"
                                        />
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">calendar_today</span>
                                    </div>
                                </div>
                                <div className="col-span-2 mt-4">
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-slate-500">cloud_upload</span>
                                        </div>
                                        <p className="text-sm font-semibold text-on-surface">Cliquez pour télécharger le scan du document</p>
                                        <p className="text-xs text-slate-400 mt-1">Supports PDF, JPG, ou PNG (Max 5Mo)</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>

                {/* Right Column: Sidebar Actions & Status */}
                <div className="col-span-4 space-y-6">
                    {/* Status Card */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-white shadow-sm">
                        <h3 className="text-sm font-bold font-headline text-on-surface mb-4">Statut d'Enregistrement</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">État</span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full">Nouveau</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500">Type</span>
                                <span className="text-xs font-bold text-primary">Client Standard</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-red-500 text-sm">info</span>
                                <span className="text-[11px] font-medium text-slate-600">Vérification requise</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed italic">Le client sera invité à compléter la vérification KYC par e-mail une fois enregistré.</p>
                        </div>
                    </div>

                    {/* Quick Insights */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="text-xs font-bold font-label text-slate-400 uppercase tracking-widest mb-6">Liste de contrôle de sécurité</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-green-500" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                <div className="text-xs">
                                    <p className="font-bold text-on-surface">Infos Personnelles</p>
                                    <p className="text-slate-400 mt-0.5">Coordonnées de base</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-slate-300">circle</span>
                                <div className="text-xs">
                                    <p className="font-bold text-on-surface">Document d'identité Valide</p>
                                    <p className="text-slate-400 mt-0.5">Date d'expiration valide</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-slate-300">circle</span>
                                <div className="text-xs">
                                    <p className="font-bold text-on-surface">Méthode de Paiement</p>
                                    <p className="text-slate-400 mt-0.5">Carte requise plus tard</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddClient;
