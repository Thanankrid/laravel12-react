INSERT INTO iot_components (name, board_type, price, stock_quantity, description, created_at, updated_at) 
VALUES
('WiFi MCU Module', 'ESP32', 250, 50, 'Dual-core MCU with Wi-Fi and Bluetooth', datetime('now'), datetime('now')),
('Power Toggle Button', 'Component', 15, 100, 'Power toggle button wired to input Pin 2', datetime('now'), datetime('now')),
('Stepper Motor', 'Actuator', 350, 30, 'Used for automated bottle return bin', datetime('now'), datetime('now')),
('Smoke Sensor', 'Arduino', 85, 60, 'Gas and smoke detection module', datetime('now'), datetime('now')),
('NodeMCU', 'ESP8266', 120, 100, 'Low-cost Wi-Fi microchip', datetime('now'), datetime('now'));