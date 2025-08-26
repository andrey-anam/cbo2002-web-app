// CBO Service - Clean Architecture Application Layer
import { apiClient } from './axios-config';
import {
  mockSearchOccupations,
  mockAutoComplete,
  mockStatistics,
  mockPopularOccupations,
  delay,
  mockGetOccupationById,
  mockOccupations
} from '@/data/mock-cbo-data';
import type { TCBOBigGroup, TCBOFamily, TCBOMainSubGroup, TCBOOccupation, TCBOSearchParams, TCBOSearchResponse, TCBOStats, TCBOSubGroup } from '@/types/cbo';
import { THttpResponse } from '@/types/http';

const USE_MOCK_DATA = false; // Toggle for development

export class CBOService {
  private readonly baseEndpoint = '/api';

  // Search occupations
  async searchOccupations(params: TCBOSearchParams): Promise<TCBOSearchResponse> {
    const queryParams = new URLSearchParams();

    if (params.label) queryParams.set('label', params.label);
    if (params.id) queryParams.set('id', params.id);
    if (params.level) queryParams.set('level', params.level.toString());
    if (params.bigGroup) queryParams.set('bigGroup', params.bigGroup);
    if (params.mainSubGroup) queryParams.set('mainSubGroup', params.mainSubGroup);
    if (params.subGroup) queryParams.set('subgroup', params.subGroup);
    if (params.family) queryParams.set('family', params.family);
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.perPage) queryParams.set('perPage', params.perPage.toString());

    return await apiClient.get<TCBOSearchResponse>(
      `${this.baseEndpoint}/occupations/search`,
      {
        params: Object.fromEntries(queryParams.entries())
      }
    );
  }

  // Get occupation by code
  async getOccupationById(id: number): Promise<THttpResponse<TCBOOccupation>> {
    return await apiClient.get<THttpResponse<TCBOOccupation>>(`${this.baseEndpoint}/occupations/${id}`);
  }

  // Get all major groups
  async getBigGroups(): Promise<THttpResponse<TCBOBigGroup>> {
    return await apiClient.get<THttpResponse<TCBOBigGroup>>(`${this.baseEndpoint}/big-groups`);
  }

  // Get major group by code
  async getBigGroupById(id: number): Promise<THttpResponse<TCBOBigGroup>> {
    return await apiClient.get<THttpResponse<TCBOBigGroup>>(`${this.baseEndpoint}/big-groups/${id}`);
  }

  // Get subgroups by major group
  async getSubgroups(): Promise<THttpResponse<TCBOSubGroup>> {
    return await apiClient.get<THttpResponse<TCBOSubGroup>>(
      `${this.baseEndpoint}/sub-groups`
    );
  }

  // Get subgroup by code
  async getSubgroupById(id: number): Promise<THttpResponse<TCBOSubGroup>> {
    return await apiClient.get<THttpResponse<TCBOSubGroup>>(
      `${this.baseEndpoint}/sub-groups/${id}`
    );
  }

  // Get principal subgroups
  async getMainSubGroups(): Promise<THttpResponse<TCBOMainSubGroup>> {
    return await apiClient.get<THttpResponse<TCBOMainSubGroup>>(
      `${this.baseEndpoint}/main-sub-groups`
    );
  }

  // Get base groups
  async getFmilies(): Promise<THttpResponse<TCBOFamily>> {
    return await apiClient.get<THttpResponse<TCBOFamily>>(
      `${this.baseEndpoint}/families`
    );
  }

  // Get statistics
  async getOccupationStats(): Promise<THttpResponse<TCBOStats>> {
    return apiClient.get<THttpResponse<TCBOStats>>(`${this.baseEndpoint}/analytics/stats`);
  }

  // Get popular occupations
  async getFrequentOccupations(limit: number = 10): Promise<THttpResponse<TCBOOccupation>> {
    return apiClient.get<THttpResponse<TCBOOccupation>>(
      `${this.baseEndpoint}/occupations`,
      {
        params: {
          perPage: limit
        }
      }
    );
  }

  // Get recent occupations
  async getRecentOccupations(limit: number = 10): Promise<THttpResponse<TCBOOccupation>> {
    return apiClient.get<THttpResponse<TCBOOccupation>>(
      `${this.baseEndpoint}/occupations`,
      {
        params: {
          perPage: limit
        }
      }
    );
  }

  // Auto-complete search
  async autoComplete(query: string, limit: number = 5): Promise<THttpResponse<TCBOOccupation>> {
    return apiClient.get<THttpResponse<TCBOOccupation>>(`${this.baseEndpoint}/occupations/search`, {
      params: {
        label: encodeURIComponent(query),
        perPage: limit
      }
    });
  }
}

// Export singleton instance
export const cboService = new CBOService();

// Export for dependency injection if needed
export default CBOService;