export const colors = {
  // Primary Colors
  primary: '#2E8B57',      // Islamic Green
  secondary: '#1B4D3E',    // Darker Green
  accent: '#C3A136',       // Golden

  // Background Colors
  background: '#FFFFFF',    // Pure White
  surfaceLight: '#F5F5F5', // Light Gray
  surfaceMedium: '#E8E8E8',// Medium Gray

  // Text Colors
  textPrimary: '#333333',  // Dark Gray for primary text
  textSecondary: '#666666',// Medium Gray for secondary text
  textLight: '#FFFFFF',    // White text

  // Status Colors
  success: '#4CAF50',      // Green for completed tasks
  warning: '#FFA000',      // Amber for pending
  error: '#D32F2F',        // Red for errors/incomplete
  info: '#1976D2',         // Blue for information

  // Grade Colors
  gradeA: '#4CAF50',       // Green
  gradeB: '#8BC34A',       // Light Green
  gradeC: '#FFC107',       // Amber
  gradeD: '#FF9800',       // Orange
  gradeF: '#F44336',       // Red

  // UI Element Colors
  border: '#E0E0E0',       // Light Gray for borders
  shadow: 'rgba(0, 0, 0, 0.1)', // Shadow color
  overlay: 'rgba(0, 0, 0, 0.5)', // Overlay color
  
  // Interactive Colors
  buttonPrimary: '#2E8B57',
  buttonSecondary: '#1B4D3E',
  buttonDisabled: '#CCCCCC',
  
  // Prayer Times Colors
  prayerTime: '#81C784',   // Light Green for prayer times
  currentPrayer: '#388E3C', // Darker Green for current prayer
  
  // Statistics Colors
  statsPositive: '#4CAF50',
  statsNeutral: '#FFA000',
  statsNegative: '#D32F2F',
};

// Opacity variants
export const getColorWithOpacity = (color, opacity) => {
  // Convert hex to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Theme configuration
export const theme = {
  colors,
  getColorWithOpacity,
};

export default theme; 