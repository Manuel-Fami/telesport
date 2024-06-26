// TODO: create here a typescript interface for an olympic country
/*
example of an olympic country:
{
    id: 1,
    country: "Italy",
    participations: []
}
*/

import { Participation } from './Participation';

export interface OlympicData {
  id: number;
  country: string;
  participations: Participation[];

}
