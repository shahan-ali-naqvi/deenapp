import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme';
import { rw, rh } from '../utils/responsive';

const ruqiyahData = {
  introduction: {
    title: 'What is Ruqiyah?',
    description: 'Ruqiyah is a form of spiritual healing in Islam that involves recitation of Quranic verses and authentic duas. It is a Sunnah practice used for spiritual, physical, and psychological healing.',
  },
  quranicVerses: [
    {
      id: 1,
      title: 'Surah Al-Isra, Verse 81-82',
      arabic: 'وَقُلْ جَآءَ ٱلْحَقُّ وَزَهَقَ ٱلْبَـٰطِلُ ۚ إِنَّ ٱلْبَـٰطِلَ كَانَ زَهُوقًا\nوَنُنَزِّلُ مِنَ ٱلْقُرْءَانِ مَا هُوَ شِفَآءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ ۙ وَلَا يَزِيدُ ٱلظَّـٰلِمِينَ إِلَّا خَسَارً',
      translation: 'And say, "Truth has come, and falsehood has departed. Indeed, falsehood is bound to depart."\nAnd We send down of the Quran that which is healing and mercy for the believers, but it does not increase the wrongdoers except in loss.',
      benefits: 'These verses affirm the power of the Quran as a source of healing and mercy for believers.',
    },
    {
      id: 2,
      title: 'Ayat Al-Kursi (2:255)',
      arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      translation: 'Allah - there is no deity except Him, the Ever-Living, the Self-Sustaining. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
      benefits: 'One of the most powerful verses for protection and healing, recommended to be recited for spiritual protection.',
    },
    {
      id: 3,
      title: 'Al-Muawwidhat',
      surahFalaq: {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾',
        translation: 'Say, "I seek refuge in the Lord of daybreak From the evil of that which He created And from the evil of darkness when it settles And from the evil of the blowers in knots And from the evil of an envier when he envies."',
      },
      surahNas: {
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾',
        translation: 'Say, "I seek refuge in the Lord of mankind, The Sovereign of mankind, The God of mankind, From the evil of the retreating whisperer - Who whispers [evil] into the breasts of mankind - From among the jinn and mankind."',
      },
      benefits: 'These surahs are specifically mentioned in hadith for protection and healing from evil eye and magic.',
    },
  ],
  methods: [
    {
      id: 1,
      title: 'Proper Method of Ruqiyah',
      steps: [
        'Ensure ritual purity (wudu) before starting',
        'Choose a clean, quiet place',
        'Begin with sincere intention (niyyah)',
        'Recite Quran with clear pronunciation',
        'Blow gently after recitation (if self-treating)',
        'Have complete faith in Allah\'s healing power',
      ],
    },
    {
      id: 2,
      title: 'Important Guidelines',
      points: [
        'Only use authenticated Quranic verses and duas',
        'Avoid mixing with un-Islamic practices',
        'Never charge money for Ruqiyah',
        'Maintain proper Islamic etiquette',
        'Seek medical treatment alongside Ruqiyah',
      ],
    },
  ],
  hadithReferences: [
    {
      id: 1,
      title: 'Sahih Al-Bukhari',
      reference: '5735',
      text: 'Aisha (RA) reported: When the Prophet ﷺ was ill, he would recite the Muawwidhat and blow over himself.',
    },
    {
      id: 2,
      title: 'Sahih Muslim',
      reference: '2186',
      text: 'There is no harm in Ruqyah as long as it does not involve shirk (polytheism).',
    },
  ],
  scholarlyAdvice: {
    title: 'Advice from Islamic Scholars',
    points: [
      'Imam Ibn Taymiyyah emphasized that Ruqiyah must be from Quran and authentic duas only',
      'Imam Al-Nawawi mentioned the permissibility of self-ruqiyah',
      'Contemporary scholars stress the importance of combining medical treatment with Ruqiyah',
    ],
  },
};

const RuqiyahScreen = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const renderSection = (title, content) => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setExpandedSection(expandedSection === title ? null : title)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Icon
          name={expandedSection === title ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={rw('6%')}
          color={theme.colors.primary.main}
        />
      </TouchableOpacity>
      {expandedSection === title && (
        <View style={styles.sectionContent}>
          {content}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={theme.layout.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ruqiyah</Text>
          <Text style={styles.headerSubtitle}>{ruqiyahData.introduction.description}</Text>
        </View>

        {renderSection('Quranic Verses', (
          <View>
            {ruqiyahData.quranicVerses.map(verse => (
              <View key={verse.id} style={styles.verseContainer}>
                <Text style={styles.verseTitle}>{verse.title}</Text>
                {verse.arabic && (
                  <>
                    <Text style={styles.arabicText}>{verse.arabic}</Text>
                    <Text style={styles.translationText}>{verse.translation}</Text>
                  </>
                )}
                {verse.surahFalaq && (
                  <View style={styles.surahContainer}>
                    <Text style={styles.surahTitle}>Surah Al-Falaq</Text>
                    <Text style={styles.arabicText}>{verse.surahFalaq.arabic}</Text>
                    <Text style={styles.translationText}>{verse.surahFalaq.translation}</Text>
                  </View>
                )}
                {verse.surahNas && (
                  <View style={styles.surahContainer}>
                    <Text style={styles.surahTitle}>Surah An-Nas</Text>
                    <Text style={styles.arabicText}>{verse.surahNas.arabic}</Text>
                    <Text style={styles.translationText}>{verse.surahNas.translation}</Text>
                  </View>
                )}
                <Text style={styles.benefitsText}>{verse.benefits}</Text>
              </View>
            ))}
          </View>
        ))}

        {renderSection('Method & Guidelines', (
          <View>
            {ruqiyahData.methods.map(method => (
              <View key={method.id} style={styles.methodContainer}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                {method.steps && method.steps.map((step, index) => (
                  <Text key={index} style={styles.stepText}>• {step}</Text>
                ))}
                {method.points && method.points.map((point, index) => (
                  <Text key={index} style={styles.stepText}>• {point}</Text>
                ))}
              </View>
            ))}
          </View>
        ))}

        {renderSection('Hadith References', (
          <View>
            {ruqiyahData.hadithReferences.map(hadith => (
              <View key={hadith.id} style={styles.hadithContainer}>
                <Text style={styles.hadithTitle}>{hadith.title} ({hadith.reference})</Text>
                <Text style={styles.hadithText}>{hadith.text}</Text>
              </View>
            ))}
          </View>
        ))}

        {renderSection('Scholarly Advice', (
          <View style={styles.scholarlyContainer}>
            {ruqiyahData.scholarlyAdvice.points.map((point, index) => (
              <Text key={index} style={styles.scholarlyText}>• {point}</Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    ...theme.layout.header,
  },
  headerTitle: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: rh('2.8%'),
  },
  section: {
    marginVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.elevated,
    ...theme.patterns.borders.medium,
    borderWidth: 0,
    borderLeftWidth: 4,
  },
  sectionTitle: {
    ...theme.typography.h3,
  },
  sectionContent: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  verseContainer: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary.fade,
    borderRadius: theme.borderRadius.sm,
  },
  verseTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
  },
  arabicText: {
    ...theme.typography.arabic.large,
    marginVertical: theme.spacing.md,
  },
  translationText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
    lineHeight: rh('2.8%'),
  },
  benefitsText: {
    ...theme.typography.body2,
    marginTop: theme.spacing.sm,
  },
  methodContainer: {
    marginBottom: theme.spacing.md,
  },
  methodTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
  },
  stepText: {
    ...theme.typography.body1,
    marginBottom: theme.spacing.xs,
    paddingLeft: theme.spacing.sm,
    lineHeight: rh('2.5%'),
  },
  hadithContainer: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary.fade,
    borderRadius: theme.borderRadius.sm,
  },
  hadithTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.xs,
  },
  hadithText: {
    ...theme.typography.body1,
    fontStyle: 'italic',
    lineHeight: rh('2.5%'),
  },
  scholarlyContainer: {
    padding: theme.spacing.sm,
  },
  scholarlyText: {
    ...theme.typography.body1,
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.sm,
    lineHeight: rh('2.5%'),
  },
  surahContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.medium,
  },
  surahTitle: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
});

export default RuqiyahScreen; 