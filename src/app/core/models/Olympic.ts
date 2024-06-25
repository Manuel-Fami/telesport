// TODO: create here a typescript interface for an olympic country
/*
example of an olympic country:
{
    id: 1,
    country: "Italy",
    participations: []
}
*/
export interface participations {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athletesCount: number;
}

export interface OlympicData {
  id: number;
  country: string;
  participations: [];
}
