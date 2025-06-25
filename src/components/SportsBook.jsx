import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Edit2, Trash2, BarChart3, X, Menu, Save } from 'lucide-react';

const SportsBook = () => {
  const [bets, setBets] = useState(() => {
    const saved = localStorage.getItem('sportsbook-bets');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingBet, setEditingBet] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  const sports = ['Football', 'Basketball', 'Tennis', 'Hockey', 'Baseball', 'Boxing', 'MMA', 'Autre'];
  const betTypes = ['1X2', 'Over/Under', 'Handicap', 'BTTS', 'Score Exact', 'Player Props', 'Autre'];
  const results = ['en_cours', 'gagne', 'perdu', 'annule'];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" />
            <h1 className="text-lg font-bold text-white">myHOMECas</h1>
          </div>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-white p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

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
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors font-medium text-base flex items-center justify-center gap-2 mt-6"
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
                      <span className="text-purple-400 text-sm font-medium">{bet.sport}</span>
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
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center justify-center gap-2 font-medium text-base shadow-lg"
        >
          <PlusCircle className="w-5 h-5" />
          Nouveau Pari
        </button>
      </div>
    </div>
  );
};

export default SportsBook;
