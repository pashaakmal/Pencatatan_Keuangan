import React from 'react';
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  type?: 'income' | 'expense' | 'balance';
}

export function SummaryCard({ title, amount, icon: Icon, type = 'balance' }: SummaryCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTextColor = () => {
    if (type === 'income') return 'text-green-600';
    if (type === 'expense') return 'text-red-600';
    return 'text-blue-600';
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">
          {title}
        </h3>
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="mt-2">
        <div className={`text-2xl font-bold ${getTextColor()}`}>
          {formatCurrency(amount)}
        </div>
        <p className="text-xs text-gray-500">
          Bulan ini
        </p>
      </div>
    </div>
  );
}
