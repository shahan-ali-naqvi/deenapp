import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SubcategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;

  const navigateToSubcategoryDuas = (subcategory) => {
    navigation.navigate('CategoryDetailsScreen', { 
      category,
      subcategory: subcategory
    });
  };

  const getSubcategoryIcon = (subcategoryName) => {
    const iconMapping = {
      // Prayer Related
      'Before Prayer': 'schedule',
      'During Prayer': 'timer',
      'After Prayer': 'check-circle',
      
      // Daily Activities
      'Morning & Evening': 'wb-sunny',
      'Food & Drink': 'restaurant',
      'Home & Toilet': 'home',
      'Sleep': 'nightlight',
      
      // Protection & Relief
      'Protection': 'shield',
      'Times of Difficulty': 'healing',
      'Forgiveness': 'favorite',
      
      // Special Occasions
      'Weather': 'cloud',
      'Travel': 'flight',
      'Hajj/Umrah': 'place',
      'Gatherings': 'group',
      
      // Personal Supplications
      'Family': 'family-restroom',
      'Health': 'health-and-safety',
      'Knowledge': 'school',
      'Success': 'star',
      
      // Gratitude & Praise
      'Thanking Allah': 'thumb-up',
      'Praising Allah': 'auto-awesome',
      'General Gratitude': 'celebration'
    };
    
    return iconMapping[subcategoryName] || 'bookmark';
  };

  const getSubcategoryColor = (index) => {
    const colors = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#607D8B', '#E91E63'];
    return colors[index % colors.length];
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
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={styles.placeholder} />
      </View>
      */}
      {/* Category Info */}
      <View style={styles.categoryInfo}>
        <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
          <Icon name={category.icon} size={32} color={category.color} />
        </View>
        <View style={styles.categoryTextInfo}>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
          <Text style={styles.subcategoryCount}>
            {category.subCategories.length} subcategories • {category.duaCount} total duas
          </Text>
        </View>
      </View>

      {/* Subcategories List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Select Subcategory</Text>
        <Text style={styles.sectionSubtitle}>Choose a specific area to explore duas</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.subcategoriesContainer}>
          {category.subCategories.map((subcategory, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.subcategoryItem}
              onPress={() => navigateToSubcategoryDuas(subcategory)}
            >
              <View style={styles.subcategoryLeft}>
                <View style={[
                  styles.subcategoryIcon, 
                  { backgroundColor: getSubcategoryColor(index) + '20' }
                ]}>
                  <Icon 
                    name={getSubcategoryIcon(subcategory)} 
                    size={24} 
                    color={getSubcategoryColor(index)} 
                  />
                </View>
                <View style={styles.subcategoryInfo}>
                  <Text style={styles.subcategoryName}>{subcategory}</Text>
                  <Text style={styles.subcategoryDescription}>
                    Duas related to {subcategory.toLowerCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.chevronContainer}>
                <Icon name="chevron-right" size={24} color="#ccc" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  categoryInfo: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryTextInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  subcategoryCount: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  subcategoriesContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  subcategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subcategoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subcategoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subcategoryInfo: {
    flex: 1,
  },
  subcategoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subcategoryDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  chevronContainer: {
    padding: 8,
  },
});

export default SubcategoryScreen; 