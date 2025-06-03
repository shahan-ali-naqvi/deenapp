import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const LAST_UPDATE_KEY = '@last_content_update';
const CACHED_CONTENT_KEY = '@cached_islamic_content';

// Free APIs
const QURAN_API = 'https://api.alquran.cloud/v1/ayah/random/editions/quran-uthmani,en.asad';
const FREE_HADITH_API = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari/hadiths.json';

// Islamic dates and events mapping
const ISLAMIC_EVENTS = {
  '1-1': { name: 'Islamic New Year', theme: 'hijri' },
  '1-10': { name: 'Day of Ashura', theme: 'karbala' },
  '3-12': { name: 'Rabi ul Awal', theme: 'prophet' },
  '7-27': { name: 'Laylat al-Miraj', theme: 'miraj' },
  '8-15': { name: 'Shaban', theme: 'forgiveness' },
  '9-1': { name: 'Ramadan', theme: 'fasting' },
  '9-27': { name: 'Laylat al-Qadr', theme: 'qadr' },
  '10-1': { name: 'Eid ul-Fitr', theme: 'eid' },
  '12-10': { name: 'Eid ul-Adha', theme: 'sacrifice' },
  '12-8': { name: 'Day of Arafah', theme: 'hajj' }
};

// Cached hadiths for different themes
const THEMED_HADITHS = {
  default: [
    {
      text: "The Messenger of Allah ﷺ said: 'The best among you are those who learn the Quran and teach it.'",
      reference: "Sahih al-Bukhari 5027"
    },
    {
      text: "The Prophet ﷺ said: 'None of you truly believes until he loves for his brother what he loves for himself.'",
      reference: "Sahih al-Bukhari 13"
    }
  ],
  eid: [
    {
      text: "The Prophet ﷺ said: 'There are two occasions of joy for a fasting person: when he breaks his fast and when he meets his Lord.'",
      reference: "Sahih al-Bukhari 1985"
    },
    {
      text: "The Prophet ﷺ would not go out on the day of Eid-ul-Fitr until he had eaten some dates, and he would eat an odd number.",
      reference: "Sahih al-Bukhari 953"
    }
  ],
  ramadan: [
    {
      text: "The Prophet ﷺ said: 'Whoever fasts during Ramadan out of sincere faith and hoping to attain Allah's rewards, then all his past sins will be forgiven.'",
      reference: "Sahih al-Bukhari 38"
    }
  ],
  // Add more themed hadiths as needed
};

const getIslamicDate = () => {
  // Using Hijri date calculation
  const today = new Date();
  const islamicDate = new Intl.DateTimeFormat('en-u-ca-islamic', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }).format(today);

  const [_, month, day] = islamicDate.split('/');
  return `${parseInt(month)}-${parseInt(day)}`;
};

const getThemeForDate = () => {
  const islamicDate = getIslamicDate();
  return ISLAMIC_EVENTS[islamicDate]?.theme || 'default';
};

const getThemedHadith = (theme) => {
  const hadiths = THEMED_HADITHS[theme] || THEMED_HADITHS.default;
  const randomIndex = Math.floor(Math.random() * hadiths.length);
  return hadiths[randomIndex];
};

const shouldUpdateContent = async () => {
  try {
    const lastUpdate = await AsyncStorage.getItem(LAST_UPDATE_KEY);
    if (!lastUpdate) return true;

    const lastUpdateDate = new Date(lastUpdate);
    const currentDate = new Date();
    
    return (
      lastUpdateDate.getDate() !== currentDate.getDate() ||
      lastUpdateDate.getMonth() !== currentDate.getMonth() ||
      lastUpdateDate.getFullYear() !== currentDate.getFullYear()
    );
  } catch {
    return true;
  }
};

const fetchQuranVerse = async () => {
  try {
    const response = await fetch(QURAN_API);
    const data = await response.json();
    
    if (data.code === 200) {
      return {
        arabic: data.data[0].text,
        english: data.data[1].text,
        reference: `Surah ${data.data[0].surah.englishName} (${data.data[0].surah.number}:${data.data[0].numberInSurah})`
      };
    }
    throw new Error('Failed to fetch Quran verse');
  } catch (error) {
    console.error('Error fetching Quran verse:', error);
    return {
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      english: "In the name of Allah, the Most Gracious, the Most Merciful",
      reference: "Al-Fatihah 1:1"
    };
  }
};

export const fetchDailyContent = async () => {
  try {
    // Check if we need to update
    const needsUpdate = await shouldUpdateContent();
    if (!needsUpdate) {
      const cached = await AsyncStorage.getItem(CACHED_CONTENT_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    // Get current theme based on Islamic date
    const theme = getThemeForDate();
    
    // Get themed hadith
    const hadith = getThemedHadith(theme);
    
    // Fetch Quran verse
    const verse = await fetchQuranVerse();

    // Get current Islamic event if any
    const islamicDate = getIslamicDate();
    const currentEvent = ISLAMIC_EVENTS[islamicDate];

    const content = {
      quran: verse,
      hadith,
      islamicDate,
      event: currentEvent?.name,
      lastUpdated: new Date().toISOString()
    };

    // Cache the content
    await AsyncStorage.setItem(CACHED_CONTENT_KEY, JSON.stringify(content));
    await AsyncStorage.setItem(LAST_UPDATE_KEY, new Date().toISOString());

    return content;
  } catch (error) {
    console.error('Error in fetchDailyContent:', error);
    // Return cached content as fallback
    const cached = await AsyncStorage.getItem(CACHED_CONTENT_KEY);
    return cached ? JSON.parse(cached) : {
      quran: {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        english: "In the name of Allah, the Most Gracious, the Most Merciful",
        reference: "Al-Fatihah 1:1"
      },
      hadith: THEMED_HADITHS.default[0],
      islamicDate: getIslamicDate()
    };
  }
}; 