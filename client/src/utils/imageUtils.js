export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  const filename = imagePath.replace(/^.*[\\\/]/, '');
  return `${import.meta.env.VITE_API_URL}/user_rentals/${filename}`;
};