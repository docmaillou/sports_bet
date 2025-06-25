import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Edit2, Trash2, BarChart3, X, Menu, Save, Settings, Palette, Globe, Bell, HelpCircle, Download, Info } from 'lucide-react';

const SportsBook = () => {
  console.log('🚀 myHOMECas - Version mise à jour déployée !', new Date().toLocaleString());

  const [bets, setBets] = useState(() => {
    const saved = localStorage.getItem('sportsbook-bets');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingBet, setEditingBet] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('myhomecas-settings');
    return saved ? JSON.parse(saved) : {
      theme: 'purple',
      currency: 'USD'
    };
  });
  const [formData, setFormData] = useState({
    sport: '',
    match: '',
    betType: '',
    selection: '',
    odds: '',
    stake: '',
    result: 'en_cours',
    date: new Date().toISOString().split('T')[0]
  });

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('sportsbook-bets', JSON.stringify(bets));
  }, [bets]);

  // Sauvegarder les paramètres
  useEffect(() => {
    localStorage.setItem('myhomecas-settings', JSON.stringify(settings));
  }, [settings]);

  const sports = ['Football', 'Basketball', 'Tennis', 'Hockey', 'Baseball', 'Boxing', 'MMA', 'Autre'];
  const betTypes = ['1X2', 'Over/Under', 'Handicap', 'BTTS', 'Score Exact', 'Player Props', 'Autre'];
  const results = ['en_cours', 'gagne', 'perdu', 'annule'];

  // Thèmes disponibles
  const themes = {
    purple: {
      name: 'Violet Classique',
      gradient: 'from-slate-900 via-purple-900 to-slate-900',
      primary: 'purple-600',
      primaryHover: 'purple-700',
      accent: 'purple-400'
    },
    blue: {
      name: 'Bleu Océan',
      gradient: 'from-slate-900 via-blue-900 to-slate-900',
      primary: 'blue-600',
      primaryHover: 'blue-700',
      accent: 'blue-400'
    },
    green: {
      name: 'Vert Émeraude',
      gradient: 'from-slate-900 via-emerald-900 to-slate-900',
      primary: 'emerald-600',
      primaryHover: 'emerald-700',
      accent: 'emerald-400'
    },
    red: {
      name: 'Rouge Passion',
      gradient: 'from-slate-900 via-red-900 to-slate-900',
      primary: 'red-600',
      primaryHover: 'red-700',
      accent: 'red-400'
    },
    orange: {
      name: 'Orange Sunset',
      gradient: 'from-slate-900 via-orange-900 to-slate-900',
      primary: 'orange-600',
      primaryHover: 'orange-700',
      accent: 'orange-400'
    }
  };

  const currentTheme = themes[settings.theme] || themes.purple;

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const exportData = () => {
    const data = {
      bets: bets,
      settings: settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `myhomecas-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowMobileMenu(false);
  };

  const showHelp = () => {
    alert(`🎯 myHOMECas - Guide d'utilisation

📱 Fonctionnalités principales :
• Ajouter des paris avec le bouton "Nouveau Pari"
• Modifier/Supprimer avec les icônes sur chaque pari
• Changer le thème dans les paramètres ⚙️

📊 Statistiques :
• Paris : Nombre total de paris
• Mise : Montant total misé
• Profit : Gain/Perte total
• Réussite : Pourcentage de paris gagnés

💾 Sauvegarde automatique :
Vos données sont sauvegardées automatiquement dans votre navigateur.

📤 Export :
Utilisez le menu pour exporter vos données en JSON.`);
    setShowMobileMenu(false);
  };

  const resetForm = () => {
    setFormData({
      sport: '',
      match: '',
      betType: '',
      selection: '',
      odds: '',
      stake: '',
      result: 'en_cours',
      date: new Date().toISOString().split('T')[0]
    });
    setEditingBet(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.sport || !formData.match || !formData.odds || !formData.stake) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    const newBet = {
      id: editingBet ? editingBet.id : Date.now(),
      ...formData,
      odds: parseFloat(formData.odds),
      stake: parseFloat(formData.stake),
      profit: formData.result === 'gagne' ? (parseFloat(formData.stake) * parseFloat(formData.odds)) - parseFloat(formData.stake) : 
              formData.result === 'perdu' ? -parseFloat(formData.stake) : 0
    };

    if (editingBet) {
      setBets(bets.map(bet => bet.id === editingBet.id ? newBet : bet));
    } else {
      setBets([...bets, newBet]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (bet) => {
    setEditingBet(bet);
    setFormData({
      sport: bet.sport,
      match: bet.match,
      betType: bet.betType,
      selection: bet.selection,
      odds: bet.odds.toString(),
      stake: bet.stake.toString(),
      result: bet.result,
      date: bet.date
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pari ?')) {
      setBets(bets.filter(bet => bet.id !== id));
    }
  };

  const stats = {
    totalBets: bets.length,
    totalStake: bets.reduce((sum, bet) => sum + bet.stake, 0),
    totalProfit: bets.reduce((sum, bet) => sum + bet.profit, 0),
    winRate: bets.filter(bet => bet.result !== 'en_cours').length > 0 ? 
             (bets.filter(bet => bet.result === 'gagne').length / bets.filter(bet => bet.result !== 'en_cours').length * 100) : 0,
    pendingBets: bets.filter(bet => bet.result === 'en_cours').length
  };

  const getResultColor = (result) => {
    switch(result) {
      case 'gagne': return 'text-green-600 bg-green-100';
      case 'perdu': return 'text-red-600 bg-red-100';
      case 'annule': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getResultText = (result) => {
    switch(result) {
      case 'gagne': return 'Gagné';
      case 'perdu': return 'Perdu';
      case 'annule': return 'Annulé';
      default: return 'En cours';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient}`}>
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className={`w-6 h-6 text-${currentTheme.accent}`} />
            <h1 className="text-lg font-bold text-white">myHOMECas</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="sticky top-[73px] z-40 bg-slate-800/95 backdrop-blur-sm border-b border-white/10">
          <div className="p-4 space-y-3">
            <button
              onClick={showHelp}
              className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Aide & Guide</span>
            </button>

            <button
              onClick={exportData}
              className="w-full flex items-center gap-3 p-3 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Exporter mes données</span>
            </button>

            <div className="w-full flex items-center gap-3 p-3 text-gray-400">
              <Info className="w-5 h-5" />
              <div className="text-sm">
                <div>Version 1.0</div>
                <div className="text-xs text-gray-500">myHOMECas</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 pb-20">
        {/* Statistics Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-center">
              <p className="text-gray-300 text-xs mb-1">Paris</p>
              <p className="text-xl font-bold text-white">{stats.totalBets}</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-center">
              <p className="text-gray-300 text-xs mb-1">Mise</p>
              <p className="text-xl font-bold text-white">${stats.totalStake.toFixed(0)}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-center">
              <p className="text-gray-300 text-xs mb-1">Profit</p>
              <p className={`text-xl font-bold ${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${stats.totalProfit.toFixed(0)}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="text-center">
              <p className="text-gray-300 text-xs mb-1">Réussite</p>
              <p className="text-xl font-bold text-white">{stats.winRate.toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* Bet Form - Mobile Optimized */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-slate-900 w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {editingBet ? 'Modifier Pari' : 'Nouveau Pari'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Sport *</label>
                  <select
                    value={formData.sport}
                    onChange={(e) => setFormData({...formData, sport: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                  >
                    <option value="">Sélectionner</option>
                    {sports.map(sport => (
                      <option key={sport} value={sport} className="text-black">{sport}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Match *</label>
                  <input
                    type="text"
                    value={formData.match}
                    onChange={(e) => setFormData({...formData, match: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                    placeholder="ex: PSG vs OM"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Type de Pari</label>
                  <select
                    value={formData.betType}
                    onChange={(e) => setFormData({...formData, betType: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                  >
                    <option value="">Sélectionner</option>
                    {betTypes.map(type => (
                      <option key={type} value={type} className="text-black">{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Sélection</label>
                  <input
                    type="text"
                    value={formData.selection}
                    onChange={(e) => setFormData({...formData, selection: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                    placeholder="ex: PSG victoire"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Cote *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.odds}
                      onChange={(e) => setFormData({...formData, odds: e.target.value})}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                      placeholder="2.50"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Mise ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.stake}
                      onChange={(e) => setFormData({...formData, stake: e.target.value})}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                      placeholder="10.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Résultat</label>
                  <select
                    value={formData.result}
                    onChange={(e) => setFormData({...formData, result: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                  >
                    {results.map(result => (
                      <option key={result} value={result} className="text-black">
                        {getResultText(result)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className={`w-full bg-${currentTheme.primary} hover:bg-${currentTheme.primaryHover} text-white p-4 rounded-lg transition-colors font-medium text-base flex items-center justify-center gap-2 mt-6`}
                >
                  <Save className="w-5 h-5" />
                  {editingBet ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bets List - Mobile Cards */}
        <div className="space-y-3">
          {bets.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center text-gray-300 border border-white/20">
              <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-lg mb-2">Aucun pari</p>
              <p className="text-sm">Ajoutez votre premier pari pour commencer</p>
            </div>
          ) : (
            bets.map((bet) => (
              <div key={bet.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-${currentTheme.accent} text-sm font-medium`}>{bet.sport}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getResultColor(bet.result)}`}>
                        {getResultText(bet.result)}
                      </span>
                    </div>
                    <h4 className="text-white font-medium text-sm">{bet.match}</h4>
                    {bet.selection && (
                      <p className="text-gray-300 text-sm">{bet.selection}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(bet)}
                      className="text-blue-400 p-2"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(bet.id)}
                      className="text-red-400 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center border-t border-white/10 pt-3">
                  <div>
                    <p className="text-gray-400 text-xs">Cote</p>
                    <p className="text-white font-medium">{bet.odds}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Mise</p>
                    <p className="text-white font-medium">${bet.stake.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Profit</p>
                    <p className={`font-medium ${bet.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ${bet.profit.toFixed(0)}
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-right">
                  <span className="text-gray-400 text-xs">{bet.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4">
        {/* Background avec dégradé et blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent backdrop-blur-md"></div>

        {/* Bouton avec design amélioré */}
        <div className="relative">
          <button
            onClick={() => setShowForm(true)}
            className={`w-full bg-gradient-to-r from-${currentTheme.primary} to-${currentTheme.primaryHover} hover:from-${currentTheme.primaryHover} hover:to-${currentTheme.primary} text-white p-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden`}
          >
            {/* Icône avec background circulaire */}
            <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm z-10">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="tracking-wide z-10">Nouveau Pari</span>

            {/* Effet de brillance animé */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-slate-900 w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Settings className="w-6 h-6" />
                Paramètres
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Thème */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Thème
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => handleSettingsChange('theme', key)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.theme === key
                          ? `border-${theme.accent} bg-${theme.primary}/20`
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{theme.name}</span>
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${theme.gradient}`}></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Devise */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Devise
                </h4>
                <select
                  value={settings.currency}
                  onChange={(e) => handleSettingsChange('currency', e.target.value)}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="USD" className="text-black">Dollar ($)</option>
                  <option value="EUR" className="text-black">Euro (€)</option>
                  <option value="GBP" className="text-black">Livre (£)</option>
                  <option value="CAD" className="text-black">Dollar Canadien (C$)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsBook;
