// Bao gồm các thư viện cần thiết
#include <DHT11.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Định nghĩa chân kết nối cảm biến
#define DHT11_PIN 2
#define DUST_LED_PIN 5
#define DUST_ANALOG_PIN A2
#define MQ7_A0 A1
#define LIGHT_SENSOR_PIN A3
#define RAIN_SENSOR_A0 A0
#define RAIN_SENSOR_D0 3

// Khởi tạo cảm biến DHT11
DHT11 dht11(DHT11_PIN);

// Khởi tạo màn hình LCD
#define I2C_ADDR 0x27
LiquidCrystal_I2C lcd(I2C_ADDR, 16, 2);

void setup() {
    // Khởi tạo giao tiếp serial
    Serial.begin(9600);

    // Khởi tạo màn hình LCD
    lcd.begin(16, 2);
    lcd.backlight();
    lcd.setCursor(0, 0);
    lcd.print("Dang khoi tao...");
    delay(2000);

    // Khởi tạo chân kết nối cảm biến
    pinMode(DUST_LED_PIN, OUTPUT);
    pinMode(MQ7_A0, INPUT);
    pinMode(LIGHT_SENSOR_PIN, INPUT);
    pinMode(RAIN_SENSOR_D0, INPUT);
}

void loop() {
    // Đọc dữ liệu từ cảm biến DHT11
    int temperature = 0;
    int humidity = 0;
    int dht11Result = dht11.readTemperatureHumidity(temperature, humidity);
    if (dht11Result == 0) {
        Serial.print("Nhiet do: ");
        Serial.print(temperature);
        Serial.print(" °C\tDo am: ");
        Serial.print(humidity);
        Serial.println(" %");
    } else {
        Serial.println(DHT11::getErrorString(dht11Result));
    }

    // Đọc dữ liệu từ cảm biến bụi
    digitalWrite(DUST_LED_PIN, LOW);
    delayMicroseconds(280);
    int dustValue = analogRead(DUST_ANALOG_PIN);
    delayMicroseconds(40);
    digitalWrite(DUST_LED_PIN, HIGH);
    delayMicroseconds(9680);
    float dustVoltage = dustValue * (5.0 / 1023.0);
    float dustDensity = 0.17 * dustVoltage - 0.1;
    Serial.print("Cam bien bui: ");
    Serial.print(dustValue);
    Serial.print(" (ADC), ");
    Serial.print(dustVoltage);
    Serial.print(" V, ");
    Serial.print(dustDensity);
    Serial.println(" mg/m³");

    // Đọc dữ liệu từ cảm biến MQ-7
    int mq7Value = analogRead(MQ7_A0);
    float mq7Voltage = mq7Value * (5.0 / 1023.0);
    Serial.print("Cam bien MQ-7: ");
    Serial.print(mq7Value);
    Serial.print(" (ADC), ");
    Serial.print(mq7Voltage);
    Serial.println(" V");

    // Đọc dữ liệu từ cảm biến ánh sáng
    int lightValue = analogRead(LIGHT_SENSOR_PIN);
    float lightVoltage = lightValue * (5.0 / 1023.0);
    Serial.print("Cam bien anh sang: ");
    Serial.print(lightValue);
    Serial.print(" (ADC), ");
    Serial.print(lightVoltage);
    Serial.println(" V");

    // Đọc dữ liệu từ cảm biến mưa
    int rainAnalogValue = analogRead(RAIN_SENSOR_A0);
    int rainDigitalValue = digitalRead(RAIN_SENSOR_D0);
    float rainVoltage = rainAnalogValue * (5.0 / 1023.0);
    Serial.print("Cam bien mua (analog): ");
    Serial.print(rainAnalogValue);
    Serial.print(" (ADC), ");
    Serial.print(rainVoltage);
    Serial.println(" V");
    Serial.print("Cam bien mua (digital): ");
    Serial.println(rainDigitalValue);

    // Hiển thị dữ liệu lên màn hình LCD
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Nhiet do:");
    lcd.print(temperature);
    lcd.print("C Do am:");
    lcd.print(humidity);
    lcd.setCursor(0, 1);
    lcd.print("MQ7:");
    lcd.print(mq7Value);
    lcd.print(" Bui:");
    lcd.print(dustDensity);

    delay(2000); // Đợi 2 giây trước khi lặp lại
}
