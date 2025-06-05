// src/utils/userSessionDebug.js - Helper untuk debug user session & streak

// ⭐ MAIN DEBUG: Comprehensive user session analysis
export function debugUserSession() {
    console.log('🧪 === COMPREHENSIVE USER SESSION DEBUG ===');
    
    // 1. Current user data
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    console.log('👤 Current User:', currentUser);
    
    if (!currentUser) {
      console.log('❌ No current user logged in');
      return;
    }
    
    // 2. User ID consistency check
    const userId = currentUser.id || currentUser.nama;
    console.log('🔍 User ID used for streak:', userId);
    
    // 3. Streak data analysis
    const userStreakKey = `streakData_${userId}`;
    const streakData = localStorage.getItem(userStreakKey);
    
    console.log('🔥 Streak Key:', userStreakKey);
    console.log('🔥 Streak Data:', streakData);
    
    if (streakData) {
      const parsed = JSON.parse(streakData);
      
      // 4. Days calculation
      const today = new Date().toDateString();
      const daysDiff = calculateDaysDifference(parsed.lastLoginDate, today);
      
      console.log('📊 STREAK ANALYSIS:');
      console.log('   Last Login:', parsed.lastLoginDate);
      console.log('   Today:', today);
      console.log('   Days Difference:', daysDiff);
      console.log('   Current Streak:', parsed.streakCount);
      console.log('   Status:', getStreakStatus(daysDiff));
      console.log('   Expected Streak:', getExpectedStreak(parsed.streakCount, daysDiff));
      
      // 5. Validation
      validateStreakLogic(parsed, daysDiff);
    } else {
      console.log('❌ No streak data found for user');
    }
    
    // 6. All users streak summary
    showAllUsersStreak();
    
    // 7. Recommendations
    provideRecommendations(currentUser, streakData);
  }
  
  // ⭐ HELPER: Calculate days difference
  function calculateDaysDifference(lastLoginDateStr, todayStr) {
    try {
      const lastLogin = new Date(lastLoginDateStr);
      const today = new Date(todayStr);
      
      lastLogin.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const timeDifference = today.getTime() - lastLogin.getTime();
      return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('❌ Error calculating days difference:', error);
      return 999;
    }
  }
  
  // ⭐ HELPER: Get streak status
  function getStreakStatus(daysDiff) {
    if (daysDiff === 0) return 'SAME DAY';
    if (daysDiff === 1) return 'CONSECUTIVE';
    if (daysDiff > 1) return 'GAP DETECTED';
    return 'INVALID';
  }
  
  // ⭐ HELPER: Get expected streak
  function getExpectedStreak(currentStreak, daysDiff) {
    if (daysDiff === 0) return currentStreak; // Same day
    if (daysDiff === 1) return currentStreak + 1; // Consecutive
    if (daysDiff > 1) return 1; // Reset
    return 1;
  }
  
  // ⭐ HELPER: Validate streak logic
  function validateStreakLogic(streakData, daysDiff) {
    const expectedStreak = getExpectedStreak(streakData.streakCount, daysDiff);
    
    console.log('✅ VALIDATION:');
    console.log('   Current Streak in Data:', streakData.streakCount);
    console.log('   Expected Streak:', expectedStreak);
    
    if (daysDiff > 1 && streakData.streakCount > 1) {
      console.log('⚠️ WARNING: Gap detected but streak not reset!');
      console.log('💡 RECOMMENDATION: Should be reset to 1');
    } else if (daysDiff === 1 && streakData.lastLoginDate !== new Date().toDateString()) {
      console.log('💡 INFO: Consecutive login - streak should increment');
    } else {
      console.log('✅ Streak logic appears correct');
    }
  }
  
  // ⭐ HELPER: Show all users streak
  function showAllUsersStreak() {
    console.log('📊 ALL USERS STREAK SUMMARY:');
    
    const allKeys = Object.keys(localStorage);
    const streakKeys = allKeys.filter(key => key.startsWith('streakData_'));
    
    if (streakKeys.length === 0) {
      console.log('   No streak data found');
      return;
    }
    
    streakKeys.forEach(key => {
      try {
        const userId = key.replace('streakData_', '');
        const data = JSON.parse(localStorage.getItem(key));
        const daysDiff = calculateDaysDifference(data.lastLoginDate, new Date().toDateString());
        
        console.log(`   👤 ${userId}:`);
        console.log(`      Streak: ${data.streakCount}`);
        console.log(`      Last Login: ${data.lastLoginDate}`);
        console.log(`      Days Ago: ${daysDiff}`);
        console.log(`      Status: ${getStreakStatus(daysDiff)}`);
        console.log(`      Should Be: ${getExpectedStreak(data.streakCount, daysDiff)}`);
        console.log('');
      } catch (error) {
        console.error(`   ❌ Error parsing ${key}:`, error);
      }
    });
  }
  
  // ⭐ HELPER: Provide recommendations
  function provideRecommendations(currentUser, streakData) {
    console.log('💡 RECOMMENDATIONS:');
    
    if (!currentUser) {
      console.log('   - User not logged in, redirect to login');
      return;
    }
    
    if (!streakData) {
      console.log('   - Initialize streak data for current user');
      console.log('   - Run: initializeUserStreak()');
      return;
    }
    
    const parsed = JSON.parse(streakData);
    const daysDiff = calculateDaysDifference(parsed.lastLoginDate, new Date().toDateString());
    
    if (daysDiff > 1 && parsed.streakCount > 1) {
      console.log('   - ⚠️ URGENT: Reset streak to 1 due to gap');
      console.log('   - Run: resetUserStreak()');
    } else if (daysDiff === 1) {
      console.log('   - ✅ Increment streak for consecutive login');
      console.log('   - Run: incrementUserStreak()');
    } else {
      console.log('   - ✅ Streak data looks correct');
    }
  }
  
  // ⭐ QUICK FIX: Initialize user streak
  export function initializeUserStreak(userId = null) {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!currentUser && !userId) {
      console.log('❌ No user ID provided');
      return;
    }
    
    const targetUserId = userId || currentUser.id || currentUser.nama;
    const today = new Date().toDateString();
    const userStreakKey = `streakData_${targetUserId}`;
    
    const streakData = {
      lastLoginDate: today,
      streakCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: 'DebugHelper_Initialize'
    };
    
    localStorage.setItem(userStreakKey, JSON.stringify(streakData));
    console.log('✅ User streak initialized:', userStreakKey, streakData);
  }
  
  // ⭐ QUICK FIX: Reset user streak
  export function resetUserStreak(userId = null) {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!currentUser && !userId) {
      console.log('❌ No user ID provided');
      return;
    }
    
    const targetUserId = userId || currentUser.id || currentUser.nama;
    const today = new Date().toDateString();
    const userStreakKey = `streakData_${targetUserId}`;
    
    const existingData = localStorage.getItem(userStreakKey);
    const parsed = existingData ? JSON.parse(existingData) : {};
    
    const streakData = {
      ...parsed,
      lastLoginDate: today,
      streakCount: 1,
      updatedAt: new Date().toISOString(),
      updatedBy: 'DebugHelper_Reset',
      resetReason: 'gap_detected'
    };
    
    localStorage.setItem(userStreakKey, JSON.stringify(streakData));
    console.log('🔄 User streak reset:', userStreakKey, streakData);
  }
  
  // ⭐ QUICK FIX: Increment user streak
  export function incrementUserStreak(userId = null) {
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!currentUser && !userId) {
      console.log('❌ No user ID provided');
      return;
    }
    
    const targetUserId = userId || currentUser.id || currentUser.nama;
    const today = new Date().toDateString();
    const userStreakKey = `streakData_${targetUserId}`;
    
    const existingData = localStorage.getItem(userStreakKey);
    if (!existingData) {
      console.log('❌ No existing streak data to increment');
      initializeUserStreak(targetUserId);
      return;
    }
    
    const parsed = JSON.parse(existingData);
    const newStreakCount = parsed.streakCount + 1;
    
    const streakData = {
      ...parsed,
      lastLoginDate: today,
      streakCount: newStreakCount,
      updatedAt: new Date().toISOString(),
      updatedBy: 'DebugHelper_Increment'
    };
    
    localStorage.setItem(userStreakKey, JSON.stringify(streakData));
    console.log('🔥 User streak incremented:', userStreakKey, streakData);
  }
  
  // ⭐ SIMULATION: Test different scenarios
  export function simulateUserScenario(scenario) {
    console.log(`🧪 SIMULATING SCENARIO: ${scenario}`);
    
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!currentUser) {
      console.log('❌ No current user for simulation');
      return;
    }
    
    const userId = currentUser.id || currentUser.nama;
    
    switch (scenario) {
      case 'consecutive':
        simulateConsecutiveLogin(userId);
        break;
      case 'gap_2_days':
        simulateGapLogin(userId, 2);
        break;
      case 'gap_week':
        simulateGapLogin(userId, 7);
        break;
      case 'same_day':
        simulateSameDayLogin(userId);
        break;
      default:
        console.log('❌ Unknown scenario. Available: consecutive, gap_2_days, gap_week, same_day');
    }
  }
  
  // ⭐ SIMULATION HELPERS
  function simulateConsecutiveLogin(userId) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const streakData = {
      lastLoginDate: yesterday.toDateString(),
      streakCount: 5,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Simulation_Consecutive'
    };
    
    localStorage.setItem(`streakData_${userId}`, JSON.stringify(streakData));
    console.log('✅ Simulated consecutive login scenario');
    console.log('Expected: Streak should become 6 on next login');
  }
  
  function simulateGapLogin(userId, daysGap) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - daysGap);
    
    const streakData = {
      lastLoginDate: pastDate.toDateString(),
      streakCount: 10,
      updatedAt: new Date().toISOString(),
      updatedBy: `Simulation_Gap_${daysGap}_Days`
    };
    
    localStorage.setItem(`streakData_${userId}`, JSON.stringify(streakData));
    console.log(`✅ Simulated ${daysGap} days gap scenario`);
    console.log('Expected: Streak should reset to 1 on next login');
  }
  
  function simulateSameDayLogin(userId) {
    const today = new Date().toDateString();
    
    const streakData = {
      lastLoginDate: today,
      streakCount: 7,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Simulation_SameDay'
    };
    
    localStorage.setItem(`streakData_${userId}`, JSON.stringify(streakData));
    console.log('✅ Simulated same day login scenario');
    console.log('Expected: Streak should remain 7');
  }
  
  // ⭐ CLEANUP: Remove all streak data
  export function cleanupAllStreakData() {
    const allKeys = Object.keys(localStorage);
    const streakKeys = allKeys.filter(key => key.startsWith('streakData_'));
    
    console.log(`🧹 Cleaning up ${streakKeys.length} streak entries...`);
    
    streakKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`   ✅ Removed ${key}`);
    });
    
    console.log('🧹 All streak data cleaned up');
  }
  
  // ⭐ EXPORT untuk browser console
  if (typeof window !== 'undefined') {
    window.userSessionDebug = {
      debugUserSession,
      initializeUserStreak,
      resetUserStreak,
      incrementUserStreak,
      simulateUserScenario,
      cleanupAllStreakData
    };
    
    console.log('🔧 User Session Debug Helper loaded!');
    console.log('Available functions:');
    console.log('   - window.userSessionDebug.debugUserSession()');
    console.log('   - window.userSessionDebug.resetUserStreak()');
    console.log('   - window.userSessionDebug.incrementUserStreak()');
    console.log('   - window.userSessionDebug.simulateUserScenario("consecutive")');
    console.log('   - window.userSessionDebug.cleanupAllStreakData()');
  }