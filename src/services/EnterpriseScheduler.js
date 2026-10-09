import * as Notifications from 'expo-notifications';
import * as Speech from 'expo-speech';
import * as Device from 'expo-device';

// Points to your EXISTING Google Apps Script URL
const GAS_URL = "YOUR_EXISTING_WEB_APP_URL"; 
const MODULE_ID = "enterprise_scheduler";

export const SchedulerService = {
  // 1. Voice & Local Alarms (No cloud required)
  setLocalAlarmAndVoice: async (title, dateTimeStr) => {
    const triggerDate = new Date(dateTimeStr);
    
    // Voice Announcement
    Speech.speak(`New reminder scheduled: ${title}`, { rate: 0.9 });
    
    // Offline Native Device Alarm
    await Notifications.scheduleNotificationAsync({
      content: { title: "⏰ Reminder", body: title, sound: true },
      trigger: triggerDate,
    });
  },

  // 2. Save Reminder to DB
  saveReminder: async (title, dateTime, type) => {
    await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        module: MODULE_ID,
        action: "addReminder",
        title, dateTime, type
      })
    });
  },

  // 3. Register Device for Push (Call this quietly after user logs in)
  registerForPush: async () => {
    if (!Device.isDevice) return;
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;
    
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ module: MODULE_ID, action: "registerDevice", token })
    });
  },

  // 4. Trigger Cross-User Notification (Inject this into your existing Expense save function)
  notifyNewExpense: async (amount, user) => {
    await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ 
        module: MODULE_ID, 
        action: "notifyExpense", 
        message: `${user} added a transaction of ${amount}` 
      })
    });
  }
};
