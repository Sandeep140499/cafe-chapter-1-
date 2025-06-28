import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, Download, ArrowLeft, User, Calendar, Clock, Package } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  available: boolean;
  notAvailable: boolean;
  minRequired?: number;
  pricePerUnit?: number;
}

interface InventoryResultsProps {
  data: {
    submitterName: string;
    items: InventoryItem[];
    submissionDate: Date;
    sections?: {
      title: string;
      items: InventoryItem[];
    }[];
  };
  onBack: () => void;
  onNewForm: () => void;
}

const convertToBaseUnit = (qty: number, fromUnit: string, baseUnit: string): number => {
  if (fromUnit === baseUnit) return qty;
  if (fromUnit === 'g' && baseUnit === 'kg') return qty / 1000;
  if (fromUnit === 'kg' && baseUnit === 'g') return qty * 1000;
  if (fromUnit === 'ml' && baseUnit === 'ltr') return qty / 1000;
  if (fromUnit === 'ltr' && baseUnit === 'ml') return qty * 1000;
  return qty;
};

const InventoryResults = ({ data, onBack, onNewForm }: InventoryResultsProps) => {
  const { submitterName, items, submissionDate } = data;

  // Calculate price for each item and total
  const itemsWithPrice = items.map(item => {
    const minRequired = item.minRequired || 0;
    const pricePerUnit = item.pricePerUnit || 0;
    const baseUnit = item.unit;
    const enteredUnit = item.unit; // or customUnits[item.id] if you use custom units
    const availableQty = parseFloat(item.quantity) || 0;
    const availableQtyInBase = convertToBaseUnit(availableQty, enteredUnit, baseUnit);
    const neededQty = Math.max(minRequired - availableQtyInBase, 0);
    const price = (neededQty > 0 && minRequired > 0 && pricePerUnit > 0)
      ? (neededQty / minRequired) * pricePerUnit
      : 0;
    return { ...item, price, neededQty };
  });

  const totalPrice = itemsWithPrice.reduce((sum, item) => sum + (item.price || 0), 0);

  // Only required items (entered quantity > 0)
  const requiredItems = itemsWithPrice.filter(
    item => !item.available && (item.neededQty > 0 || item.notAvailable)
  );

  // PDF for all items (with required and price)
  const generatePDF = () => {
    const tableData = itemsWithPrice.map(item => [
      item.name,
      `${item.quantity} ${item.unit}`,
      `${item.minRequired ?? '-'} ${item.unit}`,
      item.pricePerUnit ? `₹${item.pricePerUnit}` : '-',
      item.price ? `₹${item.price.toFixed(2)}` : '-',
      item.available ? 'Available' : '',
      item.notAvailable ? 'Not-Available' : ''
    ]);
    const dateString = new Date(submissionDate).toLocaleDateString('en-CA'); // YYYY-MM-DD
    const timeString = new Date(submissionDate).toLocaleTimeString('en-IN');
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFontSize(14);
    doc.text("Cafe Chapter 1 Gautam Nagar Inventory Report", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Submitted by: ${submitterName}`, 105, 22, { align: "center" });
    doc.text(`Date: ${dateString}   Time: ${timeString}`, 105, 28, { align: "center" });
    autoTable(doc, {
      head: [['Item Name', 'Net Quantity', 'Required', 'Price/Unit', 'Price', 'Available', 'Not Available']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3, halign: 'center', valign: 'middle', textColor: [40, 40, 40] },
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { fillColor: [236, 240, 241], textColor: [44, 62, 80] },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      columnStyles: { 5: { textColor: [39, 174, 96] }, 6: { textColor: [192, 57, 43] } }
    });
    doc.save(`Cafe Inventory Full (${dateString}).pdf`);
  };

  // Add this utility to group items by category
  const groupRequiredItemsByCategory = (sections) => {
    return sections.map(section => {
      // Only include items that are required (neededQty > 0 or notAvailable)
      const requiredItems = section.items
        .map(item => {
          const minRequired = item.minRequired || 0;
          const pricePerUnit = item.pricePerUnit || 0;
          const baseUnit = item.unit;
          const enteredUnit = item.unit;
          const availableQty = parseFloat(item.quantity) || 0;
          const availableQtyInBase = convertToBaseUnit(availableQty, enteredUnit, baseUnit);
          const neededQty = Math.max(minRequired - availableQtyInBase, 0);
          const price = (neededQty > 0 && minRequired > 0 && pricePerUnit > 0)
            ? (neededQty / minRequired) * pricePerUnit
            : 0;
          return { ...item, neededQty, price };
        })
        .filter(item => item.neededQty > 0 || item.notAvailable);

      return {
        title: section.title,
        items: requiredItems
      };
    }).filter(section => section.items.length > 0);
  };

  // PDF for required items only
  const generateRequiredPDF = () => {
    const grouped = (data.sections || []).map(section => {
      const requiredItems = section.items
        .map(item => {
          const minRequired = item.minRequired || 0;
          const pricePerUnit = item.pricePerUnit || 0;
          const baseUnit = item.unit;
          const enteredUnit = item.unit;
          const availableQty = parseFloat(item.quantity) || 0;
          const availableQtyInBase = convertToBaseUnit(availableQty, enteredUnit, baseUnit);
          const neededQty = Math.max(minRequired - availableQtyInBase, 0);
          const price = (neededQty > 0 && minRequired > 0 && pricePerUnit > 0)
            ? (neededQty / minRequired) * pricePerUnit
            : 0;
          return { ...item, neededQty, price };
        })
        .filter(item => item.neededQty > 0 || item.notAvailable);

      return {
        title: section.title,
        items: requiredItems
      };
    }).filter(section => section.items.length > 0);

    const dateString = new Date(data.submissionDate).toLocaleDateString('en-CA');
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    let grandTotal = 0;

    grouped.forEach((section, idx) => {
      if (idx > 0) doc.addPage();
      doc.setFontSize(14);
      doc.text(`Category: ${section.title}`, 105, 15, { align: "center" });
      doc.setFontSize(10);
      doc.text(`Date: ${dateString}`, 105, 22, { align: "center" });

      const tableData = section.items.map(item => {
        const displayQty = item.notAvailable
          ? item.minRequired ?? 0
          : item.neededQty;
        const displayPrice = item.notAvailable && item.pricePerUnit && item.minRequired
          ? (item.pricePerUnit * item.minRequired)
          : item.price || 0;
        return [
          item.name,
          `${displayQty} ${item.unit}`,
          `₹${displayPrice.toFixed(2)}`
        ];
      });

      const sectionTotal = section.items.reduce((sum, item) => {
        if (item.notAvailable && item.pricePerUnit && item.minRequired) {
          return sum + (item.pricePerUnit * item.minRequired);
        } else if (!item.notAvailable && item.price) {
          return sum + item.price;
        }
        return sum;
      }, 0);

      grandTotal += sectionTotal;

      autoTable(doc, {
        head: [['Item Name', 'Net Quantity', 'Price']],
        body: tableData,
        startY: 30,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3, halign: 'center', valign: 'middle', textColor: [40, 40, 40] },
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
        bodyStyles: { fillColor: [236, 240, 241], textColor: [44, 62, 80] },
        alternateRowStyles: { fillColor: [255, 255, 255] }
      });

      doc.setFontSize(12);
      doc.text(`Total for ${section.title}: ₹${sectionTotal.toFixed(2)}`, 180, doc.lastAutoTable.finalY + 10, { align: "right" });
    });

    // Add grand total on last page
    doc.setFontSize(14);
    doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 180, doc.lastAutoTable.finalY + 20, { align: "right" });

    doc.save(`Required Items (${dateString}).pdf`);
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
                      <th className="border border-amber-700 p-4 text-left font-semibold">Available Quantity</th>
                      <th className="border border-amber-700 p-4 text-center font-semibold">Required</th>
                      <th className="border border-amber-700 p-4 text-center font-semibold">Price/Unit</th>
                      <th className="border border-amber-700 p-4 text-center font-semibold">Price</th>
                      <th className="border border-amber-700 p-4 text-center font-semibold">Available</th>
                      <th className="border border-amber-700 p-4 text-center font-semibold">Not Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsWithPrice.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-amber-25'}>
                        <td className="border border-gray-200 p-4 font-medium">{item.name}</td>
                        <td className="border border-gray-200 p-4">{item.quantity} {item.unit}</td>
                        <td className="border border-gray-200 p-4 text-center">{item.minRequired ?? '-'} {item.unit}</td>
                        <td className="border border-gray-200 p-4 text-center">{item.pricePerUnit ? `₹${item.pricePerUnit}` : '-'}</td>
                        <td className="border border-gray-200 p-4 text-center">{item.price ? `₹${item.price.toFixed(2)}` : '-'}</td>
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

            {/* Required Items Table */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Required Items & Prices</h3>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-200">
                  {requiredItems.length} Required
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-orange-100 text-amber-700">
                      <th className="border border-amber-200 p-4 text-left font-semibold">Item Name</th>
                      <th className="border border-amber-200 p-4 text-left font-semibold">Net Quantity</th>
                      <th className="border border-amber-200 p-4 text-center font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requiredItems.map((item, index) => {
                      // If not available, show minRequired as needed and price for minRequired
                      const displayQty = item.notAvailable
                        ? item.minRequired ?? 0
                        : item.neededQty;
                      const displayPrice = item.notAvailable
                        ? (item.pricePerUnit && item.minRequired ? `₹${item.pricePerUnit.toFixed(2)}` : '-')
                        : (item.price ? `₹${item.price.toFixed(2)}` : '-');

                      return (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-orange-50'}>
                          <td className="border border-gray-200 p-4 font-medium">{item.name}</td>
                          <td className="border border-gray-200 p-4">{displayQty} {item.unit}</td>
                          <td className="border border-gray-200 p-4 text-center">{displayPrice}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2} className="border border-gray-200 p-4 text-right font-bold">Total Price</td>
                      <td className="border border-gray-200 p-4 text-center font-bold text-amber-700">
                        ₹{
                          requiredItems.reduce((sum, item) => {
                            if (item.notAvailable && item.pricePerUnit && item.minRequired) {
                              return sum + (item.pricePerUnit * item.minRequired);
                            } else if (!item.notAvailable && item.price) {
                              return sum + item.price;
                            }
                            return sum;
                          }, 0).toFixed(2)
                        }
                      </td>
                    </tr>
                  </tfoot>
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
                Download Full Inventory PDF
              </Button>
              <Button
                onClick={generateRequiredPDF}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Download className="h-4 w-4" />
                Download Required Items & Prices
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

/* Example in your parent component or after form submit:
<InventoryResults
  data={{
    submitterName,
    items: allItemsFlat, // your flat items array
    submissionDate,
    sections: updatedSections // <-- pass your sections array here!
  }}
  onBack={...}
  onNewForm={...}
/>
*/
