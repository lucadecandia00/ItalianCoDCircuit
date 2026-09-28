export type Language = "it" | "en";
export type LocalText = Record<Language, string>;
export type TournamentStatus = "open" | "limited" | "closed" | "completed";

export interface Tournament {
  id: string;
  name: string;
  game: string;
  date: string;
  time: string;
  format: string;
  platform: string;
  capacity: number;
  registered: number;
  prizePool: string;
  status: TournamentStatus;
  location: string;
  image: string;
  description: LocalText;
  rules: LocalText[];
  schedule: Array<{ time: string; label: LocalText }>;
}

export interface Player {
  id: string;
  username: string;
  avatar: string;
  country: string;
  countryCode: string;
  platform: string;
  role: string;
  team?: string;
  wins: number;
  kd: number;
  points: number;
}

export interface CircuitEvent {
  id: string;
  name: LocalText;
  date: string;
  location: string;
  status: "upcoming" | "past";
  image: string;
  description: LocalText;
}