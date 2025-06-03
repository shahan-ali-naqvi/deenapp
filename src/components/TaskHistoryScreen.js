import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { rw, rh, fontSize, spacing, borderRadius, iconSize, commonStyles } from '../utils/responsive';

const COLORS = {
  prayer: {
    bg: '#e8f5e9',
    accent: '#4CAF50',
    text: '#2e7d32',
  },
  zikr: {
    bg: '#e3f2fd',
    accent: '#2196F3',
    text: '#1565c0',
  },
  other: {
    bg: '#fff3e0',
    accent: '#FF9800',
    text: '#ef6c00',
  },
};

const TaskHistoryScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [taskHistory, setTaskHistory] = useState({});
  const [reportPeriod, setReportPeriod] = useState('week');
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && Object.keys(taskHistory).length > 0) {
      generateAndSetReport();
    }
  }, [reportPeriod, tasks, taskHistory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const savedTasks = await AsyncStorage.getItem('tasks');
      const savedHistory = await AsyncStorage.getItem('taskHistory');
      
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
        console.log('Loaded tasks:', parsedTasks);
      }
      
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setTaskHistory(parsedHistory);
        console.log('Loaded history:', parsedHistory);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAndSetReport = () => {
    console.log('Generating report for period:', reportPeriod);
    const report = generateReport(reportPeriod);
    console.log('Generated report:', report);
    setCurrentReport(report);
  };

  const getDateString = (date = new Date()) => {
    return date.toISOString().split('T')[0];
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: '#4CAF50' };
    if (percentage >= 80) return { grade: 'A', color: '#8BC34A' };
    if (percentage >= 70) return { grade: 'B+', color: '#FFC107' };
    if (percentage >= 60) return { grade: 'B', color: '#FF9800' };
    if (percentage >= 50) return { grade: 'C', color: '#FF5722' };
    return { grade: 'F', color: '#f44336' };
  };

  const generateReport = (period) => {
    const today = new Date();
    let startDate = new Date(today);
    let days = 0;

    // Calculate date range based on period
    switch (period) {
      case 'week':
        startDate.setDate(today.getDate() - 6);
        days = 7;
        break;
      case 'month':
        startDate.setDate(today.getDate() - 29);
        days = 30;
        break;
      case 'all':
        const allDates = Object.keys(taskHistory).sort();
        if (allDates.length > 0) {
          startDate = new Date(allDates[0]);
          days = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
        } else {
          startDate.setDate(today.getDate() - 29);
          days = 30;
        }
        break;
    }

    // Generate array of dates in the range
    const dateRange = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dateRange.push(getDateString(date));
    }

    // Calculate task completion for each task
    const taskReports = tasks.map(task => {
      const completedDays = dateRange.reduce((count, date) => {
        return count + (taskHistory[date]?.[task.id] === true ? 1 : 0);
      }, 0);

      const percentage = Math.round((completedDays / days) * 100);

      return {
        ...task,
        completedDays,
        totalDays: days,
        percentage,
        grade: getGrade(percentage)
      };
    });

    // Calculate overall stats
    const overallStats = {
      totalTasks: tasks.length,
      completedTasks: taskReports.reduce((sum, task) => sum + task.completedDays, 0),
      possibleTasks: taskReports.reduce((sum, task) => sum + task.totalDays, 0),
      typeStats: {}
    };

    // Calculate stats by type
    ['prayer', 'zikr', 'other'].forEach(type => {
      const typeTasks = taskReports.filter(task => task.type === type);
      const typeCompletions = typeTasks.reduce((sum, task) => sum + task.completedDays, 0);
      const typePossible = typeTasks.reduce((sum, task) => sum + task.totalDays, 0);
      
      overallStats.typeStats[type] = {
        tasks: typeTasks.length,
        completions: typeCompletions,
        possible: typePossible,
        percentage: typePossible > 0 ? Math.round((typeCompletions / typePossible) * 100) : 0
      };
    });

    // Calculate overall percentage
    overallStats.overallPercentage = overallStats.possibleTasks > 0
      ? Math.round((overallStats.completedTasks / overallStats.possibleTasks) * 100)
      : 0;
    overallStats.grade = getGrade(overallStats.overallPercentage);

    return {
      period,
      startDate: getDateString(startDate),
      endDate: getDateString(today),
      totalDays: days,
      hasData: true,
      tasks: taskReports,
      overallStats
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, commonStyles.shadow]}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={iconSize.md} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Task History</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, commonStyles.shadow]}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={iconSize.md} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task History</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['week', 'month', 'all'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                reportPeriod === period && styles.selectedPeriodButton
              ]}
              onPress={() => {
                console.log('Period selected:', period);
                setReportPeriod(period);
              }}
            >
              <Text style={[
                styles.periodButtonText,
                reportPeriod === period && styles.selectedPeriodText
              ]}>
                {period === 'week' ? 'Last 7 Days' : 
                 period === 'month' ? 'Last 30 Days' : 'All Time'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {currentReport && (
          <>
            {/* Overall Performance Card */}
            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>Overall Performance</Text>
              <View style={styles.overallStats}>
                <View style={styles.gradeContainer}>
                  <Text style={[styles.gradeText, { color: currentReport.overallStats.grade.color }]}>
                    {currentReport.overallStats.grade.grade}
                  </Text>
                  <Text style={styles.percentageText}>
                    {currentReport.overallStats.overallPercentage}%
                  </Text>
                </View>
                <View style={styles.statsDetails}>
                  <Text style={styles.reportPeriodText}>
                    {currentReport.startDate} to {currentReport.endDate}
                  </Text>
                  <Text style={styles.daysText}>
                    {currentReport.totalDays} days tracked
                  </Text>
                </View>
              </View>
            </View>

            {/* Category Performance Card */}
            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>Category Performance</Text>
              {Object.entries(currentReport.overallStats.typeStats).map(([type, stats]) => (
                <View key={type} style={styles.typeStatRow}>
                  <View style={[styles.typeIndicator, { backgroundColor: COLORS[type].accent }]} />
                  <View style={styles.typeStatContent}>
                    <Text style={styles.typeStatTitle}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                    <Text style={styles.typeStatText}>
                      {stats.completions}/{stats.possible} completed ({stats.percentage}%)
                    </Text>
                  </View>
                  <Text style={[styles.typeStatGrade, { color: getGrade(stats.percentage).color }]}>
                    {getGrade(stats.percentage).grade}
                  </Text>
                </View>
              ))}
            </View>

            {/* Individual Tasks Card */}
            <View style={styles.reportCard}>
              <Text style={styles.reportTitle}>Individual Tasks</Text>
              {currentReport.tasks.map(task => (
                <View key={task.id} style={styles.taskReportRow}>
                  <View style={styles.taskReportHeader}>
                    <Text style={styles.taskReportName}>{task.name}</Text>
                    <View style={styles.taskReportGrade}>
                      <Text style={[styles.taskGradeText, { color: task.grade.color }]}>
                        {task.grade.grade}
                      </Text>
                      <Text style={styles.taskPercentageText}>
                        {task.percentage}%
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.taskReportStats}>
                    {task.completedDays}/{task.totalDays} days completed
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <View style={[
                      styles.progressBar,
                      { 
                        width: `${task.percentage}%`,
                        backgroundColor: task.grade.color
                      }
                    ]} />
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#fff',
  },
  headerButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  headerRight: {
    width: iconSize.md + spacing.sm * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.md,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    elevation: 2,
  },
  periodButton: {
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    flex: 1,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  selectedPeriodButton: {
    backgroundColor: '#4CAF50',
  },
  periodButtonText: {
    fontSize: fontSize.sm,
    color: '#333',
    fontWeight: '500',
  },
  selectedPeriodText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
  },
  reportTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: '#333',
  },
  overallStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeText: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    marginRight: spacing.sm,
  },
  percentageText: {
    fontSize: fontSize.lg,
    color: '#666',
    fontWeight: '600',
  },
  statsDetails: {
    alignItems: 'flex-end',
  },
  reportPeriodText: {
    fontSize: fontSize.sm,
    color: '#666',
    marginBottom: spacing.xs,
  },
  daysText: {
    fontSize: fontSize.sm,
    color: '#888',
  },
  typeStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  typeIndicator: {
    width: rw('4%'),
    height: rw('4%'),
    borderRadius: rw('2%'),
    marginRight: spacing.md,
  },
  typeStatContent: {
    flex: 1,
  },
  typeStatTitle: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: '#333',
  },
  typeStatText: {
    fontSize: fontSize.sm,
    color: '#666',
    marginTop: spacing.xs,
  },
  typeStatGrade: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  taskReportRow: {
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskReportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  taskReportName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    flex: 1,
    color: '#333',
  },
  taskReportGrade: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskGradeText: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    marginRight: spacing.xs,
  },
  taskPercentageText: {
    fontSize: fontSize.sm,
    color: '#666',
  },
  taskReportStats: {
    fontSize: fontSize.sm,
    color: '#888',
    marginBottom: spacing.sm,
  },
  progressBarContainer: {
    width: '100%',
    height: rh('1.2%'),
    backgroundColor: '#e0e0e0',
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
});

export default TaskHistoryScreen; 