import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_ASYNC_KEY = '@ignitefleet:last_sync'

export async function saveLastSyncTimestamp() {
  try {
    const timestamp = new Date().getTime()
    await AsyncStorage.setItem(STORAGE_ASYNC_KEY, timestamp.toString())

    return timestamp
  } catch (error) {
    console.log(error)
  }
}

export async function getLastAsyncTimestamp() {
  try {
    const response = await AsyncStorage.getItem(STORAGE_ASYNC_KEY)
    return Number(response)
  } catch (error) {
    console.log(error)
  }
}
