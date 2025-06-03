import { Platform } from 'react-native';
import { rw, rh } from '../utils/responsive';

export const colors = {
  // Primary Colors
  primary: {
    main: '#2E8B57',      // Islamic Green
    light: '#81C784',     // Light Green
    fade: '#E8F5E9',      // Very Light Green
    dark: '#1B4D3E',      // Dark Green
  },

  // Text Colors
  text: {
    primary: '#333333',    // Dark Gray for primary text
    secondary: '#666666',  // Medium Gray for secondary text
    muted: '#999999',     // Light Gray for muted text
    light: '#FFFFFF',     // White text
  },

  // Background Colors
  background: {
    main: '#FFFFFF',      // Pure White
    elevated: '#FFFFFF',   // White for cards
    muted: '#F5F5F5',     // Light Gray
    light: '#FAFAFA',     // Very Light Gray
  },

  // Status Colors
  status: {
    success: '#4CAF50',   // Green for completed tasks
    warning: '#FFA000',   // Amber for pending
    error: '#D32F2F',     // Red for errors/incomplete
    info: '#1976D2',      // Blue for information
  },

  // Grade Colors
  grade: {
    A: '#4CAF50',         // Green
    B: '#8BC34A',         // Light Green
    C: '#FFC107',         // Amber
    D: '#FF9800',         // Orange
    F: '#F44336',         // Red
  },

  // Prayer Colors
  prayer: {
    time: '#81C784',      // Light Green for prayer times
    current: '#388E3C',   // Darker Green for current prayer
    missed: '#D32F2F',    // Red for missed prayers
  },

  // UI Element Colors
  border: '#E0E0E0',      // Light Gray for borders
  divider: '#F0F0F0',     // Lighter Gray for dividers
};

export const spacing = {
  xs: rw('2%'),    // 8
  sm: rw('3%'),    // 12
  md: rw('4%'),    // 16
  lg: rw('6%'),    // 24
  xl: rw('8%'),    // 32
};

export const fontSize = {
  xs: rh('1.5%'),  // 12
  sm: rh('1.75%'), // 14
  md: rh('2%'),    // 16
  lg: rh('2.5%'),  // 20
  xl: rh('3%'),    // 24
};

export const borderRadius = {
  xs: rw('1%'),    // 4
  sm: rw('2%'),    // 8
  md: rw('3%'),    // 12
  lg: rw('4%'),    // 16
  xl: rw('5%'),    // 20
  circle: 9999,
};

export const typography = {
  h1: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text.primary,
  },
  h2: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
  },
  h3: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  body1: {
    fontSize: fontSize.sm,
    fontWeight: '400',
    color: colors.text.primary,
  },
  body2: {
    fontSize: fontSize.xs,
    fontWeight: '400',
    color: colors.text.secondary,
  },
  caption: {
    fontSize: fontSize.xs,
    fontWeight: '400',
    color: colors.text.muted,
  },
  button: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text.primary,
  },
  arabic: {
    regular: {
      fontSize: fontSize.lg,
      lineHeight: rh('4%'),
      color: colors.text.primary,
      fontFamily: Platform.OS === 'ios' ? 'Amiri' : 'Amiri-Regular',
    },
    large: {
      fontSize: fontSize.xl,
      lineHeight: rh('5%'),
      color: colors.text.primary,
      fontFamily: Platform.OS === 'ios' ? 'Amiri' : 'Amiri-Regular',
    },
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
};

export const layout = {
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  header: {
    backgroundColor: colors.background.elevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  card: {
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.medium,
  },
  section: {
    marginVertical: spacing.md,
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.small,
  },
};

export const patterns = {
  gradients: {
    primary: [colors.primary.fade, colors.primary.light, colors.primary.main],
  },
  borders: {
    subtle: {
      borderWidth: 1,
      borderColor: colors.border,
    },
    medium: {
      borderWidth: 2,
      borderColor: colors.primary.main,
    },
    strong: {
      borderWidth: 3,
      borderColor: colors.primary.dark,
    },
  },
};

export default {
  colors,
  spacing,
  fontSize,
  borderRadius,
  typography,
  shadows,
  layout,
  patterns,
}; 