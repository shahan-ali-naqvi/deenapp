import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  rw,
  rh,
  fontSize,
  spacing,
  borderRadius,
  iconSize,
  commonStyles
} from '../utils/responsive';

const islamicData = {
  pillarsOfIslam: [
    {
      id: 1,
      title: 'Shahadah',
      description: 'Declaration of faith in Allah and His messenger Muhammad (ﷺ)',
      details: 'The Shahadah is declaring that there is no god worthy of worship except Allah and that Muhammad (ﷺ) is His messenger. This is the foundation of Islam and must be declared with sincere belief.',
    },
    {
      id: 2,
      title: 'Salah',
      description: 'Five daily prayers',
      details: 'Prayer Times:\n1. Fajr - Dawn, before sunrise\n2. Dhuhr - After noon\n3. Asr - Late afternoon\n4. Maghrib - After sunset\n5. Isha - Night\n\nBasic Steps of Prayer:\n1. Perform Wudu (ablution)\n2. Face the Qibla\n3. Make intention (Niyyah)\n4. Say "Allahu Akbar" and begin prayer\n5. Follow the prescribed movements and recitations',
    },
    {
      id: 3,
      title: 'Zakat',
      description: 'Giving a portion of wealth to those in need',
      details: 'Zakat is giving 2.5% of your saved wealth annually to those in need. It\'s mandatory when your wealth reaches the nisab threshold and has been in your possession for one lunar year.',
    },
    {
      id: 4,
      title: 'Sawm',
      description: 'Fasting during Ramadan',
      details: 'Fasting from dawn to sunset during the month of Ramadan. This includes abstaining from food, drink, and other physical needs. It teaches self-discipline, self-control, sacrifice, and empathy.',
    },
    {
      id: 5,
      title: 'Hajj',
      description: 'Pilgrimage to Makkah',
      details: 'The pilgrimage to Makkah is required once in a lifetime for those who are physically and financially able. It occurs in the month of Dhul Hijjah and involves specific rituals.',
    },
  ],
  imanMufassal: {
    title: 'Iman-e-Mufassal',
    arabic: 'آمَنْتُ بِاللهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الْاٰخِرِ وَالْقَدْرِ خَيْرِهِ وَشَرِّهِ مِنَ اللهِ تَعَالٰى وَالْبَعْثِ بَعْدَ الْمَوْتِ',
    translation: 'I believe in Allah, His Angels, His Books, His Messengers, the Last Day, and in Fate, that all good and bad is from Allah Taala, and in the resurrection after death.',
    explanation: 'This is the detailed declaration of faith that outlines the six articles of faith in Islam.',
  },
  imanMujmal: {
    title: 'Iman-e-Mujmal',
    arabic: 'آمَنْتُ بِاللهِ كَمَا هُوَ بِاَسْمَآئِهِ وَصِفَاتِهِ وَقَبِلْتُ جَمِيْعَ اَحْكَامِهِ وَاَرْكَانِهِ',
    translation: 'I believe in Allah as He is with all His names and attributes, and I accept all His commands.',
    explanation: 'This is the brief declaration of faith that encompasses all aspects of belief in a concise form.',
  },
  aboutIslam: {
    title: 'About Islam',
    description: 'Islam is a monotheistic religion that teaches peace, submission to Allah, and following the teachings of Prophet Muhammad (ﷺ). It emphasizes the unity of God, moral living, and preparing for the afterlife.',
  },
  prophetMuhammad: {
    title: 'Prophet Muhammad (ﷺ)',
    description: 'Prophet Muhammad (ﷺ) was born in Makkah in 570 CE. He received his first revelation at age 40 and spent 23 years spreading the message of Islam. His life exemplifies perfect moral character and serves as a model for all humanity.',
    keyEvents: [
      'Born in the Year of the Elephant (570 CE)',
      'Received first revelation in Cave Hira (610 CE)',
      'Migration to Madinah (Hijra) (622 CE)',
      'Conquest of Makkah (630 CE)',
      
    ],
  },
};

const KnowledgeScreen = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const renderDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        setSelectedItem(null);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setModalVisible(false);
              setSelectedItem(null);
            }}
          >
            <Icon name="close" size={iconSize.md} color="#333" />
          </TouchableOpacity>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
            <Text style={styles.modalDescription}>{selectedItem?.details || selectedItem?.description}</Text>
            {selectedItem?.keyEvents && (
              <View style={styles.keyEventsContainer}>
                <Text style={styles.subTitle}>Key Events:</Text>
                {selectedItem.keyEvents.map((event, index) => (
                  <Text key={index} style={styles.eventItem}>• {event}</Text>
                ))}
              </View>
            )}
            {selectedItem?.arabic && (
              <View style={styles.arabicContainer}>
                <Text style={styles.arabicText}>{selectedItem.arabic}</Text>
                <Text style={styles.translationText}>{selectedItem.translation}</Text>
                <Text style={styles.explanationText}>{selectedItem.explanation}</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderSection = (title, items, type = 'grid') => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {type === 'grid' ? (
        <View style={styles.grid}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridItem}
              onPress={() => {
                setSelectedItem(item);
                setModalVisible(true);
              }}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            setSelectedItem(items);
            setModalVisible(true);
          }}
        >
          <Text style={styles.cardTitle}>{items.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={3}>
            {items.description || items.translation}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderSection('About Islam', islamicData.aboutIslam, 'card')}
        {renderSection('Pillars of Islam', islamicData.pillarsOfIslam)}
        {renderSection('Prophet Muhammad (ﷺ)', islamicData.prophetMuhammad, 'card')}
        {renderSection('Iman-e-Mufassal', islamicData.imanMufassal, 'card')}
        {renderSection('Iman-e-Mujmal', islamicData.imanMujmal, 'card')}
      </ScrollView>
      {renderDetailModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: rw('44%'),
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    ...commonStyles.shadow,
  },
  itemTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: spacing.xs,
  },
  itemDescription: {
    fontSize: fontSize.sm,
    color: '#546E7A',
    lineHeight: rh('2.2%'),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    ...commonStyles.shadow,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontSize: fontSize.sm,
    color: '#546E7A',
    lineHeight: rh('2.2%'),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: rw('90%'),
    maxHeight: rh('80%'),
    borderTopWidth: 6,
    borderTopColor: '#4CAF50',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: spacing.xs,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: fontSize.md,
    color: '#37474F',
    lineHeight: rh('3%'),
  },
  keyEventsContainer: {
    marginTop: spacing.lg,
    backgroundColor: '#E8F5E9',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  subTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: spacing.sm,
  },
  eventItem: {
    fontSize: fontSize.sm,
    color: '#37474F',
    marginBottom: spacing.xs,
    paddingLeft: spacing.sm,
  },
  arabicContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  arabicText: {
    fontSize: fontSize.xl,
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: rh('4%'),
  },
  translationText: {
    fontSize: fontSize.md,
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontStyle: 'italic',
    lineHeight: rh('2.8%'),
  },
  explanationText: {
    fontSize: fontSize.sm,
    color: '#37474F',
    textAlign: 'center',
    lineHeight: rh('2.5%'),
  },
});

export default KnowledgeScreen; 