
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, Clock, CalendarDays, Download, Plus, CreditCardIcon, DollarSign, FileText, AlertCircle, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const BillingPage: React.FC = () => {
  // Mock subscription data
  const subscription = {
    plan: "Premium",
    status: "Active",
    nextBillingDate: "November 15, 2023",
    amount: "$19.99",
    billingCycle: "Monthly",
    paymentMethod: {
      type: "Credit Card",
      lastFour: "4242",
      expiry: "09/25"
    }
  };
  
  // Mock invoice data
  const invoices = [
    {
      id: "INV-001",
      date: "October 15, 2023",
      amount: "$19.99",
      status: "Paid"
    },
    {
      id: "INV-002",
      date: "September 15, 2023",
      amount: "$19.99",
      status: "Paid"
    },
    {
      id: "INV-003",
      date: "August 15, 2023",
      amount: "$19.99",
      status: "Paid"
    }
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 pt-28 pb-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Billing</span>
          </div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription, payment methods, and billing history
          </p>
        </div>
        
        <Tabs defaultValue="subscription">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    Details about your current subscription plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{subscription.plan} Plan</h3>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="bg-green-50 text-green-700 mr-2">
                          {subscription.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          Renews on {subscription.nextBillingDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{subscription.amount}</p>
                      <p className="text-sm text-muted-foreground">per {subscription.billingCycle.toLowerCase()}</p>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium mb-2">Plan Features:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Business Plan Generation</p>
                          <p className="text-sm text-muted-foreground">Create comprehensive business plans</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Document Storage</p>
                          <p className="text-sm text-muted-foreground">Access to all premium documents</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Market Analysis</p>
                          <p className="text-sm text-muted-foreground">Detailed market analysis for ideas</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Priority Support</p>
                          <p className="text-sm text-muted-foreground">Get help faster when you need it</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 bg-muted/50 justify-between">
                  <Button variant="outline">Cancel Subscription</Button>
                  <div className="flex gap-3">
                    <Button variant="outline">Change Plan</Button>
                    <Button>Manage Billing</Button>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>
                    Your active payment method
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl p-5 mb-4">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-xs mb-4 opacity-80">Current Payment Method</p>
                        <p className="font-medium">•••• •••• •••• {subscription.paymentMethod.lastFour}</p>
                      </div>
                      <CreditCardIcon className="h-8 w-8 opacity-80" />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs opacity-80">Expires: {subscription.paymentMethod.expiry}</p>
                      <p className="text-xs uppercase tracking-wider opacity-80">{subscription.paymentMethod.type}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Next Payment</span>
                      </div>
                      <div className="text-right">
                        <p>{subscription.amount}</p>
                        <p className="text-xs text-muted-foreground">{subscription.nextBillingDate}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Billing Cycle</span>
                      </div>
                      <span>{subscription.billingCycle}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Update Payment</Button>
                  <Button variant="outline">Billing Address</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-background border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-slate-900 text-white p-2 rounded-md mr-4">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in {subscription.paymentMethod.lastFour}</p>
                        <p className="text-sm text-muted-foreground">Expires {subscription.paymentMethod.expiry}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Default
                    </Badge>
                  </div>
                  
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Payment Method</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View and download your invoices and payment receipts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border-b last:border-0">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-4">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{invoice.id}</p>
                          <p className="text-sm text-muted-foreground">{invoice.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-medium">{invoice.amount}</p>
                          <Badge variant="outline" className="bg-green-50 text-green-700 mt-1">
                            {invoice.status}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toast.success(`Downloaded invoice ${invoice.id}`)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 flex justify-center">
                <Button variant="outline" className="w-full sm:w-auto">
                  View All Invoices
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="bg-primary/15 p-3 rounded-full mr-4">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Need help with billing?</h3>
                <p className="text-muted-foreground">Our support team is ready to assist you with any questions</p>
              </div>
            </div>
            <Button className="whitespace-nowrap">
              Contact Support
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BillingPage;
