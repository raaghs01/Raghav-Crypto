import axios from 'axios';

const API_KEY = 'CG-xjiSYJX6R5Az1UxZJNjpLJaH';
const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-cg-demo-api-key': API_KEY
  }
});

export const fetchMarketData = () => 
  api.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 20,
      sparkline: true,
      price_change_percentage: '1h,24h,7d'
    }
  });

export const fetchCoinHistory = (id: string, days: number = 7) =>
  api.get(`/coins/${id}/market_chart`, {
    params: {
      vs_currency: 'usd',
      days,
      interval: days === 1 ? 'hourly' : 'daily'
    }
  });

export const fetchGlobalData = () =>
  api.get('/global');

export const fetchTrendingCoins = () =>
  api.get('/search/trending');

export const fetchExchangeRates = () =>
  api.get('/exchange_rates');