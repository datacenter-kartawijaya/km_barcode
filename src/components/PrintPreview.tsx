import React, { useState } from 'react';
import BarcodeCard from './BarcodeCard';
import { Printer, Trash2, FileSpreadsheet, Download } from 'lucide-react';

interface PrintPreviewProps {
  items: string[];
  onClear: () => void;
  fileName: string;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ items, onClear, fileName }) => {
  const [startRange, setStartRange] = useState<number | ''>('');
  const [endRange, setEndRange] = useState<number | ''>('');

  const handlePrint = () => {
    window.print();
  };

  const getFilteredItems = () => {
    let filtered = items;
    if (startRange !== '' && endRange !== '') {
      const start = Math.max(0, startRange - 1);
      const end = Math.min(items.length, endRange);
      filtered = items.slice(start, end);
    }
    return filtered;
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="print-section">
      <div className="toolbar no-print">
        <div className="toolbar-info">
          <FileSpreadsheet className="text-secondary" />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>
              <strong>{fileName}</strong> • {items.length} barcodes total
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Menampilkan {filteredItems.length} barcode
            </span>
          </div>
        </div>
        
        <div className="range-filter">
          <label>Range (1 - {items.length}):</label>
          <input 
            type="number" 
            placeholder="Mulai" 
            min={1} 
            max={items.length} 
            value={startRange}
            onChange={(e) => setStartRange(e.target.value ? Number(e.target.value) : '')}
            className="range-input"
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Sampai" 
            min={1} 
            max={items.length} 
            value={endRange}
            onChange={(e) => setEndRange(e.target.value ? Number(e.target.value) : '')}
            className="range-input"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={onClear}>
            <Trash2 size={18} />
            Hapus
          </button>
          <button className="btn btn-primary" onClick={handlePrint} title="Print atau Save as PDF">
            <Download size={18} />
            Download by Range
          </button>
        </div>
      </div>

      <div className="print-preview">
        {filteredItems.map((item, index) => (
          <BarcodeCard key={`${item}-${index}`} value={item} />
        ))}
      </div>
    </div>
  );
};

export default PrintPreview;
