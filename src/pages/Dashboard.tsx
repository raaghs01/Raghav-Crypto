import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { SparklineChart } from '../components/charts/SparklineChart';
import { MarketDominanceChart } from '../components/charts/MarketDominanceChart';
import { BarChart } from '../components/charts/BarChart';
import { fetchMarketData, fetchGlobalData, fetchTrendingCoins } from '../services/api';
import type { CoinData, GlobalData, TrendingCoin } from '../types/crypto';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [timeframe, setTimeframe] = useState('7d');

  const fetchData = useCallback(async () => {
    try {
      const [marketResponse, globalResponse, trendingResponse] = await Promise.all([
        fetchMarketData(),
        fetchGlobalData(),
        fetchTrendingCoins(),
      ]);

      setCoins(marketResponse.data);
      setGlobalData(globalResponse.data);
      setTrendingCoins(trendingResponse.data.coins);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const marketCapData = {
    labels: coins.slice(0, 10).map(coin => coin.symbol.toUpperCase()),
    datasets: [{
      label: 'Market Cap (USD)',
      data: coins.slice(0, 10).map(coin => coin.market_cap),
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: 'rgb(99, 102, 241)',
    }]
  };

  const volumeData = {
    labels: coins.slice(0, 10).map(coin => coin.symbol.toUpperCase()),
    datasets: [{
      label: '24h Volume (USD)',
      data: coins.slice(0, 10).map(coin => coin.total_volume),
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgb(16, 185, 129)',
    }]
  };

  const priceChangeData = {
    labels: coins.slice(0, 10).map(coin => coin.symbol.toUpperCase()),
    datasets: [{
      label: '24h Price Change (%)',
      data: coins.slice(0, 10).map(coin => coin.price_change_percentage_24h),
      backgroundColor: coins.slice(0, 10).map(coin => 
        coin.price_change_percentage_24h > 0 
          ? 'rgba(16, 185, 129, 0.5)'
          : 'rgba(239, 68, 68, 0.5)'
      ),
    }]
  };

  return (
    <div className="min-h-screen bg-dark-100 text-gray-100">
      {/* Navigation */}
      <nav className="bg-dark-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-500" />
              <span className="ml-2 text-xl font-bold">Crypto Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="block text-gray-400">Total Market Cap</span>
                <span className="font-bold">
                  ${globalData?.data.total_market_cap.usd.toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {coins.slice(0, 4).map((coin, index) => (
            <div key={coin.id} className="bg-dark-200 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="font-bold">{coin.name}</h3>
                    <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <span className={`text-sm ${
                  coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
              <p className="text-2xl font-bold mb-2">
                ${coin.current_price.toLocaleString()}
              </p>
              <SparklineChart 
                data={coin.sparkline_in_7d.price} 
                id={`sparkline-${coin.id}`}
              />
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-dark-200 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Market Cap Distribution</h2>
            <div className="h-80">
              <BarChart data={marketCapData} id="market-cap-chart" />
            </div>
          </div>

          <div className="bg-dark-200 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">24h Trading Volume</h2>
            <div className="h-80">
              <BarChart data={volumeData} id="volume-chart" />
            </div>
          </div>

          <div className="bg-dark-200 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Price Changes (24h)</h2>
            <div className="h-80">
              <BarChart data={priceChangeData} id="price-change-chart" />
            </div>
          </div>

          <div className="bg-dark-200 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Market Dominance</h2>
            <div className="h-80">
              {globalData && (
                <MarketDominanceChart 
                  data={globalData.data.market_cap_percentage} 
                  id="market-dominance-chart"
                />
              )}
            </div>
          </div>
        </div>

        {/* Market Table */}
        <div className="bg-dark-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Market Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-dark-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">24h %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">7d %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Market Cap</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Volume (24h)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last 7 Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {coins.map((coin, index) => (
                  <tr key={coin.id} className="hover:bg-dark-300">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {coin.market_cap_rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                        <div className="flex flex-col">
                          <span className="font-medium">{coin.name}</span>
                          <span className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${
                      coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${
                      coin.price_change_percentage_7d_in_currency > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {coin.price_change_percentage_7d_in_currency.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${(coin.market_cap / 1e9).toFixed(2)}B
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${(coin.total_volume / 1e6).toFixed(2)}M
                    </td>
                    <td className="px-6 py-4">
                      <SparklineChart 
                        data={coin.sparkline_in_7d.price} 
                        color={coin.price_change_percentage_7d_in_currency > 0 ? '#10B981' : '#EF4444'}
                        id={`table-sparkline-${coin.id}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}