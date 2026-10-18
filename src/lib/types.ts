export type GuestPublic = {
  id: string;
  name: string;
  photoUrl: string | null;
  balance: number;
  rank: number;
};

export type GuestRow = {
  id: string;
  name: string;
  photo_path: string | null;
  balance: number;
  created_at: string;
};
