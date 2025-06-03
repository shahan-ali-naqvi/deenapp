import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DuaDetailsScreen from '../components/DuaDetailsScreen';  
import DuaAndZikrScreen from '../components/HomeScreen';
import AllDuasScreen from '../components/AllDuasScreen';
import SubcategoryScreen from '../components/SubcategoryScreen';
import CategoryDetailsScreen from '../components/CategoryDetailsScreen';
import PrayerTimesScreen from '../components/PrayerTimesScreen';
import QiblaScreen from '../components/QiblaScreen';
import QuranScreen from '../components/QuranScreen';
import DailyTrackerScreen from '../components/DailyTrackerScreen';
import TaskHistoryScreen from '../components/TaskHistoryScreen';
import KnowledgeScreen from '../components/KnowledgeScreen';
import RuqiyahScreen from '../components/RuqiyahScreen';
const StackNavigation = () => {
  const Stack = createNativeStackNavigator();
   // const Stack=createStackNavigator();
  return (
    <View style={{ flex: 1 }}>

      <NavigationContainer>
        <Stack.Navigator initialRouteName="DuaAndZikrScreen">
          
          <Stack.Screen options={{headerShown: false}} name="DuaAndZikrScreen" component={DuaAndZikrScreen} />
          <Stack.Screen options={{headerShown: false}} name="AllDuasScreen" component={AllDuasScreen} />
          <Stack.Screen options={{headerShown: false}} name="SubcategoryScreen" component={SubcategoryScreen} />
          <Stack.Screen options={{headerShown: false}} name="CategoryDetailsScreen" component={CategoryDetailsScreen} />
          <Stack.Screen options={{headerShown: false}} name="DuaDetailsScreen" component={DuaDetailsScreen} />
          <Stack.Screen options={{headerShown: false}} name="PrayerTimesScreen" component={PrayerTimesScreen} />
          <Stack.Screen options={{headerShown: false}} name="QiblaScreen" component={QiblaScreen} />
          <Stack.Screen options={{headerShown: false}} name="QuranScreen" component={QuranScreen} />
          <Stack.Screen options={{headerShown: false}} name="DailyTrackerScreen" component={DailyTrackerScreen} />
          <Stack.Screen options={{headerShown: false}} name="TaskHistoryScreen" component={TaskHistoryScreen} />
          <Stack.Screen options={{headerShown: false}} name="KnowledgeScreen" component={KnowledgeScreen} />
          <Stack.Screen options={{headerShown: false}} name="RuqiyahScreen" component={RuqiyahScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  )
}

export default StackNavigation;