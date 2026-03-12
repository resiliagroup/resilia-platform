import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api';
import type { PortfolioStats, RiskAssessment, ApiState } from '../types';

// ─── Portfolio hook ─────────────────────────────────────────────────────────

export function usePortfolio() {
  const [state, setState] = useState<ApiState<PortfolioStats>>({
    data: null, loading: true, error: null,
  });

  const fetch = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await apiClient.getPortfolio();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState({ data: null, loading: false, error: String(e) });
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { ...state, refetch: fetch };
}

// ─── Assessment hook ────────────────────────────────────────────────────────

export function useAssessment(facilityId: string | null) {
  const [state, setState] = useState<ApiState<RiskAssessment>>({
    data: null, loading: false, error: null,
  });

  useEffect(() => {
    if (!facilityId) return;
    setState({ data: null, loading: true, error: null });
    apiClient.getAssessment(facilityId)
      .then(data => setState({ data, loading: false, error: null }))
      .catch(e  => setState({ data: null, loading: false, error: String(e) }));
  }, [facilityId]);

  return state;
}

// ─── Live clock ─────────────────────────────────────────────────────────────

export function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
