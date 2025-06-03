import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import { rw, rh } from '../utils/responsive';

// Quran data - static import
const SURAHS = require('../assets/QuranSource/surah.json');
const AVAILABLE_TRANSLATIONS = [
  { code: 'en', name: 'English' }
];

// Pre-load surah files - this approach avoids dynamic requires
const getSurahFile = (number) => {
  switch (number) {
    case 1: return require('../assets/QuranSource/surah/surah_1.json');
    case 2: return require('../assets/QuranSource/surah/surah_2.json');
    case 3: return require('../assets/QuranSource/surah/surah_3.json');
    case 4: return require('../assets/QuranSource/surah/surah_4.json');
    case 5: return require('../assets/QuranSource/surah/surah_5.json');
    case 6: return require('../assets/QuranSource/surah/surah_6.json');
    case 7: return require('../assets/QuranSource/surah/surah_7.json');
    case 8: return require('../assets/QuranSource/surah/surah_8.json');
    case 9: return require('../assets/QuranSource/surah/surah_9.json');
    case 10: return require('../assets/QuranSource/surah/surah_10.json');
    case 11: return require('../assets/QuranSource/surah/surah_11.json');
    case 12: return require('../assets/QuranSource/surah/surah_12.json');
    case 13: return require('../assets/QuranSource/surah/surah_13.json');
    case 14: return require('../assets/QuranSource/surah/surah_14.json');
    case 15: return require('../assets/QuranSource/surah/surah_15.json');
    case 16: return require('../assets/QuranSource/surah/surah_16.json');
    case 17: return require('../assets/QuranSource/surah/surah_17.json');
    case 18: return require('../assets/QuranSource/surah/surah_18.json');
    case 19: return require('../assets/QuranSource/surah/surah_19.json');
    case 20: return require('../assets/QuranSource/surah/surah_20.json');
    case 21: return require('../assets/QuranSource/surah/surah_21.json');
    case 22: return require('../assets/QuranSource/surah/surah_22.json');
    case 23: return require('../assets/QuranSource/surah/surah_23.json');
    case 24: return require('../assets/QuranSource/surah/surah_24.json');
    case 25: return require('../assets/QuranSource/surah/surah_25.json');
    case 26: return require('../assets/QuranSource/surah/surah_26.json');
    case 27: return require('../assets/QuranSource/surah/surah_27.json');
    case 28: return require('../assets/QuranSource/surah/surah_28.json');
    case 29: return require('../assets/QuranSource/surah/surah_29.json');
    case 30: return require('../assets/QuranSource/surah/surah_30.json');
    case 31: return require('../assets/QuranSource/surah/surah_31.json');
    case 32: return require('../assets/QuranSource/surah/surah_32.json');
    case 33: return require('../assets/QuranSource/surah/surah_33.json');
    case 34: return require('../assets/QuranSource/surah/surah_34.json');
    case 35: return require('../assets/QuranSource/surah/surah_35.json');
    case 36: return require('../assets/QuranSource/surah/surah_36.json');
    case 37: return require('../assets/QuranSource/surah/surah_37.json');
    case 38: return require('../assets/QuranSource/surah/surah_38.json');
    case 39: return require('../assets/QuranSource/surah/surah_39.json');
    case 40: return require('../assets/QuranSource/surah/surah_40.json');
    case 41: return require('../assets/QuranSource/surah/surah_41.json');
    case 42: return require('../assets/QuranSource/surah/surah_42.json');
    case 43: return require('../assets/QuranSource/surah/surah_43.json');
    case 44: return require('../assets/QuranSource/surah/surah_44.json');
    case 45: return require('../assets/QuranSource/surah/surah_45.json');
    case 46: return require('../assets/QuranSource/surah/surah_46.json');
    case 47: return require('../assets/QuranSource/surah/surah_47.json');
    case 48: return require('../assets/QuranSource/surah/surah_48.json');
    case 49: return require('../assets/QuranSource/surah/surah_49.json');
    case 50: return require('../assets/QuranSource/surah/surah_50.json');
    case 51: return require('../assets/QuranSource/surah/surah_51.json');
    case 52: return require('../assets/QuranSource/surah/surah_52.json');
    case 53: return require('../assets/QuranSource/surah/surah_53.json');
    case 54: return require('../assets/QuranSource/surah/surah_54.json');
    case 55: return require('../assets/QuranSource/surah/surah_55.json');
    case 56: return require('../assets/QuranSource/surah/surah_56.json');
    case 57: return require('../assets/QuranSource/surah/surah_57.json');
    case 58: return require('../assets/QuranSource/surah/surah_58.json');
    case 59: return require('../assets/QuranSource/surah/surah_59.json');
    case 60: return require('../assets/QuranSource/surah/surah_60.json');
    case 61: return require('../assets/QuranSource/surah/surah_61.json');
    case 62: return require('../assets/QuranSource/surah/surah_62.json');
    case 63: return require('../assets/QuranSource/surah/surah_63.json');
    case 64: return require('../assets/QuranSource/surah/surah_64.json');
    case 65: return require('../assets/QuranSource/surah/surah_65.json');
    case 66: return require('../assets/QuranSource/surah/surah_66.json');
    case 67: return require('../assets/QuranSource/surah/surah_67.json');
    case 68: return require('../assets/QuranSource/surah/surah_68.json');
    case 69: return require('../assets/QuranSource/surah/surah_69.json');
    case 70: return require('../assets/QuranSource/surah/surah_70.json');
    case 71: return require('../assets/QuranSource/surah/surah_71.json');
    case 72: return require('../assets/QuranSource/surah/surah_72.json');
    case 73: return require('../assets/QuranSource/surah/surah_73.json');
    case 74: return require('../assets/QuranSource/surah/surah_74.json');
    case 75: return require('../assets/QuranSource/surah/surah_75.json');
    case 76: return require('../assets/QuranSource/surah/surah_76.json');
    case 77: return require('../assets/QuranSource/surah/surah_77.json');
    case 78: return require('../assets/QuranSource/surah/surah_78.json');
    case 79: return require('../assets/QuranSource/surah/surah_79.json');
    case 80: return require('../assets/QuranSource/surah/surah_80.json');
    case 81: return require('../assets/QuranSource/surah/surah_81.json');
    case 82: return require('../assets/QuranSource/surah/surah_82.json');
    case 83: return require('../assets/QuranSource/surah/surah_83.json');
    case 84: return require('../assets/QuranSource/surah/surah_84.json');
    case 85: return require('../assets/QuranSource/surah/surah_85.json');
    case 86: return require('../assets/QuranSource/surah/surah_86.json');
    case 87: return require('../assets/QuranSource/surah/surah_87.json');
    case 88: return require('../assets/QuranSource/surah/surah_88.json');
    case 89: return require('../assets/QuranSource/surah/surah_89.json');
    case 90: return require('../assets/QuranSource/surah/surah_90.json');
    case 91: return require('../assets/QuranSource/surah/surah_91.json');
    case 92: return require('../assets/QuranSource/surah/surah_92.json');
    case 93: return require('../assets/QuranSource/surah/surah_93.json');
    case 94: return require('../assets/QuranSource/surah/surah_94.json');
    case 95: return require('../assets/QuranSource/surah/surah_95.json');
    case 96: return require('../assets/QuranSource/surah/surah_96.json');
    case 97: return require('../assets/QuranSource/surah/surah_97.json');
    case 98: return require('../assets/QuranSource/surah/surah_98.json');
    case 99: return require('../assets/QuranSource/surah/surah_99.json');
    case 100: return require('../assets/QuranSource/surah/surah_100.json');
    case 101: return require('../assets/QuranSource/surah/surah_101.json');
    case 102: return require('../assets/QuranSource/surah/surah_102.json');
    case 103: return require('../assets/QuranSource/surah/surah_103.json');
    case 104: return require('../assets/QuranSource/surah/surah_104.json');
    case 105: return require('../assets/QuranSource/surah/surah_105.json');
    case 106: return require('../assets/QuranSource/surah/surah_106.json');
    case 107: return require('../assets/QuranSource/surah/surah_107.json');
    case 108: return require('../assets/QuranSource/surah/surah_108.json');
    case 109: return require('../assets/QuranSource/surah/surah_109.json');
    case 110: return require('../assets/QuranSource/surah/surah_110.json');
    case 111: return require('../assets/QuranSource/surah/surah_111.json');
    case 112: return require('../assets/QuranSource/surah/surah_112.json');
    case 113: return require('../assets/QuranSource/surah/surah_113.json');
    case 114: return require('../assets/QuranSource/surah/surah_114.json');
    default: throw new Error(`Surah ${number} not found`);
  }
};

// Pre-load translation files
const getTranslationFile = (language, number) => {
  // Since we only support English now, we'll always return English translations
  switch (number) {
    case 1: return require('../assets/QuranSource/translation/en/en_translation_1.json');
    case 2: return require('../assets/QuranSource/translation/en/en_translation_2.json');
    case 3: return require('../assets/QuranSource/translation/en/en_translation_3.json');
    case 4: return require('../assets/QuranSource/translation/en/en_translation_4.json');
    case 5: return require('../assets/QuranSource/translation/en/en_translation_5.json');
    case 6: return require('../assets/QuranSource/translation/en/en_translation_6.json');
    case 7: return require('../assets/QuranSource/translation/en/en_translation_7.json');
    case 8: return require('../assets/QuranSource/translation/en/en_translation_8.json');
    case 9: return require('../assets/QuranSource/translation/en/en_translation_9.json');
    case 10: return require('../assets/QuranSource/translation/en/en_translation_10.json');
    case 11: return require('../assets/QuranSource/translation/en/en_translation_11.json');
    case 12: return require('../assets/QuranSource/translation/en/en_translation_12.json');
    case 13: return require('../assets/QuranSource/translation/en/en_translation_13.json');
    case 14: return require('../assets/QuranSource/translation/en/en_translation_14.json');
    case 15: return require('../assets/QuranSource/translation/en/en_translation_15.json');
    case 16: return require('../assets/QuranSource/translation/en/en_translation_16.json');
    case 17: return require('../assets/QuranSource/translation/en/en_translation_17.json');
    case 18: return require('../assets/QuranSource/translation/en/en_translation_18.json');
    case 19: return require('../assets/QuranSource/translation/en/en_translation_19.json');
    case 20: return require('../assets/QuranSource/translation/en/en_translation_20.json');
    // Add all 114 surahs
    case 21: return require('../assets/QuranSource/translation/en/en_translation_21.json');
    case 22: return require('../assets/QuranSource/translation/en/en_translation_22.json');
    case 23: return require('../assets/QuranSource/translation/en/en_translation_23.json');
    case 24: return require('../assets/QuranSource/translation/en/en_translation_24.json');
    case 25: return require('../assets/QuranSource/translation/en/en_translation_25.json');
    case 26: return require('../assets/QuranSource/translation/en/en_translation_26.json');
    case 27: return require('../assets/QuranSource/translation/en/en_translation_27.json');
    case 28: return require('../assets/QuranSource/translation/en/en_translation_28.json');
    case 29: return require('../assets/QuranSource/translation/en/en_translation_29.json');
    case 30: return require('../assets/QuranSource/translation/en/en_translation_30.json');
    case 31: return require('../assets/QuranSource/translation/en/en_translation_31.json');
    case 32: return require('../assets/QuranSource/translation/en/en_translation_32.json');
    case 33: return require('../assets/QuranSource/translation/en/en_translation_33.json');
    case 34: return require('../assets/QuranSource/translation/en/en_translation_34.json');
    case 35: return require('../assets/QuranSource/translation/en/en_translation_35.json');
    case 36: return require('../assets/QuranSource/translation/en/en_translation_36.json');
    case 37: return require('../assets/QuranSource/translation/en/en_translation_37.json');
    case 38: return require('../assets/QuranSource/translation/en/en_translation_38.json');
    case 39: return require('../assets/QuranSource/translation/en/en_translation_39.json');
    case 40: return require('../assets/QuranSource/translation/en/en_translation_40.json');
    case 41: return require('../assets/QuranSource/translation/en/en_translation_41.json');
    case 42: return require('../assets/QuranSource/translation/en/en_translation_42.json');
    case 43: return require('../assets/QuranSource/translation/en/en_translation_43.json');
    case 44: return require('../assets/QuranSource/translation/en/en_translation_44.json');
    case 45: return require('../assets/QuranSource/translation/en/en_translation_45.json');
    case 46: return require('../assets/QuranSource/translation/en/en_translation_46.json');
    case 47: return require('../assets/QuranSource/translation/en/en_translation_47.json');
    case 48: return require('../assets/QuranSource/translation/en/en_translation_48.json');
    case 49: return require('../assets/QuranSource/translation/en/en_translation_49.json');
    case 50: return require('../assets/QuranSource/translation/en/en_translation_50.json');
    case 51: return require('../assets/QuranSource/translation/en/en_translation_51.json');
    case 52: return require('../assets/QuranSource/translation/en/en_translation_52.json');
    case 53: return require('../assets/QuranSource/translation/en/en_translation_53.json');
    case 54: return require('../assets/QuranSource/translation/en/en_translation_54.json');
    case 55: return require('../assets/QuranSource/translation/en/en_translation_55.json');
    case 56: return require('../assets/QuranSource/translation/en/en_translation_56.json');
    case 57: return require('../assets/QuranSource/translation/en/en_translation_57.json');
    case 58: return require('../assets/QuranSource/translation/en/en_translation_58.json');
    case 59: return require('../assets/QuranSource/translation/en/en_translation_59.json');
    case 60: return require('../assets/QuranSource/translation/en/en_translation_60.json');
    case 61: return require('../assets/QuranSource/translation/en/en_translation_61.json');
    case 62: return require('../assets/QuranSource/translation/en/en_translation_62.json');
    case 63: return require('../assets/QuranSource/translation/en/en_translation_63.json');
    case 64: return require('../assets/QuranSource/translation/en/en_translation_64.json');
    case 65: return require('../assets/QuranSource/translation/en/en_translation_65.json');
    case 66: return require('../assets/QuranSource/translation/en/en_translation_66.json');
    case 67: return require('../assets/QuranSource/translation/en/en_translation_67.json');
    case 68: return require('../assets/QuranSource/translation/en/en_translation_68.json');
    case 69: return require('../assets/QuranSource/translation/en/en_translation_69.json');
    case 70: return require('../assets/QuranSource/translation/en/en_translation_70.json');
    case 71: return require('../assets/QuranSource/translation/en/en_translation_71.json');
    case 72: return require('../assets/QuranSource/translation/en/en_translation_72.json');
    case 73: return require('../assets/QuranSource/translation/en/en_translation_73.json');
    case 74: return require('../assets/QuranSource/translation/en/en_translation_74.json');
    case 75: return require('../assets/QuranSource/translation/en/en_translation_75.json');
    case 76: return require('../assets/QuranSource/translation/en/en_translation_76.json');
    case 77: return require('../assets/QuranSource/translation/en/en_translation_77.json');
    case 78: return require('../assets/QuranSource/translation/en/en_translation_78.json');
    case 79: return require('../assets/QuranSource/translation/en/en_translation_79.json');
    case 80: return require('../assets/QuranSource/translation/en/en_translation_80.json');
    case 81: return require('../assets/QuranSource/translation/en/en_translation_81.json');
    case 82: return require('../assets/QuranSource/translation/en/en_translation_82.json');
    case 83: return require('../assets/QuranSource/translation/en/en_translation_83.json');
    case 84: return require('../assets/QuranSource/translation/en/en_translation_84.json');
    case 85: return require('../assets/QuranSource/translation/en/en_translation_85.json');
    case 86: return require('../assets/QuranSource/translation/en/en_translation_86.json');
    case 87: return require('../assets/QuranSource/translation/en/en_translation_87.json');
    case 88: return require('../assets/QuranSource/translation/en/en_translation_88.json');
    case 89: return require('../assets/QuranSource/translation/en/en_translation_89.json');
    case 90: return require('../assets/QuranSource/translation/en/en_translation_90.json');
    case 91: return require('../assets/QuranSource/translation/en/en_translation_91.json');
    case 92: return require('../assets/QuranSource/translation/en/en_translation_92.json');
    case 93: return require('../assets/QuranSource/translation/en/en_translation_93.json');
    case 94: return require('../assets/QuranSource/translation/en/en_translation_94.json');
    case 95: return require('../assets/QuranSource/translation/en/en_translation_95.json');
    case 96: return require('../assets/QuranSource/translation/en/en_translation_96.json');
    case 97: return require('../assets/QuranSource/translation/en/en_translation_97.json');
    case 98: return require('../assets/QuranSource/translation/en/en_translation_98.json');
    case 99: return require('../assets/QuranSource/translation/en/en_translation_99.json');
    case 100: return require('../assets/QuranSource/translation/en/en_translation_100.json');
    case 101: return require('../assets/QuranSource/translation/en/en_translation_101.json');
    case 102: return require('../assets/QuranSource/translation/en/en_translation_102.json');
    case 103: return require('../assets/QuranSource/translation/en/en_translation_103.json');
    case 104: return require('../assets/QuranSource/translation/en/en_translation_104.json');
    case 105: return require('../assets/QuranSource/translation/en/en_translation_105.json');
    case 106: return require('../assets/QuranSource/translation/en/en_translation_106.json');
    case 107: return require('../assets/QuranSource/translation/en/en_translation_107.json');
    case 108: return require('../assets/QuranSource/translation/en/en_translation_108.json');
    case 109: return require('../assets/QuranSource/translation/en/en_translation_109.json');
    case 110: return require('../assets/QuranSource/translation/en/en_translation_110.json');
    case 111: return require('../assets/QuranSource/translation/en/en_translation_111.json');
    case 112: return require('../assets/QuranSource/translation/en/en_translation_112.json');
    case 113: return require('../assets/QuranSource/translation/en/en_translation_113.json');
    case 114: return require('../assets/QuranSource/translation/en/en_translation_114.json');
    default: throw new Error(`English translation for Surah ${number} not found`);
  }
};

/**
 * Main App Component for the Quran App
 */
const QuranScreen = () => {
  const [loading, setLoading] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahContent, setSurahContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  // Filter surahs based on search query
  const filteredSurahs = searchSurahs(searchQuery);

  /**
   * Loads surah content from local files
   */
  const loadSurah = async (surah) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedSurah(surah);
      
      const surahNumber = parseInt(surah.index);
      const content = await fetchSurah(surahNumber);
      setSurahContent(content);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading surah:', error);
      setLoading(false);
      setError('Failed to load Surah content. Please try again.');
    }
  };

  /**
   * Handle back button press
   */
  const handleBack = () => {
    if (selectedSurah) {
      setSelectedSurah(null);
      setSurahContent(null);
      setError(null);
    }
  };

  /**
   * Render surah list item
   */
  const renderSurahItem = ({ item }) => (
    <TouchableOpacity
      style={styles.surahItem}
      onPress={() => loadSurah(item)}
    >
      <View style={styles.surahNumberContainer}>
        <Text style={styles.surahNumber}>{item.index}</Text>
      </View>
      <View style={styles.surahDetails}>
        <Text style={styles.surahName}>{item.title}</Text>
        <Text style={styles.surahNameArabic}>{item.titleAr}</Text>
        <Text style={styles.versesCount}>
          {item.count} verses • {item.type} • {item.place}
        </Text>
      </View>
    </TouchableOpacity>
  );

  /**
   * Render verse item
   */
  const renderVerseItem = ({ item }) => (
    <View style={styles.verseContainer}>
      <View style={styles.verseNumberContainer}>
        <Text style={styles.verseNumber}>{item.number}</Text>
      </View>
      <View style={styles.verseContent}>
        <Text style={styles.arabicText}>{item.arabic}</Text>
        <Text style={styles.translationText}>{item.translation}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {selectedSurah ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={theme.colors.primary.main} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        <Text style={styles.title}>
          {selectedSurah 
            ? `${selectedSurah.index}. ${selectedSurah.title}` 
            : 'The Holy Quran'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Error message if any */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {selectedSurah ? (
        // Surah content view
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text style={styles.loadingText}>Loading Surah content...</Text>
          </View>
        ) : (
          <FlatList
            data={surahContent?.verses || []}
            renderItem={renderVerseItem}
            keyExtractor={(item) => `verse-${item.number}`}
            contentContainerStyle={styles.versesList}
          />
        )
      ) : (
        // Surah list view
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search surah by name or number"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>
          <FlatList
            data={filteredSurahs}
            renderItem={renderSurahItem}
            keyExtractor={(item) => item.index}
            contentContainerStyle={styles.surahList}
            initialNumToRender={20}
          />
        </>
      )}
    </SafeAreaView>
  );
};

/**
 * Fetches a surah from the local QuranSource folder
 * 
 * @param {number} surahNumber - The surah number (1-114)
 * @returns {Object} - The surah content with both Arabic and translation
 */
const fetchSurah = async (surahNumber) => {
  try {
    // Get Arabic file and translation file using our helper functions
    const arabicFile = getSurahFile(surahNumber);
    const translationFile = getTranslationFile('en', surahNumber);
    
    // Extract verses from both files
    const arabicVerses = arabicFile.verse;
    const translationVerses = translationFile.verse;
    
    // Combine Arabic and translation into verses array
    const verses = Object.keys(arabicVerses).map(verseKey => {
      const verseNumber = verseKey.replace('verse_', '');
      return {
        number: parseInt(verseNumber),
        arabic: arabicVerses[verseKey],
        translation: translationVerses[verseKey] || "Translation not available"
      };
    });
    
    // Sort verses by number
    verses.sort((a, b) => a.number - b.number);
    
    return {
      number: surahNumber,
      name: arabicFile.name,
      englishName: translationFile.name,
      versesCount: arabicFile.count,
      verses
    };
  } catch (error) {
    console.error('Error loading surah from local files:', error);
    throw new Error('Failed to load Surah data from local files');
  }
};

/**
 * Searches for surahs by name or number
 * 
 * @param {string} query - Search query
 * @returns {Array} - Array of matching surahs
 */
const searchSurahs = (query) => {
  if (!query) return SURAHS;
  
  const normalizedQuery = query.toLowerCase();
  
  return SURAHS.filter(
    surah => 
      surah.title.toLowerCase().includes(normalizedQuery) ||
      surah.index.includes(normalizedQuery) ||
      surah.titleAr.includes(normalizedQuery)
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.elevated,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.small,
  },
  backButton: {
    padding: theme.spacing.xs,
    width: 40,
  },
  title: {
    flex: 1,
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    padding: theme.spacing.md,
  },
  searchInput: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text.primary,
  },
  surahList: {
    padding: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  surahItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  surahNumberContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.fade,
    padding: theme.spacing.md,
  },
  surahNumber: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  surahDetails: {
    flex: 1,
    padding: theme.spacing.md,
  },
  surahName: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  surahNameArabic: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    fontFamily: Platform.OS === 'ios' ? 'Amiri' : 'Amiri-Regular',
  },
  versesCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.muted,
    marginTop: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.text.secondary,
    fontSize: theme.fontSize.md,
  },
  errorContainer: {
    margin: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.status.error + '10',
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.error,
  },
  errorText: {
    color: theme.colors.status.error,
    fontSize: theme.fontSize.sm,
  },
  versesList: {
    padding: theme.spacing.md,
  },
  verseContainer: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  verseNumberContainer: {
    backgroundColor: theme.colors.primary.fade,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    alignSelf: 'flex-start',
    borderRadius: theme.borderRadius.sm,
    margin: theme.spacing.sm,
  },
  verseNumber: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  verseContent: {
    padding: theme.spacing.md,
  },
  arabicText: {
    fontSize: theme.fontSize.xl,
    lineHeight: rh('5%'),
    textAlign: 'right',
    color: theme.colors.text.primary,
    fontFamily: Platform.OS === 'ios' ? 'Amiri' : 'Amiri-Regular',
    marginBottom: theme.spacing.md,
  },
  translationText: {
    fontSize: theme.fontSize.md,
    lineHeight: rh('3%'),
    color: theme.colors.text.secondary,
  },
});

export default QuranScreen;