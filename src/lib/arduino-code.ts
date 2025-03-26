export const esp32Code = `#define PIR_PIN 27  // PIR sensor
#define LDR_PIN 25  // LDR sensor
#define BUZZER_PIN 18 // Buzzer

bool motionDetected = false;
bool nightMode = false;

void sendEmailAlert() {
    Serial.println("📧 Simulated Email: Intruder Alert Sent!");
}

void setup() {
    Serial.begin(115200);
    pinMode(PIR_PIN, INPUT);
    pinMode(LDR_PIN, INPUT);
    pinMode(BUZZER_PIN, OUTPUT);

    Serial.println("🔄 Simulating Wi-Fi Connection...");
    delay(2000);  // Simulate Wi-Fi connection delay
    Serial.println("✅ Connected (Simulation)");
}

void loop() {
    int pirState = digitalRead(PIR_PIN);
    int ldrValue = analogRead(LDR_PIN);
    
    Serial.print("LDR Value: "); Serial.println(ldrValue);

    // Determine if it is night
    if (ldrValue < 1000) {
        nightMode = true;
    } else {
        nightMode = false;
    }

    // Trigger Alert if Motion is Detected and it's Night
    if (nightMode && pirState == HIGH) {  
        if (!motionDetected) {  
            Serial.println("🚨 Intruder Alert! Activating Buzzer...");
            digitalWrite(BUZZER_PIN, HIGH);  // Turn ON buzzer
            sendEmailAlert();  // Simulated email send
            delay(10000);  // Buzzer sound duration
            digitalWrite(BUZZER_PIN, LOW);  // Turn OFF buzzer
            Serial.println("🔇 Buzzer OFF");
            motionDetected = true;
        }
    } else {
        motionDetected = false;
    }

    delay(1000);
}`

