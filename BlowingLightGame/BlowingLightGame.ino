// Flag's Block 產生的草稿碼

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include "data/webpages.h"
#include <PubSubClient.h>
#include <IRremoteESP8266.h>
#include <IRrecv.h>
#include <IRutils.h>

unsigned long _E7_B4_80_E9_8C_84_E6_99_82_E9_96_93 = millis();
int _E8_81_BD_E5_88_B0_E8_81_B2_E9_9F_B3_E7_9A_84_E6_AC_A1_E6_95_B8 = 0;
String MQTT_E8_A8_8A_E6_81_AF_E5_85_A7_E5_AE_B9;
int _E9_81_8A_E6_88_B2_E6_A8_A1_E5_BC_8F = 1;
int _E5_90_B9_E6_B0_A3_E7_AB_B6_E8_B3_BD_E6_A8_A1_E5_BC_8F_E9_96_BE_E5_80_BC = 5000;
boolean _E5_B7_B2_E5_82_B3_E9_80_81_E7_B5_90_E6_9E_9C = false;
ESP8266WebServer _esp8266WebServer(80);
IRrecv _irrecv(D5);
decode_results _irrecvResult;

String _MQTTTopic;
String _MQTTMsg;

WiFiClient _MQTTWiFiClient;
PubSubClient _MQTTClient(u8"broker.mqtt-dashboard.com", 1883, _MQTTWiFiClient);

void _MQTT_Callback(char* topic, byte* payload, unsigned int length) {
  _MQTTTopic = topic;
  _MQTTMsg = "";
  for(int i = 0;i < length;i++) {
    _MQTTMsg += (char) payload[i];
  }
  _E8_A7_A3_E6_9E_90_E7_B6_B2_E9_A0_81_E6_8C_87_E4_BB_A4();
}

void handleRoot() {
#ifndef WEBPAGE_IN_PROGMEM
  _esp8266WebServer.send(200, "text/html", mainPage);
#else
  _esp8266WebServer.send_P(200, PSTR("text/html"), mainPage);
#endif
}

void handleNotFound() {
#ifndef WEBPAGE_IN_PROGMEM
  _esp8266WebServer.send(404, "text/html", errorPage);
#else
  _esp8266WebServer.send_P(404, PSTR("text/html"), errorPage);
#endif
}

void handleSetting() {
#ifndef WEBPAGE_IN_PROGMEM
  _esp8266WebServer.send(200, "text/html", settingPage);
#else
  _esp8266WebServer.send_P(200, PSTR("text/html"), settingPage);
#endif
}

void _E6_8E_A5_E6_94_B6_E7_B4_85_E5_A4_96_E7_B7_9A_E8_A8_8A_E8_99_9F() {
  if (_irrecv.decode(&_irrecvResult)) {
    Serial.println(uint64ToString(_irrecvResult.value, 16));
    if (uint64ToString(_irrecvResult.value, 16) == u8"FF30CF") {
      _E9_81_8A_E6_88_B2_E6_A8_A1_E5_BC_8F = 1;
    } else if (uint64ToString(_irrecvResult.value, 16) == u8"FF18E7") {
      _E9_81_8A_E6_88_B2_E6_A8_A1_E5_BC_8F = 2;
    } else if (uint64ToString(_irrecvResult.value, 16) == u8"FF7A85") {
      _E9_81_8A_E6_88_B2_E6_A8_A1_E5_BC_8F = 3;
    }
    _MQTTClient.publish(u8"Final06131286", String((String(u8"setMode:") + String(_E9_81_8A_E6_88_B2_E6_A8_A1_E5_BC_8F))).c_str());
    delay(100);
    _irrecv.resume();
  }
}

void _E9_80_A3_E6_8E_A5MQTT_E6_9C_8D_E5_8B_99() {
  while (!_MQTTClient.connected()) {
    if (_MQTTClient.connect(u8"Final06131286Clinet", u8"", u8"")) {
      Serial.println(u8"已經連上 MQTT 伺服器");
      _MQTTClient.subscribe(u8"Final06131286");
    } else {
      Serial.println(u8"尚未連上 MQTT 伺服器");
      delay(1000);
    }
  }
}

void _E5_90_B9_E6_B0_A3_E8_A8_88_E7_A7_92_E6_95_B8_E6_A8_A1_E5_BC_8F() {
  digitalWrite(D2, HIGH);
  _E7_B4_80_E9_8C_84_E6_99_82_E9_96_93 = millis() - _E7_B4_80_E9_8C_84_E6_99_82_E9_96_93;
}

void _E5_90_B9_E6_B0_A3_E7_AB_B6_E8_B3_BD_E6_A8_A1_E5_BC_8F() {
  _E7_B4_80_E9_8C_84_E6_99_82_E9_96_93 = millis() - _E7_B4_80_E9_8C_84_E6_99_82_E9_96_93;
  if (_E7_B4_80_E9_8C_84_E6_99_82_E9_96_93 >= _E5_90_B9_E6_B0_A3_E7_AB_B6_E8_B3_BD_E6_A8_A1_E5_BC_8F_E9_96_BE_E5_80_BC) {
    digitalWrite(D2, HIGH);
    tone(D3,1976,1000);
  }
}

void _E8_9C_82_E9_B3_B4_E5_99_A8_E6_92_AD_E9_9F_B3_E6_A8_A1_E5_BC_8F() {
  _E8_81_BD_E5_88_B0_E8_81_B2_E9_9F_B3_E7_9A_84_E6_AC_A1_E6_95_B8 += 1;
  if (_E8_81_BD_E5_88_B0_E8_81_B2_E9_9F_B3_E7_9A_84_E6_AC_A1_E6_95_B8 >= 20) {
    tone(D3,1976,1000);
  } else if (_E8_81_BD_E5_88_B0_E8_81_B2_E9_9F_B3_E7_9A_84_E6_AC_A1_E6_95_B8 >= 15) {
    tone(D3,1760,1000);
  } else if (_E8_81_BD_E5_88_B0_E8_81_B2_E9_9F_B3_E7_9A_84_E6_AC_A1_E6_95_B8 >= 11) {
    tone(D3,1568,1000);
  } else if (_E8_81_BD_E5_88_B0_E8_81_B2_E9_9F_B3_E7_9A_84_E6_AC_A1_E6_95_B8 >= 8) {
    tone(D3,1397,1000);
  } else if (_E8_81_BD_E5_88_B0_E8_81_B2_E9_9F_B3_E7_9A_84_E6_AC_A1_E6_95_B8 >= 5) {
    tone(D3,1318,1000);
  } else if (_E8_81_BD_E5_88_B0_E8_81_B2_E9_9F_B3_E7_9A_84_E6_AC_A1_E6_95_B8 >= 3) {
    tone(D3,1175,1000);
  } else if (_E8_81_BD_E5_88_B0_E8_81_B2_E9_9F_B3_E7_9A_84_E6_AC_A1_E6_95_B8 >= 1) {
    tone(D3,1046,1000);
  }
}

void _E8_A7_A3_E6_9E_90_E7_B6_B2_E9_A0_81_E6_8C_87_E4_BB_A4() {
  Serial.println((String(_MQTTTopic) + String(u8"：") + String(_MQTTMsg)));
  MQTT_E8_A8_8A_E6_81_AF_E5_85_A7_E5_AE_B9 = _MQTTMsg;
  if (MQTT_E8_A8_8A_E6_81_AF_E5_85_A7_E5_AE_B9.substring(0, 13) == u8"setThreshold:") {
    _E5_90_B9_E6_B0_A3_E7_AB_B6_E8_B3_BD_E6_A8_A1_E5_BC_8F_E9_96_BE_E5_80_BC = (int)(MQTT_E8_A8_8A_E6_81_AF_E5_85_A7_E5_AE_B9.substring(13));
  } else if (MQTT_E8_A8_8A_E6_81_AF_E5_85_A7_E5_AE_B9.substring(0, 16) == u8"setModeToClient:") {
    _E9_81_8A_E6_88_B2_E6_A8_A1_E5_BC_8F = (int)(MQTT_E8_A8_8A_E6_81_AF_E5_85_A7_E5_AE_B9.substring(16));
  }
}


// setup() 會先被執行且只會執行一次
void setup() {
  Serial.begin(9600);
  _irrecv.enableIRIn();
  pinMode(D2, OUTPUT);
  pinMode(D1, INPUT);
  pinMode(D3, OUTPUT);

  WiFi.begin(u8"hao", u8"zhiao777774");
  while (!(WiFi.status() == WL_CONNECTED)) {
    Serial.println(u8"尚未連上無線網路");
    delay(1000);
  }
  _MQTTClient.setCallback(_MQTT_Callback);
  _esp8266WebServer.on("/", handleRoot);
  _esp8266WebServer.onNotFound(handleNotFound);
  _esp8266WebServer.on("/setting", handleSetting);
  _esp8266WebServer.begin();
  digitalWrite(D2, LOW);

}

// loop() 裡面的程式會不斷重複執行
void loop() {
  _E9_80_A3_E6_8E_A5MQTT_E6_9C_8D_E5_8B_99();
  _E6_8E_A5_E6_94_B6_E7_B4_85_E5_A4_96_E7_B7_9A_E8_A8_8A_E8_99_9F();
  _MQTTClient.loop();
  _esp8266WebServer.handleClient();
  delay(50);
  if (digitalRead(D1) == HIGH) {
    _E5_B7_B2_E5_82_B3_E9_80_81_E7_B5_90_E6_9E_9C = false;
    if (_E9_81_8A_E6_88_B2_E6_A8_A1_E5_BC_8F == 1) {
      _E5_90_B9_E6_B0_A3_E8_A8_88_E7_A7_92_E6_95_B8_E6_A8_A1_E5_BC_8F();
    } else if (_E9_81_8A_E6_88_B2_E6_A8_A1_E5_BC_8F == 2) {
      _E5_90_B9_E6_B0_A3_E7_AB_B6_E8_B3_BD_E6_A8_A1_E5_BC_8F();
    } else if (_E9_81_8A_E6_88_B2_E6_A8_A1_E5_BC_8F == 3) {
      _E8_9C_82_E9_B3_B4_E5_99_A8_E6_92_AD_E9_9F_B3_E6_A8_A1_E5_BC_8F();
    }
  } else {
    if (!_E5_B7_B2_E5_82_B3_E9_80_81_E7_B5_90_E6_9E_9C) {
      _E5_B7_B2_E5_82_B3_E9_80_81_E7_B5_90_E6_9E_9C = true;
      if (_E9_81_8A_E6_88_B2_E6_A8_A1_E5_BC_8F == 1) {
        _MQTTClient.publish(u8"Final06131286", String((String(u8"mode1:") + String(_E7_B4_80_E9_8C_84_E6_99_82_E9_96_93))).c_str());
      } else if (_E9_81_8A_E6_88_B2_E6_A8_A1_E5_BC_8F == 2) {
        _MQTTClient.publish(u8"Final06131286", String((String(u8"mode2:") + String(_E5_90_B9_E6_B0_A3_E7_AB_B6_E8_B3_BD_E6_A8_A1_E5_BC_8F_E9_96_BE_E5_80_BC) + String(u8",") + String(_E7_B4_80_E9_8C_84_E6_99_82_E9_96_93 >= _E5_90_B9_E6_B0_A3_E7_AB_B6_E8_B3_BD_E6_A8_A1_E5_BC_8F_E9_96_BE_E5_80_BC))).c_str());
      } else if (_E9_81_8A_E6_88_B2_E6_A8_A1_E5_BC_8F == 3) {
        _MQTTClient.publish(u8"Final06131286", String((String(u8"mode3:") + String(_E8_81_BD_E5_88_B0_E8_81_B2_E9_9F_B3_E7_9A_84_E6_AC_A1_E6_95_B8))).c_str());
      }
    }
    digitalWrite(D2, LOW);
    _E8_81_BD_E5_88_B0_E8_81_B2_E9_9F_B3_E7_9A_84_E6_AC_A1_E6_95_B8 = 0;
    _E7_B4_80_E9_8C_84_E6_99_82_E9_96_93 = millis();
  }

}
