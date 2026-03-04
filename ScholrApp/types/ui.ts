export interface SettingCardProps {
  icon: any;
  title: string;
  children: any;
}

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
}

export interface ErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export interface InfoToastProps {
  message: string;
  visible: boolean;
}

export interface LoaderProps {
  children?: string;
}

export interface ProfileDetailsProps {
  userData: any;
  isError: boolean;
  error: any;
}

export interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
