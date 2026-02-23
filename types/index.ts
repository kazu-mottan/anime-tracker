export type MediaStatus = 'watched' | 'watching' | 'plan-to-watch';
export type MediaType = 'anime' | 'movie';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  status: MediaStatus;
  coverUrl?: string;
  synopsis?: string;
  note?: string;
  addedAt: string;
  malId?: number;
}

export interface JikanAnimeResult {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string | null;
  score: number | null;
  episodes: number | null;
  type: string | null;
}

export interface JikanSearchResponse {
  data: JikanAnimeResult[];
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
}

export interface JikanSeasonalResponse {
  data: JikanAnimeResult[];
  pagination: JikanPagination;
}
