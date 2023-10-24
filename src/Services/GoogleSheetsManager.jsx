class GoogleSheetsManager {
    constructor(spreadsheetId = '1ihPkLNTwwVlky9Uq5uoFvRxEW2Ml0hx74HQkeTSLaz0', apiKey = 'AIzaSyBBKHL86Xj8YfskdmeHWVdGTy2uAHflAXI') {
      this.SPREADSHEET_ID = spreadsheetId;
      this.API_KEY = apiKey;
    }
  
    async fetchSheetData() {
      const range = 'Trabajadores!A2:B'; // Aquí especificamos el rango correcto
      try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.SPREADSHEET_ID}/values/${range}?key=${this.API_KEY}`);
        if (!response.ok) {
          throw new Error('Hubo un problema al obtener los datos de la hoja de cálculo.');
        }
        const data = await response.json();
        return data.values;
      } catch (error) {
        console.error(error);
        return 'Ocurrió un error al obtener los datos. Por favor, inténtalo de nuevo más tarde.';
      }
    }
  }
  
  export default GoogleSheetsManager;
  
