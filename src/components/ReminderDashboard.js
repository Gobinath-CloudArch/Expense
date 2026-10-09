import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';
import { SchedulerService } from '../services/EnterpriseScheduler';

export default function ReminderDashboard() {
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState(new Date().toISOString());
  const [enableAlarm, setEnableAlarm] = useState(true);

  const handleSave = async () => {
    if (!title) return;
    
    // 1. Trigger Local Native Alarm & Voice
    if (enableAlarm) {
      await SchedulerService.setLocalAlarmAndVoice(title, dateStr);
    }
    
    // 2. Save to Google Sheets Backend
    await SchedulerService.saveReminder(title, dateStr, "General");
    
    setTitle('');
    alert("Reminder Set Successfully!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Schedule & Reminders</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Reminder Title (e.g., Pay Rent)" 
        value={title} 
        onChangeText={setTitle} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Date/Time (YYYY-MM-DDTHH:MM)" 
        value={dateStr} 
        onChangeText={setDateStr} 
      />

      <View style={styles.toggleRow}>
        <Text>Enable Voice & Device Alarm</Text>
        <Switch value={enableAlarm} onValueChange={setEnableAlarm} />
      </View>

      <Button title="Save Schedule" onPress={handleSave} color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', borderRadius: 8, marginVertical: 10 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }
});
