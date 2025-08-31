const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const fs = require('fs');

class GoogleSheetsService {
  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    this.auth = null;
    this.sheets = null;
    this.initialized = false;
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initializeAuth();
    }
  }

  async initializeAuth() {
    try {
      let credentials;

      // Check if we have direct environment variables (Render production)
      if (process.env.GOOGLE_SHEETS_PRIVATE_KEY && process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
        console.log('Using environment variable credentials for Google Sheets');
        
        credentials = {
          type: 'service_account',
          project_id: process.env.GOOGLE_PROJECT_ID || 'dealflow-backend-468922',
          private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
          private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
          client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          client_id: process.env.GOOGLE_CLIENT_ID_SERVICE,
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://oauth2.googleapis.com/token',
          auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
          universe_domain: 'googleapis.com'
        };

        this.auth = new JWT({
          email: credentials.client_email,
          key: credentials.private_key,
          scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive.file'
          ]
        });

      } else {
        // Fall back to file-based authentication (development)
        console.log('Using file-based credentials for Google Sheets');
        const keyPath = process.env.GOOGLE_PRIVATE_KEY_PATH || './credentials/google-service-account.json';
        
        if (!fs.existsSync(keyPath)) {
          throw new Error(`Google service account key file not found at: ${keyPath}`);
        }

        this.auth = new JWT({
          keyFile: keyPath,
          scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive.file'
          ]
        });
      }

      await this.auth.authorize();
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      this.initialized = true;
      
      console.log('Google Sheets authentication successful');
    } catch (error) {
      console.error('Google Sheets authentication error:', error.message);
      throw error;
    }
  }

  /**
   * Update a specific row in a sheet
   */
  async updateRow(sheetName, rowIndex, values) {
    await this.ensureInitialized();
    try {
      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!${rowIndex}:${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values]
        }
      });

      console.log(`Row ${rowIndex} updated in ${sheetName}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating row in ${sheetName}:`, error.message);
      throw error;
    }
  }

  /**
   * Get data from a specific sheet
   */
  async getSheetData(sheetName, range = null) {
    await this.ensureInitialized();
    try {
      const sheetRange = range ? `${sheetName}!${range}` : sheetName;
      
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: sheetRange,
      });

      return response.data.values || [];
    } catch (error) {
      console.error(`Error getting sheet data from ${sheetName}:`, error.message);
      throw error;
    }
  }

  /**
   * Append data to a sheet
   */
  async appendToSheet(sheetName, values) {
    await this.ensureInitialized();
    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:ZZ`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [values]
        }
      });

      console.log(`Data appended to ${sheetName}`);
      return response.data;
    } catch (error) {
      console.error(`Error appending to sheet ${sheetName}:`, error.message);
      throw error;
    }
  }

  /**
   * Find row by column value
   */
  async findRowByValue(sheetName, searchColumn, searchValue) {
    try {
      const data = await this.getSheetData(sheetName);
      
      if (!data || data.length === 0) return null;
      
      const headers = data[0];
      const columnIndex = headers.indexOf(searchColumn);
      
      if (columnIndex === -1) return null;

      for (let i = 1; i < data.length; i++) {
        if (data[i][columnIndex] === searchValue) {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = data[i][index] || '';
          });
          rowData._rowIndex = i + 1;
          return rowData;
        }
      }

      return null;
    } catch (error) {
      console.error(`Error finding row in ${sheetName}:`, error.message);
      throw error;
    }
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return 'ID_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Get current timestamp
   */
  getCurrentTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Test connection to Google Sheets
   */
  async testConnection() {
    await this.ensureInitialized();
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId
      });
      
      console.log(`Connected to spreadsheet: ${response.data.properties.title}`);
      return {
        success: true,
        title: response.data.properties.title,
        sheets: response.data.sheets.map(sheet => sheet.properties.title)
      };
    } catch (error) {
      console.error('Google Sheets connection test failed:', error.message);
      throw error;
    }
  }
}

module.exports = new GoogleSheetsService();