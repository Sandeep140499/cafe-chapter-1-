import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Coffee, Package, ArrowLeft, User } from 'lucide-react';
import jsPDF from "jspdf";
import "jspdf-autotable";

type InventoryItem = {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  available: boolean;
  notAvailable: boolean;
};

type InventorySection = {
  title: string;
  items: InventoryItem[];
};

const initialSections: InventorySection[] = [
  {
    title: 'GROCREY ITEMS',
    items: [
      { id: '1', name: 'sugar', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '2', name: 'bura', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '3', name: 'dairyMilk', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '4', name: 'kewraJal', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '5', name: 'maida', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '6', name: 'ararot', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '7', name: 'pasta', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '8', name: 'sabutLalMirch', quantity: '', unit: 'g', available: false, notAvailable: false },
      { id: '9', name: 'cornFlakes', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '10', name: 'kitKat', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '11', name: 'dryFruits', quantity: '', unit: 'g', available: false, notAvailable: false },
      { id: '12', name: 'maggiMasala', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '13', name: 'oreo', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '14', name: 'tea', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '15', name: 'maggi', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '16', name: 'oil', quantity: '', unit: 'pkt', available: false, notAvailable: false },
    ],
  },
  {
    title: 'MOMOS',
    items: [
      { id: '17', name: 'vegMomos', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '18', name: 'paneerMomos', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '19', name: 'chickenMomos', quantity: '', unit: 'pcs', available: false, notAvailable: false },
    ],
  },
  {
    title: 'COLDDRINKS',
    items: [
      { id: '20', name: 'coke', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '21', name: 'sprite', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '22', name: 'fanta', quantity: '', unit: 'pcs', available: false, notAvailable: false },
    ],
  },
  {
    title: 'DAILY ITEMS',
    items: [
      { id: '23', name: 'chicken', quantity: '', unit: 'g', available: false, notAvailable: false },
      { id: '24', name: 'paneer', quantity: '', unit: 'g', available: false, notAvailable: false },
      { id: '25', name: 'ice', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '26', name: 'sweetcorn', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '27', name: 'smokedChicken', quantity: '', unit: 'g', available: false, notAvailable: false },
      { id: '28', name: 'chickenTikka', quantity: '', unit: 'g', available: false, notAvailable: false },
      { id: '29', name: 'paneerTikka', quantity: '', unit: 'g', available: false, notAvailable: false },
      { id: '30', name: 'pizzaLarge', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '31', name: 'pizzaSmall', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '32', name: 'milk', quantity: '', unit: 'ltr', available: false, notAvailable: false },
      { id: '33', name: 'garlicBreads', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '34', name: 'burgerBun', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '35', name: 'jumboBread', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '36', name: 'milkPowder', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '37', name: 'coffee', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '38', name: 'dahi', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '39', name: 'mustardOil', quantity: '', unit: 'ltr', available: false, notAvailable: false },
      { id: '40', name: 'rabri', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '41', name: 'egg', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '42', name: 'butter', quantity: '', unit: 'pkt', available: false, notAvailable: false },
    ],
  },
  {
    title: 'VEGETABLES',
    items: [
      { id: '38', name: 'Pata Gobhi', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '39', name: 'Simla Mirch', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '40', name: 'Tomato', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '41', name: 'Carrot', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '42', name: 'Garlic', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '43', name: 'Adrak', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '44', name: 'Onion', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '45', name: 'Potato', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '46', name: 'Spring Onion', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '47', name: 'Dhania Pata', quantity: '', unit: 'bunch', available: false, notAvailable: false },
      { id: '48', name: 'Pudina', quantity: '', unit: 'bunch', available: false, notAvailable: false },
      { id: '49', name: 'Nimbu', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '51', name: 'Khira', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '52', name: 'Broccoli', quantity: '', unit: 'pcs', available: false, notAvailable: false },
    ],
  },
  {
    title: 'SAUCES / FLAVOURS (ROL / HYPER PURE)',
    items: [
      { id: '53', name: 'Cheese', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '54', name: 'Jalapeno Dip ', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '55', name: 'Oregano', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '56', name: 'Aloo Tikki ', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '57', name: 'Chicken Patty', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '58', name: 'Sugar Pouch', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '59', name: 'Pizza Pasta Sauce', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '60', name: 'Tomato Ketchup', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '61', name: 'Momo Mayo ', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '62', name: 'Cheese Slice', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '63', name: 'Peri Peri Masala', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '64', name: 'White Sauce', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '65', name: 'Chilly Flakes', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '66', name: 'Veg Patty', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '67', name: 'Funfood Mayo', quantity: '', unit: 'pkt', available: false, notAvailable: false },
    ],
  },
  {
    title: 'PACKING ITEMS (ROL / HYPER PURE)',
    items: [
      { id: '68', name: 'Large Pizza Box', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '69', name: 'Small Pizza Box', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '70', name: 'Round Small Box', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '71', name: 'Wooden Fork', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '72', name: 'Hot Coffee Box 150 ml', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '72', name: 'Hot Coffee Box 200 ml', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '73', name: 'Momos Chatani Box', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '74', name: 'Butter Paper', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '75', name: 'Momo Plate ', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '76', name: 'Pasta Bowl  ', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '77', name: 'Straw', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '78', name: 'Wooden Spoon', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '79', name: 'Large Envelope', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '80', name: 'Small Envelope', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '81', name: 'Tissues', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '82', name: 'Polybag', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '83', name: 'Small Aluminium Box', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '84', name: 'Cold Coffee Box', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '84', name: 'Cold Coffee Box Packaging', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '85', name: 'Large Aluminium Box', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '86', name: 'Kulhad Tea', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '86', name: 'Kulhad Lassi', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '87', name: 'Coffee Stick', quantity: '', unit: 'pkt', available: false, notAvailable: false },
    ],
  },
  {
    title: 'MOCKTAILS / MILKSHAKE',
    items: [
      { id: '88', name: 'Lemon Ice Tea', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '89', name: 'Green Apple', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '90', name: 'Vanilla', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '91', name: 'Peach Passion', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '92', name: 'Chocolate Sauce', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '93', name: 'Strawberry Milk Shake', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '94', name: 'Watermelon', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '95', name: 'Butterscotch', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '96', name: 'Hazelnut', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '97', name: 'Mango', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '98', name: 'Mint Mojito', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '99', name: 'Orange ', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '100', name: 'Strawberry Mocktail', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '101', name: 'Soda', quantity: '', unit: 'btl', available: false, notAvailable: false },
      { id: '102', name: 'Water Bottle', quantity: '', unit: 'btl', available: false, notAvailable: false },
    ],
  },
  {
    title: 'MASALA',
    items: [
      { id: '103', name: 'Mirch Powder', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '104', name: 'Garam Masala', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '105', name: 'Haldi Powder', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '106', name: 'Chicken Masala', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '107', name: 'Chat Masala', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '108', name: 'Dhania Powder', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '109', name: 'Kali Mirch', quantity: '', unit: 'pkt', available: false, notAvailable: false },
    ],
  },
  // {
  //   title: 'SOUP',
  //   items: [
  //     { id: '110', name: 'Chicken', quantity: '', unit: 'pkt', available: false, notAvailable: false },
  //     { id: '111', name: 'Sweetcorn', quantity: '', unit: 'pkt', available: false, notAvailable: false },
  //     { id: '112', name: 'Tomato', quantity: '', unit: 'pkt', available: false, notAvailable: false },
  //     { id: '113', name: 'Hot & Sour', quantity: '', unit: 'pkt', available: false, notAvailable: false },
  //   ],
  // },
];

interface InventoryFormProps {
  onBack: () => void;
  onSubmit: (data: { submitterName: string; items: InventoryItem[]; submissionDate: Date }) => void;
}

const InventoryForm = ({ onBack, onSubmit }: InventoryFormProps) => {
  const [submitterName, setSubmitterName] = useState('');
  const [sections, setSections] = useState<InventorySection[]>(initialSections);
  const [customUnits, setCustomUnits] = useState<{ [id: string]: string }>({});

  const resetForm = () => setSections(initialSections);

  const updateItem = (sectionIdx: number, itemIdx: number, field: keyof InventoryItem, value: any) => {
    setSections(prevSections =>
      prevSections.map((section, sIdx) => {
        if (sIdx === sectionIdx) {
          const updatedItems = section.items.map((item, iIdx) => {
            if (iIdx === itemIdx) {
              const updatedItem = { ...item, [field]: value };
              // Ensure only one checkbox is selected
              if (field === 'available' && value) {
                updatedItem.notAvailable = false;
              } else if (field === 'notAvailable' && value) {
                updatedItem.available = false;
              }
              return updatedItem;
            }
            return item;
          });
          return { ...section, items: updatedItems };
        }
        return section;
      })
    );
  };

  const addNewItem = (sectionIdx: number) => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: '',
      quantity: '',
      unit: 'kg',
      available: false,
      notAvailable: false
    };
    setSections(prevSections =>
      prevSections.map((section, sIdx) => {
        if (sIdx === sectionIdx) {
          return { ...section, items: [...section.items, newItem] };
        }
        return section;
      })
    );
  };

  const removeItem = (sectionIdx: number, itemIdx: number) => {
    setSections(prevSections =>
      prevSections.map((section, sIdx) => {
        if (sIdx === sectionIdx) {
          const updatedItems = section.items.filter((_, iIdx) => iIdx !== itemIdx);
          return { ...section, items: updatedItems };
        }
        return section;
      })
    );
  };

  // PDF generation function (add this inside the component)
  const generatePdf = (submitterName: string, sections: InventorySection[], submissionDate: Date) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Prepare table data
    const tableData = sections.flatMap(section =>
      section.items.map(item => [
        item.name,
        `${item.quantity} ${item.unit}`,
        item.available ? 'Available' : '',
        item.notAvailable ? 'Not-Available' : ''
      ])
    );

    // Format date and time
    const dateString = submissionDate.toLocaleDateString();
    const timeString = submissionDate.toLocaleTimeString();

    // Title
    doc.setFontSize(14);
    doc.text("Cafe Chapter 1 Gautam Nagar Inventory Report", 105, 15, { align: "center" });

    // Submitted by and date/time
    doc.setFontSize(10);
    doc.text(`Submitted by: ${submitterName}`, 105, 22, { align: "center" });
    doc.text(`Date: ${dateString}   Time: ${timeString}`, 105, 28, { align: "center" });

    // Table
    doc.autoTable({
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
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: [236, 240, 241],
        textColor: [44, 62, 80]
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      columnStyles: {
        2: { textColor: [39, 174, 96] },
        3: { textColor: [192, 57, 43] }
      }
    });

    doc.save("cafe-inventory.pdf");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitterName.trim()) {
      alert('Please enter your name before submitting');
      return;
    }

    const submissionData = {
      submitterName: submitterName.trim(),
      items: sections.flatMap(section => section.items),
      submissionDate: new Date()
    };

    onSubmit(submissionData);

    // Generate PDF with name and date/time
    generatePdf(submissionData.submitterName, sections, submissionData.submissionDate);

    // Reset form after submission
    setSubmitterName('');
    resetForm();
  };

  const handleUnitChange = (itemId: string, newUnit: string) => {
    setCustomUnits(prev => ({ ...prev, [itemId]: newUnit }));
    // ...update item logic...
  };

  const allUnits = ['kg', 'g', 'pkt', 'pcs', 'ltr', 'bunch', 'btl']; // Add all possible units

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
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
                  <p className="text-amber-100 mt-1">Inventory Management System</p>
                </div>
              </div>
              <div className="w-10"></div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input Section */}
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-amber-600" />
                  <Label htmlFor="submitterName" className="text-lg font-semibold text-gray-800">
                    Submitted By
                  </Label>
                </div>
                <Input
                  id="submitterName"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-white border-amber-300 focus:border-amber-500"
                  required
                />
              </div>

              {sections.map((section, sectionIdx) => (
                <div key={section.title} style={{ marginBottom: 32 }}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-amber-600" />
                      <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-200">
                      {section.items.length} Items
                    </Badge>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700">Item Name</th>
                          <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700">Net Quantity</th>
                          <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700">Available</th>
                          <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700">Not Available</th>
                          <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.items.map((item, itemIdx) => (
                          <tr key={item.id}>
                            <td className="border border-gray-200 p-3">
                              <Input
                                value={item.name}
                                onChange={(e) => updateItem(sectionIdx, itemIdx, 'name', e.target.value)}
                                placeholder="Enter item name"
                                className="border-0 focus-visible:ring-0 bg-transparent"
                              />
                            </td>
                            <td className="border border-gray-200 p-3">
                              <div className="flex gap-2">
                                <Input
                                  value={item.quantity}
                                  onChange={(e) => updateItem(sectionIdx, itemIdx, 'quantity', e.target.value)}
                                  placeholder="0"
                                  className="border-0 focus-visible:ring-0 bg-transparent flex-1"
                                />
                                <select
                                  value={customUnits[item.id] || item.unit}
                                  onChange={e => handleUnitChange(item.id, e.target.value)}
                                  className="border border-gray-200 rounded px-2 py-1 text-sm"
                                >
                                  {/* Default (custom or original) unit */}
                                  <option value={customUnits[item.id] || item.unit}>
                                    {customUnits[item.id] || item.unit}
                                  </option>
                                  {/* Other units */}
                                  {allUnits
                                    .filter(u => u !== (customUnits[item.id] || item.unit))
                                    .map(u => (
                                      <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                              </div>
                            </td>
                            <td className="border border-gray-200 p-3 text-center">
                              <Checkbox
                                checked={item.available}
                                onCheckedChange={(checked) => updateItem(sectionIdx, itemIdx, 'available', checked)}
                              />
                            </td>
                            <td className="border border-gray-200 p-3 text-center">
                              <Checkbox
                                checked={item.notAvailable}
                                onCheckedChange={(checked) => updateItem(sectionIdx, itemIdx, 'notAvailable', checked)}
                              />
                            </td>
                            <td className="border border-gray-200 p-3 text-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeItem(sectionIdx, itemIdx)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addNewItem(sectionIdx)}
                      className="flex items-center gap-2"
                    >
                      <Package className="h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                Submit & View Details
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryForm;
