import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, Download, ArrowLeft, User, Calendar, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  unit: 'kg' | 'pkt' | 'ltr' | 'pcs';
  available: boolean;
  notAvailable: boolean;
}

interface InventoryResultsProps {
  data: {
    submitterName: string;
    items: InventoryItem[];
    submissionDate: Date;
  };
  onBack: () => void;
  onNewForm: () => void;
}

const InventoryResults = ({ data, onBack, onNewForm }: InventoryResultsProps) => {
  const { submitterName, items, submissionDate } = data;

  const generatePDF = () => {
    // Prepare table data
    const tableData = items.map(item => [
      item.name,
      `${item.quantity} ${item.unit}`,
      item.available ? 'Available' : '',
      item.notAvailable ? 'Not-Available' : ''
    ]);

    // Format date and time from submissionDate
    const dateString = new Date(submissionDate).toLocaleDateString('en-IN');
    const timeString = new Date(submissionDate).toLocaleTimeString('en-IN');

    // Create PDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    doc.setFontSize(14);
    doc.text("Cafe Chapter 1 Gautam Nagar Inventory Report", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Submitted by: ${submitterName}`, 105, 22, { align: "center" });
    doc.text(`Date: ${dateString}   Time: ${timeString}`, 105, 28, { align: "center" });

    autoTable(doc, {
      head: [['Item Name', 'Quantity', 'Available', 'Not Available']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
        halign: 'center',
        valign: 'middle',
        textColor: [40, 40, 40]
      },
      headStyles: {
        fillColor: [41, 128, 185], // Blue header
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: [236, 240, 241], // Light gray rows
        textColor: [44, 62, 80]
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255] // White for alternate rows
      },
      columnStyles: {
        2: { textColor: [39, 174, 96] }, // Green for 'Available'
        3: { textColor: [192, 57, 43] }  // Red for 'Not-Available'
      }
    });

    doc.save("cafe-inventory.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <Button
                onClick={onBack}
                variant="ghost"
                className="text-white hover:bg-white/20 p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <Coffee className="h-8 w-8" />
                <div className="text-center">
                  <CardTitle className="text-2xl font-bold">CAFE CHAPTER 1 GAUTAM NAGAR</CardTitle>
                  <p className="text-amber-100 mt-1">Inventory Report</p>
                </div>
              </div>
              <div className="w-10"></div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Submission Details */}
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Submission Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600">Submitted by</p>
                    <p className="font-semibold">{submitterName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">{submissionDate.toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold">{submissionDate.toLocaleTimeString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Inventory Details</h3>
                <Badge variant="outline" className="text-amber-600 border-amber-200">
                  {items.length} Items
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-amber-600 text-white">
                      <th className="border border-amber-700 p-4 text-left font-semibold">Item Name</th>
                      <th className="border border-amber-700 p-4 text-left font-semibold">Net Quantity</th>
                      <th className="border border-amber-700 p-4 text-center font-semibold">Available</th>
                      <th className="border border-amber-700 p-4 text-center font-semibold">Not Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-amber-25'}>
                        <td className="border border-gray-200 p-4 font-medium">{item.name}</td>
                        <td className="border border-gray-200 p-4">{item.quantity} {item.unit}</td>
                        <td className="border border-gray-200 p-4 text-center">
                          {item.available && <span className="text-green-600 font-bold">Available</span>}
                        </td>
                        <td className="border border-gray-200 p-4 text-center">
                          {item.notAvailable && <span className="text-red-600 font-bold">NotAvailable</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={generatePDF}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                <Download className="h-4 w-4" />
                Download PDF Report
              </Button>
              
              <Button
                onClick={onNewForm}
                variant="outline"
                className="flex items-center gap-2"
              >
                Create New Inventory
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryResults;
