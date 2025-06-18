import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Coffee, Package, ArrowLeft, User } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  quantity: string;
  unit: 'kg' | 'pkt' | 'ltr' | 'pcs';
  available: boolean;
  notAvailable: boolean;
}

interface InventoryFormProps {
  onBack: () => void;
  onSubmit: (data: { submitterName: string; items: InventoryItem[]; submissionDate: Date }) => void;
}

const InventoryForm = ({ onBack, onSubmit }: InventoryFormProps) => {
  const [submitterName, setSubmitterName] = useState('');
  const [items, setItems] = useState<InventoryItem[]>([
    { id: '1', name: 'Coffee Beans', quantity: '', unit: 'kg', available: false, notAvailable: false },
    { id: '2', name: 'Sugar', quantity: '', unit: 'kg', available: false, notAvailable: false },
    { id: '3', name: 'Milk Powder', quantity: '', unit: 'pkt', available: false, notAvailable: false },
    { id: '4', name: 'Tea Leaves', quantity: '', unit: 'kg', available: false, notAvailable: false },
    { id: '5', name: 'Biscuits', quantity: '', unit: 'pkt', available: false, notAvailable: false },
    { id: '6', name: 'Bread', quantity: '', unit: 'pcs', available: false, notAvailable: false },
    { id: '7', name: 'Butter', quantity: '', unit: 'kg', available: false, notAvailable: false },
    { id: '8', name: 'Jam', quantity: '', unit: 'pcs', available: false, notAvailable: false },
  ]);

  const resetForm = () => {
    setItems([
      { id: '1', name: 'Coffee Beans', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '2', name: 'Sugar', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '3', name: 'Milk Powder', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '4', name: 'Tea Leaves', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '5', name: 'Biscuits', quantity: '', unit: 'pkt', available: false, notAvailable: false },
      { id: '6', name: 'Bread', quantity: '', unit: 'pcs', available: false, notAvailable: false },
      { id: '7', name: 'Butter', quantity: '', unit: 'kg', available: false, notAvailable: false },
      { id: '8', name: 'Jam', quantity: '', unit: 'pcs', available: false, notAvailable: false },
    ]);
  };

  const updateItem = (id: string, field: keyof InventoryItem, value: any) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
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
      })
    );
  };

  const addNewItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: '',
      quantity: '',
      unit: 'kg',
      available: false,
      notAvailable: false
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitterName.trim()) {
      alert('Please enter your name before submitting');
      return;
    }
    
    const submissionData = {
      submitterName: submitterName.trim(),
      items: items,
      submissionDate: new Date()
    };
    
    onSubmit(submissionData);
    
    // Reset form after submission
    setSubmitterName('');
    resetForm();
  };

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

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Inventory Items</h3>
                </div>
                <Badge variant="outline" className="text-amber-600 border-amber-200">
                  {items.length} Items
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
                    {items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                        <td className="border border-gray-200 p-3">
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            placeholder="Enter item name"
                            className="border-0 focus-visible:ring-0 bg-transparent"
                          />
                        </td>
                        <td className="border border-gray-200 p-3">
                          <div className="flex gap-2">
                            <Input
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                              placeholder="0"
                              className="border-0 focus-visible:ring-0 bg-transparent flex-1"
                            />
                            <select
                              value={item.unit}
                              onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                              className="border border-gray-200 rounded px-2 py-1 text-sm"
                            >
                              <option value="kg">kg</option>
                              <option value="pkt">pkt</option>
                              <option value="ltr">ltr</option>
                              <option value="pcs">pcs</option>
                            </select>
                          </div>
                        </td>
                        <td className="border border-gray-200 p-3 text-center">
                          <Checkbox
                            checked={item.available}
                            onCheckedChange={(checked) => updateItem(item.id, 'available', checked)}
                          />
                        </td>
                        <td className="border border-gray-200 p-3 text-center">
                          <Checkbox
                            checked={item.notAvailable}
                            onCheckedChange={(checked) => updateItem(item.id, 'notAvailable', checked)}
                          />
                        </td>
                        <td className="border border-gray-200 p-3 text-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
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
                  onClick={addNewItem}
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Add Item
                </Button>
                
                <Button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                >
                  Submit & View Details
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryForm;
