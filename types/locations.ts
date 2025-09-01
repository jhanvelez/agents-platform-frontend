export interface City {
  id: string;
  name: string;
}

export interface Deparment {
  id: string;
  name: string;
  children: City[];
}