export const BASE_URL = "http://127.0.0.1:5000";

export const getImageUrl = (imagePath: string | undefined | null) => {
  if (!imagePath || imagePath === "") {
    return "https://placehold.co/400x600/1a1a1f/ffb400?text=No+Image";
  }

  const cleanPath = imagePath.trim();
  // If it's a cloud link (Jikan), return it
  if (cleanPath.startsWith("http")) return cleanPath;

  // Local path fix
  const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
  return `${BASE_URL}${formattedPath}`;
};

export const formatTimeAgo = (date: string) => {
  if (!date) return "Just now";
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + "m ago";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + "h ago";
  return Math.floor(hours / 24) + "d ago";
};

