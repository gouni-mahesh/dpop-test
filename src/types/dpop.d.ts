export interface ApiResponseString {
  hotelIds?: { [key: string]: string };
  mobileNumber?: string;
  userId?: string;
  avootaStatus?: 'SUCCESS' | 'FAILURE';
  avootaFailureMsg?: string;
  avootaFailureCode?: string;
  response?: string;
}
export interface SignupRequest {
  mobileNumber?: string;
  emailId?: string;
  deviceToken?: string;
}