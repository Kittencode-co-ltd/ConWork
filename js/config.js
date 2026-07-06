// js/config.js
const CONFIG = {
    // กำหนด URL ของ API หลัก (Backend URL)
    // เปลี่ยนเป็น URL ของ Server จริง เมื่อนำขึ้น Production
    API_BASE_URL: 'http://localhost:3000/api',
    
    // ตั้งค่า Environment: 'development', 'staging', 'production'
    ENV: 'development',
    
    // ตั้งค่าเวลา Timeout ของการเรียก API (หน่วยเป็นมิลลิวินาที)
    TIMEOUT: 10000,
    
    // ตั้งค่า Prefix สำหรับคีย์ต่างๆ ใน LocalStorage เพื่อป้องกันการชนกัน
    STORAGE_PREFIX: 'conwork_'
};
