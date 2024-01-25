import * as SecureStore from "expo-secure-store";

async function save(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key: string): Promise<string | null> {
  let result = await SecureStore.getItemAsync(key);
  return result;
}

async function saveData(key: string, value: any): Promise<void> {
  await SecureStore.setItemAsync(key, JSON.stringify(value));
}

async function getData(key: string): Promise<any> {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return JSON.parse(result);
  }
  return null;
}

export { save, getValueFor, saveData, getData };
