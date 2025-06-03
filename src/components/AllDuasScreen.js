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
import { categories } from '../data/duas2';

const AllDuasScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>All Duas</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>
        */}
      {/* Section Header 
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Dua Categories</Text>
        <Text style={styles.sectionSubtitle}>
          {categories.length} categories available
        </Text>
      </View>
      */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {/* All Duas Categories */}
        <View style={styles.allDuasContainer}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryItem}
              onPress={() => navigation.navigate('SubcategoryScreen', { category })}
            >
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <Icon name={category.icon} size={24} color={category.color} />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                  <Text style={styles.subCategoriesText}>
                    {category.subCategories.length} sub-categories
                  </Text>
                </View>
              </View>
              <View style={styles.duaCountContainer}>
                <Text style={[styles.duaCount, { color: category.color }]}>{category.duaCount}</Text>
                <Text style={styles.duaText}>Duas</Text>
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
  searchButton: {
    padding: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  allDuasContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  subCategoriesText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  duaCountContainer: {
    alignItems: 'center',
  },
  duaCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  duaText: {
    fontSize: 12,
    color: '#777',
  },
});

export default AllDuasScreen; 