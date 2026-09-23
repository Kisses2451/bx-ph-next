/** One entry in the home page feed: either a latest update or an upcoming event, merged and sorted by date. */
export type HomeFeedItem =
  | { type: 'update'; id: string; date: string; tag: string | null; title: string; description: string | null }
  | { type: 'event'; id: string; date: string; title: string; description: string | null; location: string | null }
