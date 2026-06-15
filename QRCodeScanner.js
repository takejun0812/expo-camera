import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

// 画面サイズからスキャンエリアとテキストの位置を厳密に計算
const { width, height } = Dimensions.get('window');
const qrSize = width * 0.65; 
const textTopPosition = (height / 2) + (qrSize / 2) + 24; // 枠線のすぐ下に配置

export default function QRCodeScanner({ active = true, onScanSuccess }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (active) {
      setScanned(false);
    }
  }, [active]);

  if (!active) {
    return null;
  }

  if (!permission || !permission.granted) {
    return (
      <View style={styles.centerContainer}>
        {!permission ? (
          <Text style={styles.text}>カメラを起動中...</Text>
        ) : (
          <>
            <Text style={styles.text}>QRコードをスキャンするには、カメラへのアクセス許可が必要です。</Text>
            <Button onPress={requestPermission} title="カメラのアクセスを許可する" />
          </>
        )}
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    
    if (onScanSuccess) {
      onScanSuccess(data);
    }
  };

  return (
    <View style={styles.cameraContainer}>
      {/* 1. カメラ本体 */}
      <CameraView
        style={styles.cameraView}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      {/* 2. 重ねるUIレイヤー（画面サイズに強制固定） */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* 上部の暗転マスク */}
        <View style={styles.maskSpacer} />
        
        {/* 中央の行（左マスク + スキャン枠 + 右マスク） */}
        <View style={styles.centerRow} pointerEvents="box-none">
          <View style={styles.maskSpacer} />
          <View style={styles.focusedContainer}>
            {/* 四隅の案内枠線 */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.maskSpacer} />
        </View>
        
        {/* 下部の暗転マスク */}
        <View style={styles.maskSpacer} />

        {/* テキスト（レイアウト計算を狂わせないよう絶対配置で重ねる） */}
        <Text style={styles.scanInstruction}>枠の中にQRコードをあわせてね</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  cameraView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  centerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 32,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 10,
  },
  maskSpacer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centerRow: {
    flexDirection: 'row',
    height: qrSize,
  },
  focusedContainer: {
    width: qrSize,
    height: qrSize,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  scanInstruction: {
    position: 'absolute',
    top: textTopPosition,
    left: 0,
    right: 0,
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#00FFCC',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});
