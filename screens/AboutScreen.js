import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About TabibNearby</Text>
      <Text style={styles.copyright}>© 2024 Abderahmane Kateb. All rights reserved.</Text>
      <Text style={styles.description}>
        This app and all its contents, including text, graphics, logos, icons, images, audio clips, etc., are exclusively owned by Abderahmane Kateb and protected under copyright, trademark, and other intellectual property laws.
      </Text>
      <Text 
        style={styles.link}
        onPress={() => Linking.openURL('https://www.privacypolicies.com/live/5085b447-2ed2-4258-8483-6dc95cc745bc')}
      >
        Terms of Use
      </Text>
      <Text 
        style={styles.link}
        onPress={() => Linking.openURL('https://www.privacypolicies.com/live/41eada8a-faca-4207-afc9-a4e37290a753')}
      >
        Privacy Policy
      </Text>
      <Text style={styles.warning}>
        Unauthorized copying, distribution, transmission, display, sale, licensing, modification, or creation of derivative works from any part of this app without explicit written permission from Abderahmane Kateb may result in legal action.
      </Text>
      <Text style={styles.contact}>
        For inquiries regarding intellectual property rights, please contact us at:
      </Text>
      <Text 
        style={styles.email}
        onPress={() => Linking.openURL('mailto:dahakateb40@gmail.com')}
      >
        Contact Me
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30, // زيادة مساحة الحواف
    backgroundColor: '#f7f7f7', // خلفية فاتحة لواجهة أكثر نظافة
  },
  title: {
    fontSize: 28, // زيادة حجم الخط للعنوان
    fontWeight: 'bold',
    color: '#333', // لون داكن للنص
    marginBottom: 20,
  },
  copyright: {
    fontSize: 16,
    color: '#666', // لون رمادي للنص
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#444', // لون داكن للنص
    textAlign: 'center',
    lineHeight: 24, // زيادة ارتفاع السطر لتحسين القراءة
    marginBottom: 20, // زيادة المسافة السفلية
  },
  link: {
    fontSize: 16,
    color: '#1e90ff', // استخدام لون أزرق لروابط النص
    textDecorationLine: 'underline',
    marginTop: 10,
    marginBottom: 10, // إضافة مسافة سفلية لتحسين التباعد بين الروابط
  },
  warning: {
    fontSize: 14,
    color: '#aa0000', // لون أحمر خفيف للتحذير
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
    lineHeight: 22,
  },
  contact: {
    fontSize: 16,
    color: '#444',
    marginTop: 30, // زيادة المسافة العلوية لتحسين الفاصل
  },
  email: {
    fontSize: 16,
    color: '#1e90ff', // لون أزرق للنص القابل للنقر
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});

export default AboutScreen;
