import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
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

const DailyTrackerScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([
    // Default prayer tasks (obligatory)
    { id: 1, name: 'Fajr Prayer', type: 'prayer', frequency: 'daily', isDefault: true, isObligatory: true },
    { id: 2, name: 'Dhuhr Prayer', type: 'prayer', frequency: 'daily', isDefault: true, isObligatory: true },
    { id: 3, name: 'Asr Prayer', type: 'prayer', frequency: 'daily', isDefault: true, isObligatory: true },
    { id: 4, name: 'Maghrib Prayer', type: 'prayer', frequency: 'daily', isDefault: true, isObligatory: true },
    { id: 5, name: 'Isha Prayer', type: 'prayer', frequency: 'daily', isDefault: true, isObligatory: true },
    // Default zikr tasks
    { id: 6, name: 'Morning Azkar', type: 'zikr', frequency: 'daily', isDefault: true, isObligatory: false },
    { id: 7, name: 'Evening Azkar', type: 'zikr', frequency: 'daily', isDefault: true, isObligatory: false },
    // Default other tasks
    { id: 8, name: 'Read Quran', type: 'other', frequency: 'daily', isDefault: true, isObligatory: false },
    { id: 9, name: 'Fasting', type: 'other', frequency: 'daily', isDefault: true, isObligatory: false },
  ]);

  const [taskHistory, setTaskHistory] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    type: 'other',
  });

  useEffect(() => {
    loadTasksAndHistory();
  }, []);

  useEffect(() => {
    if (Object.keys(taskHistory).length > 0) {
      saveTasksAndHistory();
    }
  }, [tasks, taskHistory]);

  useEffect(() => {
    cleanupOldData();
  }, []);

  const loadTasksAndHistory = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      const savedHistory = await AsyncStorage.getItem('taskHistory');
      
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
      if (savedHistory) {
        setTaskHistory(JSON.parse(savedHistory));
      } else {
        const today = getDateString();
        const initialHistory = { [today]: {} };
        await AsyncStorage.setItem('taskHistory', JSON.stringify(initialHistory));
        setTaskHistory(initialHistory);
      }
    } catch (error) {
      console.error('Error loading tasks and history:', error);
      const today = getDateString();
      setTaskHistory({ [today]: {} });
    }
  };

  const saveTasksAndHistory = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      await AsyncStorage.setItem('taskHistory', JSON.stringify(taskHistory));
    } catch (error) {
      console.error('Error saving tasks and history:', error);
    }
  };

  const cleanupOldData = () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const cutoffDate = threeMonthsAgo.toISOString().split('T')[0];

    setTaskHistory(prevHistory => {
      const cleanedHistory = { ...prevHistory };
      Object.keys(cleanedHistory).forEach(date => {
        if (date < cutoffDate) {
          delete cleanedHistory[date];
        }
      });
      return cleanedHistory;
    });
  };

  const getDateString = (date = new Date()) => {
    return date.toISOString().split('T')[0];
  };

  const isTaskCompletedToday = (taskId) => {
    const today = getDateString();
    return taskHistory[today] && taskHistory[today][taskId] === true;
  };

  const toggleTask = (taskId) => {
    const today = getDateString();
    const isCurrentlyCompleted = isTaskCompletedToday(taskId);

    setTaskHistory(prevHistory => {
      const newHistory = { ...prevHistory };
      
      if (!newHistory[today]) {
        newHistory[today] = {};
      }

      newHistory[today][taskId] = !isCurrentlyCompleted;

      AsyncStorage.setItem('taskHistory', JSON.stringify(newHistory))
        .catch(error => console.error('Error saving task history:', error));

      return newHistory;
    });
  };

  const addNewTask = () => {
    if (newTask.name.trim()) {
      const newTaskId = Math.max(...tasks.map(t => t.id), 0) + 1;
      
      setTasks(prevTasks => [...prevTasks, {
        id: newTaskId,
        name: newTask.name,
        description: newTask.description,
        frequency: newTask.frequency,
        type: newTask.type,
        isDefault: false,
        isObligatory: false,
      }]);
      
      setModalVisible(false);
      setNewTask({ name: '', description: '', frequency: 'daily', type: 'other' });
    }
  };

  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (taskToDelete && !taskToDelete.isDefault && !taskToDelete.isObligatory) {
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      
      setTaskHistory(prevHistory => {
        const newHistory = { ...prevHistory };
        Object.keys(newHistory).forEach(date => {
          if (newHistory[date][taskId] !== undefined) {
            delete newHistory[date][taskId];
          }
        });
        return newHistory;
      });
    }
  };

  const getTaskStats = (taskId) => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = getDateString(date);
      last30Days.push(dateString);
    }

    const completedDays = last30Days.filter(date => 
      taskHistory[date] && taskHistory[date][taskId] === true
    ).length;

    return {
      completedDays,
      totalDays: 30,
      percentage: Math.round((completedDays / 30) * 100)
    };
  };

  const renderTaskSection = (title, type) => {
    const filteredTasks = tasks.filter(task => task.type === type);
    const colors = COLORS[type];
    
    return (
      <View style={[styles.section, { backgroundColor: colors.bg }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        {filteredTasks.map(task => {
          const stats = getTaskStats(task.id);
          const isCompleted = isTaskCompletedToday(task.id);
          
          return (
            <TouchableOpacity
              key={task.id}
              style={[styles.taskItem, { borderBottomColor: `${colors.accent}20` }]}
              onPress={() => toggleTask(task.id)}
            >
              <Icon
                name={isCompleted ? 'check-circle' : 'radio-button-unchecked'}
                size={iconSize.md}
                color={isCompleted ? colors.accent : colors.text}
              />
              <View style={styles.taskTextContainer}>
                <View style={styles.taskHeaderRow}>
                  <Text style={[
                    styles.taskText,
                    { color: colors.text },
                    isCompleted && styles.completedTask
                  ]}>
                    {task.name}
                  </Text>
                  {!task.isDefault && !task.isObligatory && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteTask(task.id)}
                    >
                      <Icon name="delete" size={iconSize.sm} color="#f44336" />
                    </TouchableOpacity>
                  )}
                </View>
                {task.description && (
                  <Text style={styles.taskDescription}>{task.description}</Text>
                )}
                <Text style={styles.taskStats}>
                  {stats.completedDays}/30 days ({stats.percentage}%)
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, commonStyles.shadow]}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={iconSize.md} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Daily Tracker</Text>
          <Text style={styles.headerDate}>{new Date().toLocaleDateString()}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('TaskHistoryScreen')}
          >
            <Icon name="assessment" size={iconSize.md} color={COLORS.other.accent} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="add" size={iconSize.md} color={COLORS.prayer.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {renderTaskSection('Prayers', 'prayer')}
        {renderTaskSection('Zikr', 'zikr')}
        {renderTaskSection('Other Good Deeds', 'other')}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, commonStyles.shadow]}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Task Name"
              value={newTask.name}
              onChangeText={(text) => setNewTask({...newTask, name: text})}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              multiline
              numberOfLines={3}
              value={newTask.description}
              onChangeText={(text) => setNewTask({...newTask, description: text})}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Type:</Text>
              <View style={styles.typeButtons}>
                {Object.keys(COLORS).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      { backgroundColor: COLORS[type].bg },
                      newTask.type === type && { 
                        borderColor: COLORS[type].accent,
                        borderWidth: rw('0.5%')
                      }
                    ]}
                    onPress={() => setNewTask({...newTask, type})}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      { color: COLORS[type].text }
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Frequency:</Text>
              <View style={styles.frequencyButtons}>
                {['daily', 'weekly', 'monthly'].map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.frequencyButton,
                      { backgroundColor: COLORS[newTask.type].bg },
                      newTask.frequency === freq && { 
                        backgroundColor: COLORS[newTask.type].accent,
                        borderColor: COLORS[newTask.type].accent 
                      }
                    ]}
                    onPress={() => setNewTask({...newTask, frequency: freq})}
                  >
                    <Text style={[
                      styles.frequencyButtonText,
                      newTask.frequency === freq && styles.selectedFrequencyText
                    ]}>
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: COLORS[newTask.type].accent }]}
                onPress={()=>{console.log('Adding new task:', newTask);
                  addNewTask();}}
              >
                <Text style={styles.buttonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  headerDate: {
    fontSize: fontSize.xs,
    color: '#666',
    marginTop: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: rw('0.3%'),
  },
  taskTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  taskHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    fontSize: fontSize.sm,
    flex: 1,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  taskDescription: {
    fontSize: fontSize.xs,
    color: '#666',
    marginTop: spacing.xs,
  },
  taskStats: {
    fontSize: fontSize.xs,
    color: '#888',
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: spacing.md,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: '#333',
  },
  input: {
    borderWidth: rw('0.3%'),
    borderColor: '#ddd',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    fontSize: fontSize.sm,
  },
  textArea: {
    height: rh('15%'),
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: spacing.md,
  },
  pickerLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.xs,
    color: '#333',
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  typeButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: rw('0.3%'),
    borderColor: 'transparent',
    flex: 1,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: fontSize.xs,
  },
  frequencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frequencyButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: rw('0.3%'),
    borderColor: '#ddd',
    flex: 1,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  frequencyButtonText: {
    fontSize: fontSize.xs,
  },
  selectedFrequencyText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
  },
  button: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
    minWidth: rw('25%'),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: fontSize.sm,
  },
});

export default DailyTrackerScreen; 