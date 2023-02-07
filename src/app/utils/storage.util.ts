export class StorageUtil {
  //save trainer to storage
  public static storageSave<T>(key: string, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  //Clear storage on logout
  public static storageClear<T>(key: string): void {
    sessionStorage.removeItem(key);
  }

  //Read trainer from storage
  public static storageRead<T>(key: string): T | undefined {
    const storedValue = sessionStorage.getItem(key);
    try {
      if (storedValue) {
        return JSON.parse(storedValue) as T;
      }
      return undefined;
    } catch (e) {
      // Remove item if failed (ie. item is invalid)
      sessionStorage.removeItem(key);
      return undefined;
    }
  }
}
