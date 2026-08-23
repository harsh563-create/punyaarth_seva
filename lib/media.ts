/** Shared URL helpers for the media library, pickers and public renderers. */

/** Extract a YouTube video id from watch / youtu.be / shorts / embed URLs. */
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return m ? m[1] : null;
}

/** True for direct video files (.mp4/.webm/...) that can play in a <video> tag. */
export function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|ogv|mov|m4v)(\?|#|$)/i.test(url);
}

/** Guess whether a URL should live in the library as an image or a video. */
export function detectMediaKind(url: string): 'image' | 'video' {
  if (youtubeId(url) || isDirectVideo(url)) return 'video';
  return 'image';
}

/** Cheap thumbnail for grid previews — YouTube serves one, else the URL itself. */
export function mediaThumb(url: string): string {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : url;
}
