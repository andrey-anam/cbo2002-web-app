// CBO React Query Hooks - Clean Architecture Presentation Layer
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cboService } from '@/services/api/cbo-service';
import type { TCBOSearchParams } from '@/types/cbo';

// Query Keys
export const cboQueryKeys = {
  all: ['cbo'] as const,
  occupations: () => [...cboQueryKeys.all, 'occupations'] as const,
  occupation: (id: number) => [...cboQueryKeys.occupations(), id] as const,
  searchOccupations: (params: TCBOSearchParams) => [...cboQueryKeys.occupations(), 'search', params] as const,
  bigGroups: () => [...cboQueryKeys.all, 'bigGroups'] as const,
  bigGroup: (id: number) => [...cboQueryKeys.bigGroups(), id] as const,
  subGroups: () => [...cboQueryKeys.all, 'subGroups'] as const,
  subGroup: (id: number) => 
    [...cboQueryKeys.subGroups(), id] as const,
  occupationStats: () => [...cboQueryKeys.all, 'occupationStats'] as const,
  frequent: () => [...cboQueryKeys.occupations(), 'frequent'] as const,
  recent: () => [...cboQueryKeys.occupations(), 'recent'] as const,
  autoComplete: (query: string) => [...cboQueryKeys.all, 'autocomplete', query] as const,
};

// Search Occupations Hook
export const useSearchOccupations = (params: TCBOSearchParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: cboQueryKeys.searchOccupations(params),
    queryFn: () => cboService.searchOccupations(params),
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Occupation by Code Hook
export const useOccupation = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: cboQueryKeys.occupation(id),
    queryFn: () => cboService.getOccupationById(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get Major Groups Hook
export const useBigGroups = () => {
  return useQuery({
    queryKey: cboQueryKeys.bigGroups(),
    queryFn: () => cboService.getBigGroups(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get Major Group Hook
export const useBigGroup = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: cboQueryKeys.bigGroup(id),
    queryFn: () => cboService.getBigGroupById(id),
    enabled: enabled && !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get Subgroups Hook
export const useSubGroups = () => {
  return useQuery({
    queryKey: cboQueryKeys.subGroups(),
    queryFn: () => cboService.getSubgroups(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Get Statistics Hook
export const useOccupationStats = () => {
  return useQuery({
    queryKey: cboQueryKeys.occupationStats(),
    queryFn: () => cboService.getOccupationStats(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Get Popular Occupations Hook
export const useFrequentOccupations = (limit: number = 10) => {
  return useQuery({
    queryKey: [...cboQueryKeys.frequent(), limit],
    queryFn: () => cboService.getFrequentOccupations(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get Recent Occupations Hook
export const useRecentOccupations = (limit: number = 10) => {
  return useQuery({
    queryKey: [...cboQueryKeys.recent(), limit],
    queryFn: () => cboService.getRecentOccupations(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Auto-complete Hook
export const useAutoComplete = (query: string, limit: number = 5) => {
  return useQuery({
    queryKey: [...cboQueryKeys.autoComplete(query), limit],
    queryFn: () => cboService.autoComplete(query, limit),
    enabled: query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Invalidation Helpers
export const useCBOInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: cboQueryKeys.all });
  };

  const invalidateOccupations = () => {
    queryClient.invalidateQueries({ queryKey: cboQueryKeys.occupations() });
  };

  const invalidateSearch = () => {
    queryClient.invalidateQueries({ 
      queryKey: cboQueryKeys.occupations(),
      predicate: (query) => query.queryKey.includes('search')
    });
  };

  return {
    invalidateAll,
    invalidateOccupations,
    invalidateSearch,
  };
};

// Prefetch Helpers
export const useCBOPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchBigGroups = async () => {
    await queryClient.prefetchQuery({
      queryKey: cboQueryKeys.bigGroups(),
      queryFn: () => cboService.getBigGroups(),
      staleTime: 30 * 60 * 1000,
    });
  };

  const prefetchStats = async () => {
    await queryClient.prefetchQuery({
      queryKey: cboQueryKeys.occupationStats(),
      queryFn: () => cboService.getOccupationStats(),
      staleTime: 60 * 60 * 1000,
    });
  };

  const prefetchFrequent = async (limit: number = 10) => {
    await queryClient.prefetchQuery({
      queryKey: [...cboQueryKeys.frequent(), limit],
      queryFn: () => cboService.getFrequentOccupations(limit),
      staleTime: 15 * 60 * 1000,
    });
  };

  return {
    prefetchBigGroups,
    prefetchStats,
    prefetchFrequent,
  };
};