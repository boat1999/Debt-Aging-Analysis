export interface SessionConfig {
  apiUrl: string;
  apiAuthKey: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  fullname: string;
  hospital_name: string;
}

export interface BmsUserInfoRaw {
  name?: string;
  position?: string;
  position_id?: number;
  hospital_code?: string;
  doctor_code?: string;
  department?: string;
  location?: string;
  is_hr_admin?: boolean;
  is_director?: boolean;
  bms_url?: string;
  bms_session_port?: number;
  bms_session_code?: string;
  bms_database_name?: string;
  bms_database_type?: string;
}

export interface SessionValidationResponse {
  MessageCode: number;
  Message: string;
  RequestTime?: string;
  result?: {
    system_info?: {
      version?: string;
      environment?: string;
    };
    user_info?: BmsUserInfoRaw;
    key_value?: string;
    auth_key?: string;
    expired_second?: number;
  };
}
