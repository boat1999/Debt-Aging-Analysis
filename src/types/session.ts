export interface SessionConfig {
  apiUrl: string;
  apiAuthKey: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  fullname: string;
  hospital_name: string;
}

export interface SessionValidationResponse {
  MessageCode: number;
  Message: string;
  result?: {
    key_value?: Record<string, string> | string;
    user_info?: Record<string, string>;
    expired_second?: number;
    auth_key?: string;
  };
}
