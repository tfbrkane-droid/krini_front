import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api';

const Calendar = () => {
    const [vehicles, setVehicles] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    const syncScroll = useCallback((e) => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = e.target.scrollLeft;
        }
    }, []);

    // Timeline Configuration
    const dayWidth = 50; // px
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonthCount = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInMonth = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);
    
    // Formatting for display
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const monthDisplay = `${monthNames[currentMonth]} ${currentYear}`;
    const daysOfWeek = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehiclesRes, contractsRes] = await Promise.all([
                    api.get('vehicles/'),
                    api.get('contracts/')
                ]);
                setVehicles(vehiclesRes.data);
                setContracts(contractsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getDayName = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        return daysOfWeek[date.getDay()];
    };

    const getPosition = (dateStr) => {
        const date = new Date(dateStr);
        if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear) {
            // Simple logic: if not this month, handle starts/ends outside
            if (date < new Date(currentYear, currentMonth, 1)) return 0;
            if (date > new Date(currentYear, currentMonth, daysInMonthCount)) return daysInMonthCount * dayWidth;
        }
        const day = date.getDate();
        const hours = date.getHours();
        return (day - 1) * dayWidth + (hours / 24) * dayWidth;
    };

    const calculateBar = (startStr, endStr) => {
        const startPos = getPosition(startStr);
        const endPos = getPosition(endStr);
        return {
            left: `${startPos}px`,
            width: `${Math.max(endPos - startPos, 20)}px` // min width 20px
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Analytics Calculation
    const activeCount = vehicles.filter(v => v.statut === 'Rented').length;
    const maintenanceCount = vehicles.filter(v => v.statut === 'Maintenance').length;
    const availableCount = vehicles.filter(v => v.statut === 'Available').length;
    const utilization = vehicles.length > 0 ? Math.round((activeCount / vehicles.length) * 100) : 0;

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex items-center justify-between bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-label">Statut:</span>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary text-[11px] font-bold rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Actif
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-tertiary-container/10 text-on-tertiary-fixed-variant text-[11px] font-bold rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed-variant"></span> Réservé
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-error-container/20 text-on-error-container text-[11px] font-bold rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-on-error-container"></span> Maintenance
                            </span>
                        </div>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-100"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-label">Total:</span>
                        <span className="text-sm font-bold text-primary">{vehicles.length} Véhicules</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg text-sm w-64 focus:ring-1 focus:ring-primary/20" placeholder="Rechercher..." type="text"/>
                    </div>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 bg-surface-container-low px-4 py-1.5 rounded-full">
                    <button className="material-symbols-outlined text-slate-500 hover:text-primary transition-colors">chevron_left</button>
                    <span className="font-label text-sm font-semibold px-2 min-w-[120px] text-center">{monthDisplay}</span>
                    <button className="material-symbols-outlined text-slate-500 hover:text-primary transition-colors">chevron_right</button>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg">
                    <button className="px-4 py-1 text-xs font-bold bg-white text-primary rounded shadow-sm">Mois</button>
                    <button className="px-4 py-1 text-xs font-semibold text-slate-500 hover:text-primary transition-colors">Semaine</button>
                    <button className="px-4 py-1 text-xs font-semibold text-slate-500 hover:text-primary transition-colors">Jour</button>
                </div>
            </div>

            {/* Gantt Chart Container */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-outline-variant/10 flex flex-col h-[calc(100vh-360px)]">
                {/* Timeline Header (Dates) - scrolls with body */}
                <div className="flex border-b border-surface-container">
                    <div className="w-64 flex-shrink-0 bg-surface-container-low/50 p-4 border-r border-surface-container z-20">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-label">Véhicule</span>
                    </div>
                    <div ref={scrollRef} className="flex-1 overflow-x-hidden bg-white">
                        <div className="text-center" style={{ width: `${daysInMonthCount * dayWidth}px`, display: 'grid', gridTemplateColumns: `repeat(${daysInMonthCount}, ${dayWidth}px)` }}>
                            {daysInMonth.map((day) => {
                                const dayName = getDayName(day);
                                const isToday = day === now.getDate();
                                const isWeekend = dayName === "SAM" || dayName === "DIM";
                                return (
                                    <div key={day} className={`p-2 border-r border-slate-50 ${isWeekend ? 'bg-surface-container-low/30' : ''}`}>
                                        <p className={`text-[10px] font-bold ${isWeekend ? 'text-error' : 'text-slate-400'}`}>{dayName}</p>
                                        <p className={`text-sm font-bold ${isToday ? 'text-primary ring-2 ring-primary/20 rounded-full w-7 h-7 flex items-center justify-center mx-auto' : isWeekend ? 'text-error' : ''}`}>
                                            {day.toString().padStart(2, '0')}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Timeline Body */}
                <div className="flex-1 overflow-y-auto relative">
                    <div className="flex flex-col min-h-full">
                        {vehicles.map((vehicle) => {
                            const vehicleContracts = contracts.filter(c => c.vehicle === vehicle.id && c.statut !== 'ANNULE');
                            const isRented = vehicle.statut === 'Rented' || vehicleContracts.some(c => c.statut === 'EN_COURS');
                            const isMaintenance = vehicle.statut === 'Maintenance';
                            return (
                                <div key={vehicle.id} className="flex group hover:bg-surface-container-low/20 transition-colors border-b border-surface-container last:border-b-0">
                                    {/* Vehicle info column */}
                                    <div className="w-64 flex-shrink-0 p-4 border-r border-surface-container flex items-center gap-3 bg-white z-10 sticky left-0">
                                        {vehicle.image ? (
                                            <img alt={vehicle.matricule} className="w-12 h-10 object-cover rounded-md" src={vehicle.image} />
                                        ) : (
                                            <div className="w-12 h-10 bg-slate-100 rounded-md flex items-center justify-center">
                                                <span className="material-symbols-outlined text-slate-400">directions_car</span>
                                            </div>
                                        )}
                                        <div className="overflow-hidden flex-1">
                                            <p className="text-sm font-bold text-on-surface truncate">{vehicle.marque_name} {vehicle.modele_name}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{vehicle.matricule}</p>
                                                {isRented && (
                                                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                                        Loué
                                                    </span>
                                                )}
                                                {isMaintenance && (
                                                    <span className="inline-flex items-center gap-1 bg-error-container/30 text-error text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                                        Maintenance
                                                    </span>
                                                )}
                                                {!isRented && !isMaintenance && (
                                                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                        Disponible
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Timeline row */}
                                    <div
                                        className="flex-1 overflow-x-auto hide-scrollbar"
                                        onScroll={syncScroll}
                                    >
                                        <div className="relative h-20 bg-grid-pattern" style={{ width: `${daysInMonthCount * dayWidth}px` }}>
                                            {/* Today indicator */}
                                            <div
                                                className="absolute top-0 bottom-0 w-[2px] bg-primary/20 pointer-events-none z-0"
                                                style={{ left: `${(now.getDate() - 1) * dayWidth + (now.getHours() / 24) * dayWidth}px` }}
                                            />
                                            {/* Contracts */}
                                            {vehicleContracts.map(contract => {
                                                const barStyle = calculateBar(contract.date_sortie, contract.date_retour_prevue);
                                                const isActive = contract.statut === 'EN_COURS';
                                                return (
                                                    <div
                                                        key={contract.id}
                                                        className={`absolute top-1/2 -translate-y-1/2 h-10 rounded-xl px-2 flex items-center gap-2 cursor-pointer hover:shadow-xl transition-all z-10 ${
                                                            isActive
                                                                ? 'bg-primary text-on-primary'
                                                                : 'bg-tertiary-container text-on-tertiary-fixed-variant'
                                                        }`}
                                                        style={barStyle}
                                                        title={`${contract.client_name} — ${contract.statut}`}
                                                    >
                                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                                            <span className="material-symbols-outlined text-[12px]">person</span>
                                                        </div>
                                                        <span className="text-[10px] font-bold truncate">{contract.client_name}</span>
                                                        {isActive && (
                                                            <span className="material-symbols-outlined text-[12px] shrink-0 ml-auto">directions_car</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {/* Maintenance overlay */}
                                            {isMaintenance && vehicleContracts.length === 0 && (
                                                <div className="absolute left-0 right-0 h-10 top-1/2 -translate-y-1/2 bg-error-container/30 border-y border-error/10 flex items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-[16px] text-error">build</span>
                                                    <span className="text-[10px] font-bold text-error uppercase">Maintenance</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>


            {/* Dashboard Analytics Sidebar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-label text-xs font-bold text-slate-400 uppercase tracking-wider">Utilisation de la Flotte</p>
                        <span className="text-primary font-manrope font-bold">{utilization}%</span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${utilization}%` }}></div>
                    </div>
                    <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                        {utilization > 70 ? "Forte demande détectée. Optimisez vos plannings de maintenance." : "Capacité disponible. Envisagez des offres promotionnelles."}
                    </p>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
                    <p className="font-label text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Aperçu Rapide</p>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">Véhicules Actifs</span>
                            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{activeCount} Unités</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">En Maintenance</span>
                            <span className="bg-error-container/20 text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-full">{maintenanceCount} Unités</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">Disponible</span>
                            <span className="bg-tertiary-container/20 text-on-tertiary-fixed-variant text-[10px] font-bold px-2 py-0.5 rounded-full">{availableCount} Unités</span>
                        </div>
                    </div>
                </div>
                <div className="bg-primary p-6 rounded-2xl shadow-xl shadow-primary/20 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                    <p className="text-on-primary font-headline font-bold text-lg mb-2">Gestion Intelligence</p>
                    <p className="text-on-primary/70 text-xs mb-6">Visualisez l'état en temps réel de votre parc automobile et anticipez les retours de contrats.</p>
                    <button className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-fixed transition-colors">Plus de Détails</button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .bg-grid-pattern {
                    background-size: 50px 100%;
                    background-image: linear-gradient(to right, #f2f4f6 1px, transparent 1px);
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
};

export default Calendar;
