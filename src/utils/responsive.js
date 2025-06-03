import { Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

// Responsive width and height percentages
export const rw = (widthPercent) => {
  const elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return width * (elemWidth / 100);
};

export const rh = (heightPercent) => {
  const elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
  return height * (elemHeight / 100);
};

// Font scaling
const scale = width / 375; // Base width of 375 for scaling

export const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(newSize);
};

// Font scaling
export const fontSize = {
  xs: wp('3%'),
  sm: wp('3.5%'),
  md: wp('4%'),
  lg: wp('4.5%'),
  xl: wp('5%'),
  xxl: wp('6%'),
};

// Spacing scaling
export const spacing = {
  xs: wp('2%'),
  sm: wp('3%'),
  md: wp('4%'),
  lg: wp('5%'),
  xl: wp('6%'),
  xxl: wp('8%'),
};

// Border radius scaling
export const borderRadius = {
  xs: wp('1%'),
  sm: wp('2%'),
  md: wp('3%'),
  lg: wp('4%'),
  xl: wp('5%'),
  round: wp('50%'),
};

// Icon scaling
export const iconSize = {
  xs: normalize(16),
  sm: normalize(20),
  md: normalize(24),
  lg: normalize(32),
  xl: normalize(40),
};

// Device size helpers
export const layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
  isTablet: width >= 768,
};

// Common responsive styles
export const commonStyles = {
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}; 