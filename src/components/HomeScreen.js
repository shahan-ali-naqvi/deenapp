import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  Modal,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import { rw, rh } from '../utils/responsive';
import { fetchDailyContent } from '../services/islamicContentService';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - (theme.spacing.md * 2);

const HomeScreen = ( props ) => {
  const [dailyContent, setDailyContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const features = [
    { 
      id: 1, 
      name: 'Qibla Direction', 
      icon: 'explore', 
      color: theme.colors.primary.fade,
      screen: 'QiblaScreen' 
    },
    { 
      id: 2, 
      name: 'Prayer Times', 
      icon: 'schedule', 
      color: theme.colors.background.muted,
      screen: 'PrayerTimesScreen' 
    },
    { 
      id: 3, 
      name: 'Quran', 
      icon: 'menu-book', 
      color: theme.colors.primary.fade,
      screen: 'QuranScreen' 
    },
    { 
      id: 4, 
      name: 'Daily Tracker', 
      icon: 'check-circle', 
      color: theme.colors.background.muted,
      screen: 'DailyTrackerScreen' 
    },
    { 
      id: 5, 
      name: 'Knowledge', 
      icon: 'school', 
      color: theme.colors.primary.fade,
      screen: 'KnowledgeScreen' 
    },
    { 
      id: 6, 
      name: 'Ruqiyah', 
      icon: 'healing', 
      color: theme.colors.background.muted,
      screen: 'RuqiyahScreen' 
    },
    { 
      id: 7, 
      name: 'Duas', 
      icon: 'auto-stories', 
      color: theme.colors.primary.fade,
      screen: 'AllDuasScreen' 
    },
    { 
      id: 8, 
      name: 'Donate', 
      icon: 'card-giftcard', 
      color: theme.colors.background.muted
    },
  ];

  const loadDailyContent = async () => {
    try {
      setLoading(true);
      const content = await fetchDailyContent();
      setDailyContent(content);
    } catch (error) {
      console.error('Error loading daily content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDailyContent();
  }, []);

  const showContentModal = (type) => {
    setSelectedContent(type);
    setModalVisible(true);
  };

  const renderContentModal = () => {
    if (!selectedContent || !dailyContent) return null;

    const isQuran = selectedContent === 'quran';
    const content = isQuran ? dailyContent.quran : dailyContent.hadith;
    const title = isQuran ? 'Daily Verse' : 'Daily Hadith';

  return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.modalTextContainer}>
                <Text style={styles.arabicTextLarge}>
                  {isQuran ? content.arabic : ''}
                </Text>
                <Text style={styles.translationText}>
                  {isQuran ? content.english : content.text}
                </Text>
                <Text style={styles.referenceText}>
                  {content.reference}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderDailyVerse = () => {
    if (!dailyContent?.quran) return null;

    return (
          <TouchableOpacity 
        style={styles.verseCard}
        onPress={() => showContentModal('quran')}
        activeOpacity={0.8}
          >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <View style={styles.cardIconContainer}>
              <Icon name="menu-book" size={20} color={theme.colors.primary.main} />
            </View>
            <Text style={styles.cardTitle}>Daily Verse</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.arabicText} numberOfLines={1}>
            {dailyContent.quran.arabic}
          </Text>
          <Text style={styles.verseReference}>
            {dailyContent.quran.reference}
              </Text>
            </View>
          </TouchableOpacity>
    );
  };

  const renderDailyHadith = () => {
    if (!dailyContent?.hadith) return null;

    return (
      <TouchableOpacity 
        style={styles.hadithCard}
        onPress={() => showContentModal('hadith')}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <View style={styles.cardIconContainer}>
              <Icon name="format-quote" size={20} color={theme.colors.primary.main} />
            </View>
            <Text style={styles.cardTitle}>Daily Hadith</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.hadithText} numberOfLines={1}>
            {dailyContent.hadith.text}
          </Text>
          <Text style={styles.hadithReference}>
            {dailyContent.hadith.reference}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFeatures = () => {
    return (
        <View style={styles.featuresContainer}>
          {features.map((feature) => (
            <TouchableOpacity 
              key={feature.id} 
            style={styles.featureButton}
              onPress={() => feature.screen ? props.navigation.navigate(feature.screen) : null}
            >
            <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
              <Icon name={feature.icon} size={24} color={theme.colors.primary.main} />
            </View>
            <Text style={styles.featureText}>{feature.name}</Text>
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor={theme.colors.background.main}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {renderDailyVerse()}
          {renderDailyHadith()}
          {renderFeatures()}
        </View>
      </ScrollView>
      {renderContentModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  content: {
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
  },
      android: {
        elevation: 3,
  },
    }),
  },
  hadithCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#40A9FF',
  },
  cardBody: {
    marginLeft: 40,
  },
  arabicText: {
    fontSize: 18,
    lineHeight: 32,
    textAlign: 'right',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
  },
  hadithText: {
    fontSize: 14,
    lineHeight: 24,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  verseReference: {
    fontSize: 12,
    color: theme.colors.text.muted,
    textAlign: 'right',
  },
  hadithReference: {
    fontSize: 12,
    color: theme.colors.text.muted,
    textAlign: 'right',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
  featureButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background.muted,
  },
  featureText: {
    fontSize: 12,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    maxHeight: '80%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#40A9FF',
  },
  modalBody: {
    padding: theme.spacing.lg,
  },
  modalTextContainer: {
    paddingBottom: theme.spacing.lg,
  },
  arabicTextLarge: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'right',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  referenceText: {
    fontSize: 12,
    color: theme.colors.text.muted,
    textAlign: 'right',
  },
});

export default HomeScreen; 