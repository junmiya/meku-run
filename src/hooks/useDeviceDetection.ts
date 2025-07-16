import { useState, useEffect } from 'react';

export type DeviceType = 'smartphone' | 'tablet' | 'desktop';

export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  isPortrait: boolean;
  isLandscape: boolean;
}

export interface DeviceSettings {
  maxCards: number;
  layoutType: 'single-column' | 'grid-6x2' | 'grid-5x10';
  cardSize: 'small' | 'medium' | 'large';
  touchOptimized: boolean;
}

/**
 * デバイス設定の定義
 */
const DEVICE_SETTINGS: Record<DeviceType, DeviceSettings> = {
  smartphone: {
    maxCards: 2,
    layoutType: 'single-column',
    cardSize: 'large',
    touchOptimized: true,
  },
  tablet: {
    maxCards: 12,
    layoutType: 'grid-6x2',
    cardSize: 'medium',
    touchOptimized: true,
  },
  desktop: {
    maxCards: 50,
    layoutType: 'grid-5x10',
    cardSize: 'small',
    touchOptimized: false,
  },
};

/**
 * ブレイクポイント定義
 */
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

/**
 * 画面サイズからデバイスタイプを判定
 */
const getDeviceType = (width: number): DeviceType => {
  if (width < BREAKPOINTS.mobile) {
    return 'smartphone';
  } else if (width < BREAKPOINTS.tablet) {
    return 'tablet';
  } else {
    return 'desktop';
  }
};

/**
 * デバイス情報を取得
 */
const getDeviceInfo = (): DeviceInfo => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const type = getDeviceType(width);
  
  return {
    type,
    isMobile: type === 'smartphone',
    isTablet: type === 'tablet',
    isDesktop: type === 'desktop',
    screenWidth: width,
    screenHeight: height,
    isPortrait: height > width,
    isLandscape: width > height,
  };
};

/**
 * デバイス検出用カスタムフック
 */
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // SSR対応: サーバー側では初期値を設定
    if (typeof window === 'undefined') {
      return {
        type: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 1920,
        screenHeight: 1080,
        isPortrait: false,
        isLandscape: true,
      };
    }
    return getDeviceInfo();
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    const handleOrientationChange = () => {
      // オリエンテーション変更時の遅延を考慮
      setTimeout(() => {
        setDeviceInfo(getDeviceInfo());
      }, 100);
    };

    // リサイズイベントのリスナー
    window.addEventListener('resize', handleResize);
    
    // オリエンテーション変更イベントのリスナー
    window.addEventListener('orientationchange', handleOrientationChange);

    // 初期化時にデバイス情報を更新
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // デバイス設定を取得
  const deviceSettings = DEVICE_SETTINGS[deviceInfo.type];

  // タッチデバイスかどうかを判定
  const isTouchDevice = deviceInfo.isMobile || deviceInfo.isTablet;

  // レスポンシブブレイクポイントの判定
  const isSmallScreen = deviceInfo.screenWidth < BREAKPOINTS.mobile;
  const isMediumScreen = deviceInfo.screenWidth >= BREAKPOINTS.mobile && 
                        deviceInfo.screenWidth < BREAKPOINTS.tablet;
  const isLargeScreen = deviceInfo.screenWidth >= BREAKPOINTS.tablet;

  return {
    ...deviceInfo,
    deviceSettings,
    isTouchDevice,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    breakpoints: BREAKPOINTS,
  };
};

/**
 * 特定のデバイスタイプかどうかを判定するヘルパー関数
 */
export const useIsDevice = (targetDevice: DeviceType): boolean => {
  const { type } = useDeviceDetection();
  return type === targetDevice;
};

/**
 * 画面サイズに応じた値を返すヘルパー関数
 */
export const useResponsiveValue = <T>(values: {
  smartphone: T;
  tablet: T;
  desktop: T;
}): T => {
  const { type } = useDeviceDetection();
  return values[type];
};

/**
 * カード数を取得するヘルパー関数
 */
export const useCardCount = (): number => {
  const { deviceSettings } = useDeviceDetection();
  return deviceSettings.maxCards;
};

/**
 * レイアウトタイプを取得するヘルパー関数
 */
export const useLayoutType = (): DeviceSettings['layoutType'] => {
  const { deviceSettings } = useDeviceDetection();
  return deviceSettings.layoutType;
};

export default useDeviceDetection;