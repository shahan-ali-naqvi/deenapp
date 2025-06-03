import { categories as organizedCategories, featuredDuas as organizedFeaturedDuas, allDuas as organizedAllDuas, getDuasByCategory as organizedGetDuasByCategory, getDuasBySubcategory as organizedGetDuasBySubcategory } from './OrganizedDuas';

// Export the organized data with the same interface as before
export const categories = organizedCategories || [];
export const featuredDuas = organizedFeaturedDuas || [];
export const allDuas = organizedAllDuas || [];
export const getDuasByCategory = organizedGetDuasByCategory || (() => []);
export const getDuasBySubcategory = organizedGetDuasBySubcategory || (() => []); 