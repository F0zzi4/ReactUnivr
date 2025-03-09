export default interface FirebaseObject {
  id: string;
  [key: string]: any;
  timestamp?: number;
}
