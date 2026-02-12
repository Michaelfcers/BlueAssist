class GoogleSheetsManager {
  constructor(spreadsheetId = process.env.EXPO_PUBLIC_SPREADSHEET_ID, apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY) {
    this.SPREADSHEET_ID = spreadsheetId;
    this.API_KEY = apiKey;
  }

  async fetchSheetData() {
    const range = 'Trabajadores!A2:C'; // Leemos hasta la columna C para obtener el nombre
    try {
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}/values/${range}?key=${this.API_KEY}`);
      if (!response.ok) {
        throw new Error('Hubo un problema al obtener los datos de la hoja de cálculo.');
      }
      const data = await response.json();
      return data.values;
    } catch (error) {
      console.error("Google Sheets Error:", error);
      return 'Ocurrió un error al obtener los datos. Por favor, inténtalo de nuevo más tarde.';
    }
  }
}

export default GoogleSheetsManager;

