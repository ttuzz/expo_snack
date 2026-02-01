import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';

export default function App() {
  const [ilk, setIlk] = useState('25.0000');
  const [son, setSon] = useState('26.5000');
  const [numune, setNumune] = useState('1.0000');
  const [su, setSu] = useState('2000.0000');
  const [ozgul, setOzgul] = useState('4.1860');
  const [verim, setVerim] = useState('0.98');
  const [gercek, setGercek] = useState('12000');

  const [output, setOutput] = useState('');

  function calc() {
    const toNum = v => { const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : n };
    const ilkN = toNum(ilk);
    const sonN = toNum(son);
    const numuneN = toNum(numune);
    const suN = toNum(su);
    const ozgulN = toNum(ozgul);
    const verimN = toNum(verim);
    const gercekN = toNum(gercek);

    if (ilkN === null || sonN === null || numuneN === null || suN === null || ozgulN === null) {
      setOutput('Eksik veya geçersiz giriş. Lütfen sayısal değer girin.');
      return;
    }
    if (numuneN === 0) {
      setOutput('Hata: Numune ağırlığı sıfır olamaz.');
      return;
    }

    const deltaT = sonN - ilkN;
    const q_per_g = (suN * ozgulN * deltaT) / numuneN; // J/g
    const q_verimli = q_per_g * (verimN != null ? verimN : 1.0);
    const cal_small = q_per_g / 4.184; // cal/g

    let lines = [];
    lines.push('--- HESAPLAMA SONUÇLARI ---');
    lines.push(`ΔT = ${deltaT.toFixed(4)} °C`);
    lines.push(`Hesaplanan Kalori: ${q_per_g.toFixed(4)} J/g`);
    lines.push(`Verim Dahil: ${q_verimli.toFixed(4)} J/g`);
    lines.push(`Hesaplanan Kalori (cal/g): ${cal_small.toFixed(4)} cal/g`);

    if (gercekN != null && !isNaN(gercekN) && verimN && verimN !== 0) {
      const q_gerekli = gercekN / verimN;
      const delta_t_gerekli = (q_gerekli * numuneN) / (suN * ozgulN);
      const son_gerekli = ilkN + delta_t_gerekli;
      lines.push('');
      lines.push('--- GEREKEN BİTİŞ SICAKLIĞI ---');
      lines.push(`q_gerekli = ${q_gerekli.toFixed(4)} J/g`);
      lines.push(`ΔT_gerekli = ${delta_t_gerekli.toFixed(4)} °C`);
      lines.push(`son_gerekli = ${son_gerekli.toFixed(4)} °C`);
    }

    setOutput(lines.join('\n'));
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Kalori Hesaplama Simülatörü</Text>

      <View style={styles.row}>
        <Text style={styles.label}>İlk Sıcaklık (°C)</Text>
        <TextInput style={styles.input} value={ilk} onChangeText={setIlk} keyboardType="numeric" />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Son Sıcaklık (°C)</Text>
        <TextInput style={styles.input} value={son} onChangeText={setSon} keyboardType="numeric" />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Numune Ağırlığı (g)</Text>
        <TextInput style={styles.input} value={numune} onChangeText={setNumune} keyboardType="numeric" />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Su Miktarı (ml)</Text>
        <TextInput style={styles.input} value={su} onChangeText={setSu} keyboardType="numeric" />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Suyun Özgül Isısı (J/g·°C)</Text>
        <TextInput style={styles.input} value={ozgul} onChangeText={setOzgul} keyboardType="numeric" />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Kalorimetre Verimi (0-1)</Text>
        <TextInput style={styles.input} value={verim} onChangeText={setVerim} keyboardType="numeric" />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Gerçek Kalori (J/g) (opsiyonel)</Text>
        <TextInput style={styles.input} value={gercek} onChangeText={setGercek} keyboardType="numeric" />
      </View>

      <View style={{marginVertical:12, width:'100%'}}>
        <Button title="Hesapla" onPress={calc} />
      </View>

      <View style={styles.outputBox}>
        <Text style={styles.outputText}>{output}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'stretch'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  row: {
    marginBottom: 8
  },
  label: {
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    padding: 8
  },
  outputBox: {
    marginTop: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 4,
    backgroundColor: '#fff'
  },
  outputText: {
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Menlo'
  }
});
