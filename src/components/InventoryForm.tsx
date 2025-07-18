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
  minRequired?: number;      // Add this
  pricePerUnit?: number;     // Add this
};

type InventorySection = {
  title: string;
  items: InventoryItem[];
};

const initialSections: InventorySection[] = [
  {
    title: 'GROCREY ITEMS',
    items: [
      { id: '1', name: 'Sugar', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 1.5, pricePerUnit: 44 },
      { id: '2', name: 'Bura', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 50 },
      { id: '3', name: 'Dairy Milk', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 6, pricePerUnit: 10 },
      { id: '4', name: 'Kewra Jal', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 68 },
      { id: '5', name: 'Maida', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 1.5, pricePerUnit: 36 },
      { id: '6', name: 'Ararot', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 50 },
      { id: '7', name: 'Pasta', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 60 },
      { id: '8', name: 'Sabut Lal Mirch', quantity: '', unit: 'g', available: false, notAvailable: false, minRequired: 200, pricePerUnit: 0.2 },
      { id: '9', name: 'Corn Flakes', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 180 },
      { id: '10', name: 'KitKat', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 5, pricePerUnit: 10 },
      { id: '11', name: 'Dry Fruits', quantity: '', unit: 'g', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 0.9 },
      { id: '12', name: 'Maggi Masala', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 10, pricePerUnit: 5 },
      { id: '13', name: 'Oreo', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 5, pricePerUnit: 10 },
      { id: '14', name: 'Tea', quantity: '', unit: 'g', available: false, notAvailable: false, minRequired: 250, pricePerUnit: 0.22 },
      { id: '15', name: 'Maggi', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 10, pricePerUnit: 15 },
      { id: '16', name: 'Oil', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 130 },
    ],
  },
  {
    title: 'MOMOS',
    items: [
      { id: '17', name: 'Veg Momos', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 72, pricePerUnit: 2.5 },
      { id: '18', name: 'Paneer Momos', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 72, pricePerUnit: 3.33 },
      { id: '19', name: 'Chicken Momos', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 72, pricePerUnit: 3.33 },
    ],
  },
  {
    title: 'COLDDRINKS',
    items: [
      { id: '20', name: 'Coke', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 40 },
      { id: '21', name: 'Sprite', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 40 },
      { id: '22', name: 'Fanta', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 40 },
    ],
  },
  {
    title: 'DAILY ITEMS',
    items: [
      { id: '23', name: 'Chicken', quantity: '', unit: 'g', available: false, notAvailable: false, minRequired: 100, pricePerUnit: 200 },
      { id: '24', name: 'Paneer', quantity: '', unit: 'g', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 180 },
      { id: '25', name: 'Ice', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 8, pricePerUnit: 10 },
      { id: '26', name: 'Sweet corn', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 40 },
      { id: '27', name: 'Smoked Chicken', quantity: '', unit: 'g', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 120 },
      { id: '28', name: 'Chicken Tikka', quantity: '', unit: 'g', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 130 },
      { id: '29', name: 'Paneer Tikka', quantity: '', unit: 'g', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 110 },
      { id: '30', name: 'Pizza Large', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 6, pricePerUnit: 200 },
      { id: '31', name: 'Pizza Small', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 6, pricePerUnit: 120 },
      { id: '32', name: 'Milk', quantity: '', unit: 'ltr', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 60 },
      { id: '33', name: 'Garlic Breads', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 50 },
      { id: '34', name: 'Burger Bun', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 3, pricePerUnit: 30 },
      { id: '35', name: 'Jumbo Bread', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 40 },
      { id: '36', name: 'Milk Powder', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 10, pricePerUnit: 80 },
      { id: '37', name: 'Coffee', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 100, pricePerUnit: 90 },
      { id: '38', name: 'Dahi', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 60 },
      // { id: '39', name: 'MustardOil', quantity: '', unit: 'ltr', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 150 },
      { id: '40', name: 'Rabri', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 5, pricePerUnit: 50 },
      { id: '41', name: 'Egg', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 5, pricePerUnit: 60 },
      { id: '42', name: 'Butter', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 55 },
    ],
  },
  {
    title: 'VEGETABLES',
    items: [
      { id: '38', name: 'Pata Gobhi', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 40 },
      { id: '39', name: 'Simla Mirch', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 60 },
      { id: '40', name: 'Tomato', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 30 },
      { id: '41', name: 'Carrot', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 40 },
      { id: '42', name: 'Garlic', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 120 },
      { id: '43', name: 'Adrak', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 80 },
      { id: '44', name: 'Onion', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 30 },
      { id: '45', name: 'Potato', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 25 },
      { id: '46', name: 'Spring Onion', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 60 },
      { id: '47', name: 'Dhania Pata', quantity: '', unit: 'bunch', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 15 },
      { id: '48', name: 'Pudina', quantity: '', unit: 'bunch', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 10 },
      { id: '49', name: 'Nimbu', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 4, pricePerUnit: 20 },
      { id: '51', name: 'Khira', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 20 },
      { id: '52', name: 'Broccoli', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 60 },
    ],
  },
  {
    title: 'SAUCES / FLAVOURS (ROL / HYPER PURE)',
    items: [
      { id: '53', name: 'Cheese', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 80 },
      { id: '54', name: 'Jalapeno Dip', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 60 },
      { id: '55', name: 'Oregano', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 20 },
      { id: '56', name: 'Aloo Tikki', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 40 },
      { id: '57', name: 'Chicken Patty', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 70 },
      { id: '58', name: 'Sugar Pouch', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 10 },
      { id: '59', name: 'Pizza Pasta Sauce', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 50 },
      { id: '60', name: 'Tomato Ketchup', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 30 },
      { id: '61', name: 'Momo Mayo', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 40 },
      { id: '62', name: 'Cheese Slice', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 60 },
      { id: '63', name: 'Peri Peri Masala', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 20 },
      { id: '64', name: 'White Sauce', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 40 },
      { id: '65', name: 'Chilly Flakes', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 20 },
      { id: '66', name: 'Veg Patty', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 40 },
      { id: '67', name: 'Funfood Mayo', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 40 },
    ],
  },
  {
    title: 'PACKING ITEMS (ROL / HYPER PURE)',
    items: [
      { id: '68', name: 'Large Pizza Box', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 15 },
      { id: '69', name: 'Small Pizza Box', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 10 },
      { id: '70', name: 'Round Small Box', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 8 },
      { id: '71', name: 'Wooden Fork', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 2 },
      { id: '72', name: 'Hot Coffee Box 150 ml', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 5 },
      { id: '72', name: 'Hot Coffee Box 200 ml', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 6 },
      { id: '73', name: 'Momos Chatani Box', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 4 },
      { id: '74', name: 'Butter Paper', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 20 },
      { id: '75', name: 'Momo Plate', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 3 },
      { id: '76', name: 'Pasta Bowl', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 25, pricePerUnit: 8 },
      { id: '77', name: 'Straw', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 1, pricePerUnit: 10 },
      { id: '78', name: 'Wooden Spoon', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 2 },
      { id: '79', name: 'Large Envelope', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 4 },
      { id: '80', name: 'Small Envelope', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 50, pricePerUnit: 3 },
      { id: '81', name: 'Tissues', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 5, pricePerUnit: 20 },
      { id: '82', name: 'Polybag', quantity: '', unit: 'kt', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 10 },
      { id: '83', name: 'Small Aluminium Box', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 25, pricePerUnit: 6 },
      { id: '84', name: 'Cold Coffee Box', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 25, pricePerUnit: 7 },
      { id: '84', name: 'Cold Coffee Box Packaging', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 25, pricePerUnit: 8 },
      { id: '85', name: 'Large Aluminium Box', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 25, pricePerUnit: 10 },
      { id: '86', name: 'Kulhad Tea', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 25, pricePerUnit: 8 },
      { id: '86', name: 'Kulhad Lassi', quantity: '', unit: 'pcs', available: false, notAvailable: false, minRequired: 15, pricePerUnit: 8 },
      { id: '87', name: 'Coffee Stick', quantity: '', unit: 'kg', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 15 },
    ],
  },
  {
    title: 'MOCKTAILS / MILKSHAKE',
    items: [
      { id: '88', name: 'Lemon Ice Tea', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 60 },
      { id: '89', name: 'Green Apple', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 60 },
      { id: '90', name: 'Vanilla', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 60 },
      { id: '91', name: 'Peach Passion', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 60 },
      { id: '92', name: 'Chocolate Sauce', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 70 },
      { id: '93', name: 'Strawberry Milk Shake', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 70 },
      { id: '94', name: 'Watermelon', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 60 },
      { id: '95', name: 'Butterscotch', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 60 },
      { id: '96', name: 'Hazelnut', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 70 },
      { id: '97', name: 'Mango', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 60 },
      { id: '98', name: 'Mint Mojito', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 60 },
      { id: '99', name: 'Orange', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 60 },
      { id: '100', name: 'Strawberry Mocktail', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 60 },
      { id: '101', name: 'Soda', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 20 },
      { id: '102', name: 'Water Bottle', quantity: '', unit: 'btl', available: false, notAvailable: false, minRequired: 0.5, pricePerUnit: 20 },
    ],
  },
  {
    title: 'MASALA',
    items: [
      { id: '103', name: 'Mirch Powder', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 30 },
      { id: '104', name: 'Garam Masala', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 40 },
      { id: '105', name: 'Haldi Powder', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 20 },
      { id: '106', name: 'Chicken Masala', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 35 },
      { id: '107', name: 'Chat Masala', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 25 },
      { id: '108', name: 'Dhania Powder', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 20 },
      { id: '109', name: 'Kali Mirch', quantity: '', unit: 'pkt', available: false, notAvailable: false, minRequired: 2, pricePerUnit: 35 },
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
      submissionDate: new Date(),
      sections: sections // <-- Add this line to include categories!
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

  // Helper to convert entered quantity to minRequired unit
  const convertToBaseUnit = (qty: number, fromUnit: string, baseUnit: string): number => {
    if (fromUnit === baseUnit) return qty;
    if (fromUnit === 'g' && baseUnit === 'kg') return qty / 1000;
    if (fromUnit === 'kg' && baseUnit === 'g') return qty * 1000;
    if (fromUnit === 'ml' && baseUnit === 'ltr') return qty / 1000;
    if (fromUnit === 'ltr' && baseUnit === 'ml') return qty * 1000;
    return qty;
  };

  function toCamelCaseLabel(str: string) {
    if (!str) return '';
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase())
      .replace(/\s+/g, ' ')
      .trim();
  }

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
                          <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700">Available Quantity</th>
                          <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700">Required</th>
                          {/* <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700">Price</th> */}
                          <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700">Available</th>
                          <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700">Not Available</th>
                          <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.items.map((item, itemIdx) => {
                          let enteredQty = parseFloat(item.quantity) || 0;
                          let minRequired = item.minRequired || 0;
                          let pricePerUnit = item.pricePerUnit || 0;
                          let baseUnit = item.unit;
                          let enteredUnit = customUnits[item.id] || item.unit;

                          // Always convert enteredQty to baseUnit for price calculation
                          let qtyForPrice = convertToBaseUnit(enteredQty, enteredUnit, baseUnit);

                          let requiredQty = 0;
                          // let price = 0; // Hide price calculation for now
                          if (item.available) {
                            requiredQty = 0;
                          } else if (item.notAvailable) {
                            requiredQty = minRequired;
                          } else {
                            requiredQty = Math.max(minRequired - qtyForPrice, 0);
                          }
                          return (
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
                                    <option value={customUnits[item.id] || item.unit}>
                                      {customUnits[item.id] || item.unit}
                                    </option>
                                    {allUnits
                                      .filter(u => u !== (customUnits[item.id] || item.unit))
                                      .map(u => (
                                        <option key={u} value={u}>{u}</option>
                                      ))}
                                  </select>
                                </div>
                              </td>
                              <td className="border border-gray-200 p-3 text-center">
                                {minRequired} {baseUnit}
                                {qtyForPrice > 0 && qtyForPrice < minRequired && (
                                  <div className="text-xs text-red-600">Required: {minRequired} {baseUnit}</div>
                                )}
                              </td>
                              {/* Price column hidden for now */}
                              {/* <td className="border border-gray-200 p-3 text-center">
                                {requiredQty > 0 && pricePerUnit > 0
                                  ? `₹${price.toFixed(2)}`
                                  : '-'}
                              </td> */}
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
                          );
                        })}
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
