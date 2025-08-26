// CBO Types - Clean Architecture Domain Models

import { THttpResponse } from "./http";

export type TCBOOccupation = {
  id: number;
  label: string;
  description?: string;
  level: number;
  hierarchy: {
    big_group?: string;
    sub_group?: string;
    main_sub_group?: string;
    family?: string;
  };
  synonymous: string[];
  activities?: string[];
  competencies?: string[];
  work_conditions?: string[];
  academy?: string[];
  work_resources?: string[];
}

export type TCBOBigGroup = {
  id: number;
  label: string;
  main_sub_groups: TCBOMainSubGroup[];
}

export type TCBOSubGroup = {
  id: number;
  label: string;
  family: TCBOFamily[];
}

export type TCBOMainSubGroup = {
  id: number;
  label: string;
  description: string;
  sub_group: TCBOSubGroup[];
}

export type TCBOFamily = {
  id: number;
  label: string;
  description: string;
  occupations: TCBOOccupation[];
}

export type TCBOSearchParams = {
  label?: string;
  familyId?: number;
  id?: string;
  level?: number;
  bigGroup?: string;
  mainSubGroup?: string;
  subGroup?: string;
  family?: string;
  page?: number;
  perPage?: number;
  description?: string;
  synonymous?: string;
}

export type TCBOSearchResponse = THttpResponse<TCBOOccupation>;

export type TCBOStats = {
  totalOccupations: number;
  totalBigGroups: number;
  totalSubGroups: number;
  totalMainSubGroups: number;
  totalFamily: number;
}