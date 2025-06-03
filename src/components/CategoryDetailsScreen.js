import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getDuasByCategory, getDuasBySubcategory } from '../data/duas2';

const DuaItem = ({ dua, index, onPress }) => {
  return (
    <TouchableOpacity style={styles.duaItem} onPress={onPress}>
      <View style={styles.indexContainer}>
        <Text style={styles.indexText}>{index}</Text>
      </View>
      <View style={styles.duaContent}>
        <Text style={styles.duaTitle}>{dua.title}</Text>
        <Text style={styles.duaPreview} numberOfLines={2}>
          {dua.translation}
        </Text>
        <View style={styles.duaTags}>
          {dua.tags && dua.tags.slice(0, 2).map((tag, idx) => (
            <View key={idx} style={styles.tagContainer}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.duaActions}>
        <Icon name="chevron-right" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );
};

const CategoryDetailsScreen = ({ route, navigation }) => {
  const { category, subcategory } = route.params;
  const [activeTab, setActiveTab] = useState('All Duas');
  
  // Get duas for this category or subcategory
  const categoryDuas = subcategory 
    ? getDuasBySubcategory(category.name, subcategory)
    : getDuasByCategory(category.name);
  
  // Filter duas based on active tab
  const filteredDuas = activeTab === 'All Duas' 
    ? categoryDuas 
    : []; // For now, favorites functionality can be added later

  const navigateToDuaDetails = (dua) => {
    navigation.navigate('DuaDetailsScreen', { dua });
  };

  const getSubcategoryIcon = (subcategoryName) => {
    const iconMapping = {
      'Before Prayer': 'schedule',
      'During Prayer': 'timer', 
      'After Prayer': 'check-circle',
      'Morning & Evening': 'wb-sunny',
      'Food & Drink': 'restaurant',
      'Home & Toilet': 'home',
      'Sleep': 'nightlight',
      'Protection': 'shield',
      'Times of Difficulty': 'healing',
      'Forgiveness': 'favorite',
      'Weather': 'cloud',
      'Travel': 'flight',
      'Hajj/Umrah': 'place',
      'Gatherings': 'group',
      'Family': 'family-restroom',
      'Health': 'health-and-safety',
      'Knowledge': 'school',
      'Success': 'star',
      'Thanking Allah': 'thumb-up',
      'Praising Allah': 'auto-awesome',
      'General Gratitude': 'celebration'
    };
    return iconMapping[subcategoryName] || category.icon;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header 
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {subcategory || category.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            {categoryDuas.length} duas available
          </Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="more-vert" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      */}
      {/* Category Info Card */}
      <View style={styles.categoryInfoCard}>
        <View style={[styles.categoryIconLarge, { backgroundColor: category.color + '20' }]}>
          <Icon 
            name={subcategory ? getSubcategoryIcon(subcategory) : category.icon} 
            size={32} 
            color={category.color} 
          />
        </View>
        <View style={styles.categoryInfoText}>
          <Text style={styles.categoryTitle}>
            {subcategory || category.name}
          </Text>
          <Text style={styles.categoryDesc}>
            {subcategory 
              ? `Duas related to ${subcategory.toLowerCase()}` 
              : category.description
            }
          </Text>
          <Text style={styles.categoryStats}>
            {categoryDuas.length} duas available
          </Text>
        </View>
      </View>

      {/* Duas List */}
      {filteredDuas.length > 0 ? (
        <FlatList
          data={filteredDuas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <DuaItem 
              dua={item} 
              index={index + 1}
              onPress={() => navigateToDuaDetails(item)}
            />
          )}
          contentContainerStyle={styles.duasList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="bookmark-border" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>
            No duas found
          </Text>
          <Text style={styles.emptyDescription}>
            {subcategory 
              ? `No duas available for ${subcategory} yet.`
              : 'This category doesn\'t have any duas yet.'
            }
          </Text>
        </View>
      )}
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  backButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
  categoryInfoCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfoText: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  categoryStats: {
    fontSize: 12,
    color: '#888',
  },
  duasList: {
    padding: 16,
    paddingTop: 0,
  },
  duaItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  indexContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indexText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
  duaContent: {
    flex: 1,
  },
  duaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  duaPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  duaTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  duaActions: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CategoryDetailsScreen; 