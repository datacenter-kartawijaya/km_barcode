import React from 'react';
import Barcode from 'react-barcode';

interface BarcodeCardProps {
  value: string;
}

const BarcodeCard: React.FC<BarcodeCardProps> = ({ value }) => {
  return (
    <div className="barcode-card">
      <div className="barcode-title">{value}</div>
      <div className="barcode-svg-container">
        <Barcode 
          value={value} 
          format="CODE128"
          displayValue={false} // We display the value custom at the top
          background="#ffffff"
          lineColor="#000000"
          width={2}
          height={60}
          margin={0}
        />
      </div>
    </div>
  );
};

export default BarcodeCard;
