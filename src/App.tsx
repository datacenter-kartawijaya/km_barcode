import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { UploadCloud, AlertCircle } from 'lucide-react';
import PrintPreview from './components/PrintPreview';
import './App.css';

function App() {
  const [items, setItems] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Assume first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to json
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length === 0) {
          setError('File Excel kosong atau tidak valid.');
          return;
        }

        // Find "Nomor Box" column index from headers
        // We'll scan until we find it.
        let headerRowIndex = -1;
        let nomorBoxColIndex = -1;

        for (let i = 0; i < Math.min(20, jsonData.length); i++) {
          const row = jsonData[i];
          if (!row) continue;
          
          for (let j = 0; j < row.length; j++) {
            if (typeof row[j] === 'string' && row[j].toLowerCase().includes('nomor box')) {
              headerRowIndex = i;
              nomorBoxColIndex = j;
              break;
            }
          }
          if (headerRowIndex !== -1) break;
        }

        if (nomorBoxColIndex === -1) {
          setError('Tidak dapat menemukan kolom "Nomor Box" di file Excel.');
          return;
        }

        // Extract data
        const extractedItems: string[] = [];
        for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row) continue;
          const val = row[nomorBoxColIndex];
          if (val && typeof val === 'string' && val.trim() !== '') {
            extractedItems.push(val.trim());
          }
        }

        if (extractedItems.length === 0) {
          setError('Ditemukan kolom "Nomor Box" tapi tidak ada data didalamnya.');
          return;
        }

        setItems(extractedItems);
      } catch (err) {
        console.error(err);
        setError('Gagal membaca file Excel. Pastikan formatnya benar (.xlsx / .xls).');
      }
    };

    reader.onerror = () => {
      setError('Terjadi kesalahan saat membaca file.');
    };

    reader.readAsBinaryString(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        processFile(file);
      } else {
        setError('Tolong unggah file Excel yang valid (.xlsx atau .xls)');
      }
    }
  };

  const clearData = () => {
    setItems([]);
    setFileName('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="app-container">
      <div className="header no-print">
        <img src="/logo-kwm.png" alt="CV. Kartawijaya Mandiri" className="app-logo" />
        <h1>Barcode Generator</h1>
        <p>Unggah file Excel daftar arsip Anda untuk menghasilkan barcode secara otomatis.</p>
      </div>

      {error && (
        <div className="error-message no-print">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {items.length === 0 ? (
        <div 
          className={`upload-zone no-print ${isDragging ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="upload-icon" />
          <div className="upload-text">Klik atau Tarik file Excel kesini</div>
          <div className="upload-subtext">Mendukung file .xlsx dan .xls</div>
          <input 
            type="file" 
            ref={fileInputRef}
            className="file-input" 
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </div>
      ) : (
        <PrintPreview items={items} onClear={clearData} fileName={fileName} />
      )}
      
      <footer className="footer no-print">
        create by CV. Kartawijaya Mandiri
      </footer>
    </div>
  );
}

export default App;
