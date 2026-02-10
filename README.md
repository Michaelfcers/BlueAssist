# 📱 BlueAssist

**Efficient Attendance & Field Work Tracking for Modern Teams.**

> **🎓 Note:** This project was developed during my early years as a Computer Science student. It represents one of my first explorations into mobile development with React Native, solving real-world problems with accessible tools.

BlueAssist is a robust mobile application built with React Native (Expo) designed to streamline employee attendance and technical visit logging. It leverages Google Sheets as a lightweight, accessible database, making it a perfect solution for businesses needing a cost-effective real-time tracking system.

---

## ✨ Key Features

*   **🔒 Secure Authentication:** Simple and secure login using employee ID (Cédula) and password, verified directly against your corporate records.
*   **📍 GPS Location Tracking:**Automatically captures the user's location upon clock-in/out and generates a Google Maps link for verification.
*   **🕒 Smart Attendance System:**
    *   **Check-In / Check-Out:** Intuitive interface for daily attendance.
    *   **Overtime Calculation:** Automatically flags and calculates overtime hours (after 6:00 PM).
*   **🛠️ Technical Visit Logging:** Specific mode to track field operations and technical visits (Start/End).
*   **📶 Offline Support:** Built-in resilience. If the internet fails, data is cached locally and automatically syncs when connectivity returns.
*   **bei Dark Mode:** A native dark mode toggle for comfortable usage in any lighting condition.

---

## 🚀 Tech Stack

*   **Frontend:** React Native (Expo SDK 49)
*   **Backend / Database:** Google Sheets API & Google Apps Script
*   **Local Storage:** Async Storage (for offline data persistence)
*   **Icons:** FontAwesome 5

---

## 🛠️ Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   Expo Go app on your phone (or Android/iOS Simulator)

### 1. Clone the repository

```bash
git clone https://github.com/Michaelfcers/BlueAssist.git
cd BlueAssist
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory. You can use the provided template as a guide:

```bash
cp .env.example .env
```

Fill in your Google Cloud credentials:

```ini
EXPO_PUBLIC_SPREADSHEET_ID=your_google_sheet_id
EXPO_PUBLIC_GOOGLE_API_KEY=your_google_api_key
EXPO_PUBLIC_GOOGLE_SCRIPT_URL=your_google_apps_script_url
```

> **⚠️ Important:** Ensure your Google Apps Script is deployed as a Web App with access set to "Anyone".

### 4. Run the App

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your Android or iOS device.

---

## 📸 Usage

1.  **Login:** Enter your credentials.
2.  **Dashboard:** Select your action:
    *   **Attendance:** Tap "Entrada" to start your day.
    *   **Field Work:** Use "Visita Técnica" when arriving at a client site.
3.  **Sync:** If you are offline, the app will save your data and retry sending it later.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
