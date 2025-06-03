import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Share 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const defaultDua = {
  title: 'When wearing new clothes',
  arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِي كَسَانِي هَذَا (الثَّوْبَ) وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
  translation: 'Praise be to Allah who has clothed me with this (garment) and provided it for me, with no power or might from myself.',
  reference: 'Abu Saed Al-Khudri',
  transliteration: 'Alhamdu lillahil-lathee kasanee hatha (aththawb) warazaqaneehi min ghayri hawlin minnee wala quwwatin',
  category: 'Clothing',
  tags: ['Masnoon', 'Dress']
};

const DuaDetailsScreen = ({ route, navigation }) => {
  const dua = route.params?.dua || defaultDua;

  const shareDua = async () => {
    try {
      const shareText = `${dua.title}\n\n${dua.arabic}\n\nTranslation: ${dua.translation}\n\nReference: ${dua.reference}`;
      await Share.share({
        message: shareText,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const copyToClipboard = () => {
    // Copy functionality can be implemented here
    console.log('Copy to clipboard');
  };

  return (
    <SafeAreaView style={styles.container}>
   {/*   <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dua Details</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="more-vert" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      */}

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.duaCard}>
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{dua.category}</Text>
          </View>

          {/* Title */}
          <Text style={styles.duaTitle}>{dua.title}</Text>
          
          {/* Arabic Text */}
          <View style={styles.arabicContainer}>
            <Text style={styles.arabicText}>{dua.arabic}</Text>
          </View>
          
          {/* Transliteration (if available) */}
          {dua.transliteration && (
            <View style={styles.transliterationContainer}>
              <Text style={styles.sectionTitle}>Transliteration</Text>
              <Text style={styles.transliterationText}>{dua.transliteration}</Text>
            </View>
          )}
          
          {/* Translation */}
          <View style={styles.translationContainer}>
            <Text style={styles.sectionTitle}>Translation</Text>
            <Text style={styles.translationText}>{dua.translation}</Text>
          </View>
          
          {/* Reference */}
          <View style={styles.referenceContainer}>
            <Text style={styles.sectionTitle}>Reference</Text>
            <Text style={styles.referenceText}>{dua.reference}</Text>
          </View>

          {/* Tags */}
          {dua.tags && dua.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsWrapper}>
                {dua.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons 
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="play-arrow" size={24} color="#4CAF50" />
          <Text style={styles.actionText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="favorite-border" size={24} color="#4CAF50" />
          <Text style={styles.actionText}>Favorite</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={shareDua}
        >
          <Icon name="share" size={24} color="#4CAF50" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={copyToClipboard}
        >
          <Icon name="content-copy" size={24} color="#4CAF50" />
          <Text style={styles.actionText}>Copy</Text>
        </TouchableOpacity>
      </View>
      */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
  contentContainer: {
    padding: 16,
  },
  duaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  duaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  arabicContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderLeft: 4,
    borderLeftColor: '#4CAF50',
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'right',
    fontWeight: '500',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
  },
  transliterationContainer: {
    marginBottom: 20,
  },
  transliterationText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#555',
    fontStyle: 'italic',
  },
  translationContainer: {
    marginBottom: 20,
  },
  translationText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
  },
  referenceContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  referenceText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
    fontStyle: 'italic',
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default DuaDetailsScreen; 