'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2, Clock, CreditCard } from 'lucide-react';

interface Fee {
  id: number;
  academic_year: string;
  semester: number;
  amount: number;
  description: string;
  due_date: string;
  paid_amount: number;
  payment_status: string;
}

interface Payment {
  id: number;
  amount: number;
  payment_type: string;
  reference_number: string;
  payment_date: string;
  status: string;
  fee_description: string;
}

export default function PaymentsPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'fees' | 'scratch' | 'history'>('fees');
  const [paymentForm, setPaymentForm] = useState({
    scratchCardNumber: '',
    scratchCardPin: '',
  });
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await fetch('/api/payments');
      if (response.ok) {
        const data = await response.json();
        setFees(data.fees);
        setPaymentHistory(data.paymentHistory);
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScratchCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage('');

    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 0,
          paymentType: 'scratch_card',
          scratchCardNumber: paymentForm.scratchCardNumber,
          scratchCardPin: paymentForm.scratchCardPin,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Success! Reference: ${data.referenceNumber}`);
        setPaymentForm({ scratchCardNumber: '', scratchCardPin: '' });
        loadPayments();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Payment failed');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFeePayment = async (fee: Fee) => {
    setSelectedFee(fee);
    setActiveTab('scratch');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 size={20} className="text-green-600" />;
      case 'pending':
        return <Clock size={20} className="text-amber-600" />;
      case 'partial':
        return <AlertCircle size={20} className="text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-amber-50 text-amber-700';
      case 'partial':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  if (isLoading) {
    return <div className="text-center text-slate-500">Loading payments...</div>;
  }

  const totalOutstanding = fees
    .filter((f) => f.payment_status !== 'paid')
    .reduce((sum, f) => sum + (f.amount - f.paid_amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Payments & Fees</h1>
        <p className="mt-2 text-slate-600">Manage your school fees and make payments</p>
      </div>

      {/* Outstanding Balance Summary */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-red-900">Outstanding Balance</CardTitle>
            <CardDescription className="text-red-700">Amount due for payment</CardDescription>
          </div>
          <AlertCircle className="h-8 w-8 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">${totalOutstanding.toFixed(2)}</div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('fees')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
            activeTab === 'fees'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard size={18} />
          School Fees
        </button>
        <button
          onClick={() => setActiveTab('scratch')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'scratch'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Use Scratch Card
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Payment History
        </button>
      </div>

      {/* School Fees Tab */}
      {activeTab === 'fees' && (
        <div className="space-y-4">
          {fees.length > 0 ? (
            fees.map((fee) => (
              <Card key={fee.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>{fee.description}</CardTitle>
                    <CardDescription>
                      {fee.academic_year} - Semester {fee.semester}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(fee.payment_status)}
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(fee.payment_status)}`}>
                      {fee.payment_status.charAt(0).toUpperCase() + fee.payment_status.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Total Amount</p>
                      <p className="text-lg font-semibold">${fee.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Paid</p>
                      <p className="text-lg font-semibold text-green-600">${fee.paid_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Outstanding</p>
                      <p className="text-lg font-semibold text-red-600">
                        ${(fee.amount - fee.paid_amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="bg-green-600 transition-all"
                        style={{
                          width: `${((fee.paid_amount / fee.amount) * 100) || 0}%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {Math.round((fee.paid_amount / fee.amount) * 100)}% paid
                    </p>
                  </div>

                  {fee.payment_status !== 'paid' && (
                    <Button
                      onClick={() => handleFeePayment(fee)}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Pay with Scratch Card
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="rounded-lg bg-slate-50 p-8 text-center">
              <p className="text-slate-500">No fees found</p>
            </div>
          )}
        </div>
      )}

      {/* Scratch Card Tab */}
      {activeTab === 'scratch' && (
        <Card>
          <CardHeader>
            <CardTitle>Pay with Scratch Card</CardTitle>
            <CardDescription>
              {selectedFee
                ? `Paying ${selectedFee.description}`
                : 'Enter your scratch card details to make a payment'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScratchCardPayment} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="scratchCardNumber" className="text-sm font-medium">
                  Scratch Card Number
                </label>
                <Input
                  id="scratchCardNumber"
                  placeholder="Enter card number"
                  value={paymentForm.scratchCardNumber}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      scratchCardNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="scratchCardPin" className="text-sm font-medium">
                  PIN Code
                </label>
                <Input
                  id="scratchCardPin"
                  type="password"
                  placeholder="Enter PIN code"
                  value={paymentForm.scratchCardPin}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      scratchCardPin: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {message && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    message.includes('Success')
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? 'Processing...' : 'Process Payment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Payment History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {paymentHistory.length > 0 ? (
            paymentHistory.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="flex items-center justify-between pt-6">
                  <div>
                    <p className="font-medium text-slate-900">
                      {payment.payment_type === 'school_fees'
                        ? payment.fee_description || 'School Fee'
                        : 'Scratch Card Payment'}
                    </p>
                    <p className="text-sm text-slate-500">{payment.reference_number}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">
                      +${payment.amount.toFixed(2)}
                    </p>
                    <span className={`text-xs font-semibold ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="rounded-lg bg-slate-50 p-8 text-center">
              <p className="text-slate-500">No payment history</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
