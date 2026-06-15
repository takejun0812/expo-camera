import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import QRCodeScanner from './QRCodeScanner'; // 先ほど作成したファイル

export default function App() {
  const [scannedData, setScannedData] = useState(null);
  const [isActive, setIsActive] = useState(true);

  // スキャン成功時に発火するアクション
  const handleScanSuccess = (data) => {
    setScannedData(data);
    setIsActive(false); // 連続スキャンを防ぐためにカメラを非アクティブにする
    Alert.alert('スキャン成功！', `データ: ${data}`);
  };

  return (
    <View style={styles.container}>
      {isActive ? (
        <QRCodeScanner active={isActive} onScanSuccess={handleScanSuccess} />
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.title}>読み取り結果</Text>
          <Text style={styles.dataText}>{scannedData}</Text>
          <Button 
            title="もう一度スキャンする" 
            onPress={() => {
              setScannedData(null);
              setIsActive(true);
            }} 
          />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dataText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
});
