export interface JokeApiResponse {
  categories: any[]
  created_at: string
  icon_url: string
  id: string
  updated_at: string
  url: string
  value : string
}

export interface JokeViewModel extends JokeApiResponse {
  isFavourite: boolean;
  visibleInStream: boolean;
}
