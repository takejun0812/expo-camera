import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import QRCodeScanner from './QRCodeScanner'; // 修正版コンポーネント

export default function App() {
  const [isActive, setIsActive] = useState(true);
  const [scanResult, setScanResult] = useState(null); // 'success' | 'already_scanned' | null
  const [scannedData, setScannedData] = useState(null);
  
  // 読み込んだQRコードの履歴を保持する配列
  const [scannedHistory, setScannedHistory] = useState([]);

  const handleScanSuccess = (data) => {
    // 連続読み込みを防ぐため、一度カメラを非アクティブにする
    setIsActive(false);

    if (scannedHistory.includes(data)) {
      // 1. すでに履歴にある（既読）場合
      setScanResult('already_scanned');
      setScannedData(data);

      // アラートを出し、OKが押されたら自動でカメラに戻す
      Alert.alert(
        'お知らせ',
        'このQRコードはすでに取得されています。',
        [{ text: 'OK', onPress: () => resetScanner() }]
      );
    } else {
      // 2. 履歴にない（新規）場合
      setScannedHistory([...scannedHistory, data]); // 履歴に追加
      setScanResult('success');
      setScannedData(data);
    }
  };

  // スキャン状態をリセットしてカメラを再起動
  const resetScanner = () => {
    setScanResult(null);
    setScannedData(null);
    setIsActive(true);
  };

  return (
    <View style={styles.container}>
      {isActive && !scanResult ? (
        // スキャン画面
        <QRCodeScanner active={isActive} onScanSuccess={handleScanSuccess} />
      ) : (
        // 結果表示画面（条件分岐）
        <View style={styles.resultContainer}>
          {scanResult === 'success' && (
            <>
              <Text style={styles.emoji}>🎉</Text>
              <Text style={styles.titleSuccess}>ポイントゲット！</Text>
              <Text style={styles.dataText}>コード: {scannedData}</Text>
              <Button title="次のスキャンへ" onPress={resetScanner} color="#4CAF50" />
            </>
          )}

          {scanResult === 'already_scanned' && (
            <>
              <Text style={styles.emoji}>⚠️</Text>
              <Text style={styles.titleError}>すでに取得されています</Text>
              <Text style={styles.dataText}>コード: {scannedData}</Text>
              <Button title="もう一度スキャンする" onPress={resetScanner} color="#FF5252" />
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  titleSuccess: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  titleError: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF5252',
    marginBottom: 10,
  },
  dataText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
});
