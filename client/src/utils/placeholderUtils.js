/*This file contains static data and helper functions for generating
 * dynamic placeholder text and default values in add item forms.
 * Category-specific placeholder text for size/dimensions input
 */
export const DIM_PLACEHOLDERS = {
  "Electronics and Gadgets": "e.g., 6.1 in x 2.9 in x 0.3 in",
  "Sports Essentials": "e.g., Ball diameter: 22 cm, Racket length: 68 cm",
  "Media and Hobbies": "e.g., Guitar: 40 in length, 15 in width",
  "Equipment and Tools": "e.g., 12 in x 5 in x 3 in",
  "Books" : "e.g., 8.5 in x 11 in",
  "Clothing and Fashion": "e.g., S, M, L, XL",
  "Furniture" : "e.g., 180 cm x 90 cm x 40 cm",
  "Vehicles and Transport": "e.g., 4.5 m x 1.8 m x 1.6 m",
  "Home and Appliances": "e.g., 50 cm x 40 cm x 30 cm",
  "Events and Parties": "e.g., 2 m x 1.5 m x 1 m",
  "Outdoor and Travel": "e.g., 60 cm x 40 cm x 20 cm",
  "Seasonal Item": "e.g., 100 cm x 80 cm",
};

/*Fallback placeholder when no category is selected*/
export const DEFAULT_DIM_PLACEHOLDER =
  "Enter product size/dimensions (e.g., Length x Width x Height)";

export const getSizePlaceholder = (category) => {
  return category
    ? DIM_PLACEHOLDERS[category] || DEFAULT_DIM_PLACEHOLDER
    : DEFAULT_DIM_PLACEHOLDER;
};

/*Default rental terms and conditions */
export const DEFAULT_TERMS = [
  { label: "Minimum rental period", value: "1 day" },
  { label: "Late fee", value: "20% of the daily rate/day" },
  { label: "No international travel with the item" },
  { label: "Handle with care; any damages will be deducted from deposit" },
  { label: "Renter must present a valid government ID upon renting" },
];
