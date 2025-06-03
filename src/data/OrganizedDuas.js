import duaDatabase from './DuaDB.json';

// Helper function to categorize duas based on their names
const categorizeDuas = (duaData) => {
  // Check if duaData exists and has data array
  if (!duaData || !duaData.data || !Array.isArray(duaData.data)) {
    console.warn('Invalid dua data structure');
    return [];
  }

  const categories = {
    'Prayer Related': {
      id: 1,
      name: 'Prayer Related',
      description: 'Duas before, during and after prayers',
      icon: 'timer',
      color: '#2196F3',
      subCategories: ['Before Prayer', 'During Prayer', 'After Prayer'],
      duas: []
    },
    'Daily Activities': {
      id: 2,
      name: 'Daily Activities',
      description: 'Everyday supplications for a Muslim',
      icon: 'wb-sunny',
      color: '#FF9800',
      subCategories: ['Morning & Evening', 'Food & Drink', 'Home & Toilet', 'Sleep'],
      duas: []
    },
    'Protection & Relief': {
      id: 3,
      name: 'Protection & Relief',
      description: 'Duas for protection and seeking help',
      icon: 'shield',
      color: '#607D8B',
      subCategories: ['Protection', 'Times of Difficulty', 'Forgiveness'],
      duas: []
    },
    'Special Occasions': {
      id: 4,
      name: 'Special Occasions',
      description: 'Duas for special times and events',
      icon: 'event',
      color: '#9C27B0',
      subCategories: ['Weather', 'Travel', 'Hajj/Umrah', 'Gatherings'],
      duas: []
    },
    'Personal Supplications': {
      id: 5,
      name: 'Personal Supplications',
      description: 'Personal duas for various needs',
      icon: 'person',
      color: '#4CAF50',
      subCategories: ['Family', 'Health', 'Knowledge', 'Success'],
      duas: []
    },
    'Gratitude & Praise': {
      id: 6,
      name: 'Gratitude & Praise',
      description: 'Duas for thanking and praising Allah',
      icon: 'favorite',
      color: '#E91E63',
      subCategories: ['Thanking Allah', 'Praising Allah', 'General Gratitude'],
      duas: []
    }
  };

  // Categorization mapping
  const categoryMapping = {
    // Prayer Related
    'Remembrance After Prayer': 'Prayer Related',
    'After Salah Tasbeeh': 'Prayer Related',
    'After Takbeer (Start of prayer)': 'Prayer Related',
    'After Tashahhud': 'Prayer Related',
    'During Ruku (bowing down in prayer)': 'Prayer Related',
    'Dua e Qunoot (recited in Witr prayer)': 'Prayer Related',
    'On hearing Athan': 'Prayer Related',
    'Upon entering Mosque': 'Prayer Related',
    'Upon Leaving Mosque': 'Prayer Related',
    'Offer Salah regularly': 'Prayer Related',

    // Daily Activities
    'Morning remembrance': 'Daily Activities',
    'Evening remembrance': 'Daily Activities',
    'Before sleeping': 'Daily Activities',
    'After finishing a meal': 'Daily Activities',
    'Before entering toilet': 'Daily Activities',
    'After leaving toilet': 'Daily Activities',
    'Upon drinking milk': 'Daily Activities',
    'Upon Entering Home': 'Daily Activities',
    'Before starting anything': 'Daily Activities',
    'Everyday Duas': 'Daily Activities',

    // Protection & Relief
    'At times of worry and sorry': 'Protection & Relief',
    'For protection and help from Allah': 'Protection & Relief',
    'For protection from ignorance': 'Protection & Relief',
    'For protection from oppressors': 'Protection & Relief',
    'For protection from Satan/Shaytan': 'Protection & Relief',
    'For protection from the wrongdoers': 'Protection & Relief',
    'For controlling your anger': 'Protection & Relief',
    'For curbing fear': 'Protection & Relief',
    'For forgiveness': 'Protection & Relief',
    'For forgiveness and Allah\'s mercy': 'Protection & Relief',
    'For repentance': 'Protection & Relief',
    'Seek forgiveness and protection from hell': 'Protection & Relief',
    'If you fall on hard times': 'Protection & Relief',
    'To alleviate pain': 'Protection & Relief',
    'When a loss occurs': 'Protection & Relief',

    // Special Occasions
    'After rainfall': 'Special Occasions',
    'During a windstorm': 'Special Occasions',
    'For rain': 'Special Occasions',
    'Upon hearing thunder': 'Special Occasions',
    'For travel': 'Special Occasions',
    'At Arafat': 'Special Occasions',
    'For reciting at Al-Mash\'ar Al-Haraam': 'Special Occasions',
    'Takbeer when passing the black stone': 'Special Occasions',
    'Talbiyah': 'Special Occasions',
    'Upon reaching the Yemeni corner during Tawaf': 'Special Occasions',
    'At the end of a Gathering/Majlis': 'Special Occasions',
    'Upon sighting of the crescent moon': 'Special Occasions',

    // Personal Supplications
    'Asking Allah to grant you a child': 'Personal Supplications',
    'For a blissful family': 'Personal Supplications',
    'For a healthy life': 'Personal Supplications',
    'For parents': 'Personal Supplications',
    'For your child\'s protection': 'Personal Supplications',
    'Forgiveness for your parents and all Muslims': 'Personal Supplications',
    'Forgiveness for your siblings': 'Personal Supplications',
    'For accomodation': 'Personal Supplications',
    'For Rizq (sustenance)': 'Personal Supplications',
    'For success': 'Personal Supplications',
    'For Jannah': 'Personal Supplications',
    'Increase in knowledge': 'Personal Supplications',
    'For Istikhara': 'Personal Supplications',
    'Seek Allah\'s guidance': 'Personal Supplications',

    // Gratitude & Praise
    'For being grateful to Allah': 'Gratitude & Praise',
    'For thanking Allah (SWT)': 'Gratitude & Praise',
    'For thanking someone': 'Gratitude & Praise',
    'For praising Allah': 'Gratitude & Praise',
    'In times of happiness': 'Gratitude & Praise',
    'On hearing good news': 'Gratitude & Praise',
    'For someone who lends you money': 'Gratitude & Praise',
    'For someone who offers you a meal': 'Gratitude & Praise',
    'For someone who provides you with Iftar': 'Gratitude & Praise'
  };

  // Process each category from the database
  duaData.data.forEach((duaCategory, categoryIndex) => {
    if (!duaCategory || !duaCategory.name || !duaCategory.duas || !Array.isArray(duaCategory.duas)) {
      return; // Skip invalid category
    }
    
    const categoryName = duaCategory.name;
    const mappedCategory = categoryMapping[categoryName];
    
    if (mappedCategory && categories[mappedCategory]) {
      // Process each dua in the category
      duaCategory.duas.forEach((dua, duaIndex) => {
        if (!dua || !dua.title) {
          return; // Skip invalid dua
        }
        
        const processedDua = {
          id: `${categoryIndex}_${duaIndex}`,
          title: dua.title,
          arabic: dua.arabic || '',
          transliteration: dua.transliteration || '',
          translation: dua.translation || '',
          reference: dua.reference || 'Authentic Hadith',
          category: mappedCategory,
          originalCategory: categoryName,
          tags: [mappedCategory.toLowerCase(), categoryName.toLowerCase()]
        };
        
        categories[mappedCategory].duas.push(processedDua);
      });
    }
  });

  // Calculate dua counts
  Object.keys(categories).forEach(catKey => {
    categories[catKey].duaCount = categories[catKey].duas.length;
  });

  return Object.values(categories);
};

// Get organized data
const organizedCategories = categorizeDuas(duaDatabase) || [];

// Create featured duas (first dua from each category)
export const featuredDuas = organizedCategories
  .filter(cat => cat && cat.duas && cat.duas.length > 0)
  .map(cat => cat.duas[0])
  .slice(0, 5) || [];

// Export all categories
export const categories = organizedCategories || [];

// Export all duas flattened
export const allDuas = organizedCategories.flatMap(cat => cat && cat.duas ? cat.duas : []) || [];

// Helper function to get duas by category
export const getDuasByCategory = (categoryName) => {
  if (!organizedCategories || !Array.isArray(organizedCategories)) return [];
  const category = organizedCategories.find(cat => cat && cat.name === categoryName);
  return category && category.duas ? category.duas : [];
};

// Helper function to get duas by original category name
export const getDuasByOriginalCategory = (originalCategoryName) => {
  if (!allDuas || !Array.isArray(allDuas)) return [];
  return allDuas.filter(dua => dua && dua.originalCategory === originalCategoryName);
};

// Helper function to get duas by subcategory
export const getDuasBySubcategory = (categoryName, subcategoryName) => {
  if (!organizedCategories || !Array.isArray(organizedCategories)) return [];
  
  const category = organizedCategories.find(cat => cat && cat.name === categoryName);
  if (!category || !category.duas) return [];
  
  // Create a mapping of subcategories to original category names
  const subcategoryMapping = {
    // Prayer Related
    'Before Prayer': ['After Takbeer (Start of prayer)', 'On hearing Athan', 'Upon entering Mosque'],
    'During Prayer': ['During Ruku (bowing down in prayer)', 'After Tashahhud', 'Dua e Qunoot (recited in Witr prayer)'],
    'After Prayer': ['Remembrance After Prayer', 'After Salah Tasbeeh', 'Upon Leaving Mosque', 'Offer Salah regularly'],
    
    // Daily Activities  
    'Morning & Evening': ['Morning remembrance', 'Evening remembrance'],
    'Food & Drink': ['After finishing a meal', 'Upon drinking milk'],
    'Home & Toilet': ['Before entering toilet', 'After leaving toilet', 'Upon Entering Home'],
    'Sleep': ['Before sleeping'],
    
    // Protection & Relief
    'Protection': ['For protection and help from Allah', 'For protection from ignorance', 'For protection from oppressors', 'For protection from Satan/Shaytan', 'For protection from the wrongdoers'],
    'Times of Difficulty': ['At times of worry and sorry', 'For controlling your anger', 'For curbing fear', 'If you fall on hard times', 'To alleviate pain', 'When a loss occurs'],
    'Forgiveness': ['For forgiveness', 'For forgiveness and Allah\'s mercy', 'For repentance', 'Seek forgiveness and protection from hell'],
    
    // Special Occasions
    'Weather': ['After rainfall', 'During a windstorm', 'For rain', 'Upon hearing thunder'],
    'Travel': ['For travel'],
    'Hajj/Umrah': ['At Arafat', 'For reciting at Al-Mash\'ar Al-Haraam', 'Takbeer when passing the black stone', 'Talbiyah', 'Upon reaching the Yemeni corner during Tawaf'],
    'Gatherings': ['At the end of a Gathering/Majlis', 'Upon sighting of the crescent moon'],
    
    // Personal Supplications
    'Family': ['Asking Allah to grant you a child', 'For a blissful family', 'For parents', 'For your child\'s protection', 'Forgiveness for your parents and all Muslims', 'Forgiveness for your siblings'],
    'Health': ['For a healthy life'],
    'Knowledge': ['Increase in knowledge'],
    'Success': ['For success', 'For Jannah', 'For Istikhara', 'Seek Allah\'s guidance', 'For accomodation', 'For Rizq (sustenance)'],
    
    // Gratitude & Praise
    'Thanking Allah': ['For being grateful to Allah', 'For thanking Allah (SWT)', 'For thanking someone'],
    'Praising Allah': ['For praising Allah'],
    'General Gratitude': ['In times of happiness', 'On hearing good news', 'For someone who lends you money', 'For someone who offers you a meal', 'For someone who provides you with Iftar']
  };
  
  const mappedCategories = subcategoryMapping[subcategoryName] || [];
  
  return category.duas.filter(dua => 
    dua && mappedCategories.includes(dua.originalCategory)
  );
};

// Export the complete organized structure
export default {
  categories: organizedCategories,
  featuredDuas,
  allDuas,
  getDuasByCategory,
  getDuasByOriginalCategory,
  getDuasBySubcategory
}; 