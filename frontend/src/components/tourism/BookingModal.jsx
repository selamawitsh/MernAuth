import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Calendar, Users, MapPin, Phone, Mail, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BookingModal = ({ isOpen, onClose, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    destination: '',
    package: '',
    travelers: 1,
    checkIn: '',
    checkOut: '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const destinations = [
    { id: 'lalibela', name: 'Lalibela Rock Churches', price: 450 },
    { id: 'simien', name: 'Simien Mountains', price: 380 },
    { id: 'axum', name: 'Axum Historical Sites', price: 320 },
    { id: 'afar', name: 'Danakil Depression', price: 520 },
    { id: 'omo', name: 'Omo Valley Tribes', price: 480 }
  ];

  const packages = [
    { id: 'standard', name: 'Standard Package', description: 'Essential experience with basic accommodations' },
    { id: 'premium', name: 'Premium Package', description: 'Enhanced experience with better accommodations' },
    { id: 'luxury', name: 'Luxury Package', description: 'Ultimate experience with luxury accommodations' }
  ];

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    const destination = destinations.find(d => d.id === bookingData.destination);
    const basePrice = destination ? destination.price : 0;
    const packageMultiplier = bookingData.package === 'premium' ? 1.3 : bookingData.package === 'luxury' ? 1.8 : 1;
    return Math.round(basePrice * packageMultiplier * bookingData.travelers);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', bookingData);
    alert('Booking confirmed! You will receive a confirmation email shortly.');
    onClose();
  };

  const steps = [
    { number: 1, title: 'Destination & Package' },
    { number: 2, title: 'Travel Details' },
    { number: 3, title: 'Personal Information' },
    { number: 4, title: 'Payment' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-yellow-400 p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-2">Book Your Ethiopian Adventure</h2>
              <p className="text-green-100">Discover the wonders of Ethiopia with our expert guides</p>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentStep >= step.number
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {currentStep > step.number ? <CheckCircle className="w-4 h-4" /> : step.number}
                    </motion.div>
                    <span className={`ml-2 text-sm ${currentStep >= step.number ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`w-12 h-0.5 mx-4 ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">Choose Your Destination</Label>
                    <div className="grid gap-3">
                      {destinations.map((dest) => (
                        <motion.div
                          key={dest.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            bookingData.destination === dest.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                          onClick={() => handleInputChange('destination', dest.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{dest.name}</h3>
                              <p className="text-sm text-gray-600">Starting from ${dest.price}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              bookingData.destination === dest.id
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}>
                              {bookingData.destination === dest.id && (
                                <CheckCircle className="w-3 h-3 text-white m-0.5" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-lg font-semibold mb-4 block">Select Package</Label>
                    <div className="grid gap-3">
                      {packages.map((pkg) => (
                        <motion.div
                          key={pkg.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            bookingData.package === pkg.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                          onClick={() => handleInputChange('package', pkg.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{pkg.name}</h3>
                              <p className="text-sm text-gray-600">{pkg.description}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                              bookingData.package === pkg.id
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}>
                              {bookingData.package === pkg.id && (
                                <CheckCircle className="w-3 h-3 text-white m-0.5" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4" />
                        Check-in Date
                      </Label>
                      <Input
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) => handleInputChange('checkIn', e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4" />
                        Check-out Date
                      </Label>
                      <Input
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) => handleInputChange('checkOut', e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4" />
                      Number of Travelers
                    </Label>
                    <Select value={bookingData.travelers.toString()} onValueChange={(value) => handleInputChange('travelers', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Traveler' : 'Travelers'}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Special Requests (Optional)</Label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={3}
                      placeholder="Any special requirements or preferences..."
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </Label>
                      <Input
                        type="text"
                        value={bookingData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Booking Summary */}
                  <Card className="bg-gray-50">
                    <CardHeader>
                      <CardTitle className="text-lg">Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Destination:</span>
                        <span className="font-medium">
                          {destinations.find(d => d.id === bookingData.destination)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Package:</span>
                        <span className="font-medium capitalize">{bookingData.package}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Travelers:</span>
                        <span className="font-medium">{bookingData.travelers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span className="font-medium">{bookingData.checkIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span className="font-medium">{bookingData.checkOut}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">${calculateTotal()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Form */}
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4" />
                        Card Number
                      </Label>
                      <Input
                        type="text"
                        value={bookingData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        className="w-full"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block">Expiry Date</Label>
                        <Input
                          type="text"
                          value={bookingData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>

                      <div>
                        <Label className="mb-2 block">CVV</Label>
                        <Input
                          type="text"
                          value={bookingData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Cardholder Name</Label>
                      <Input
                        type="text"
                        value={bookingData.cardName}
                        onChange={(e) => handleInputChange('cardName', e.target.value)}
                        className="w-full"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!bookingData.destination || !bookingData.package)) ||
                    (currentStep === 2 && (!bookingData.checkIn || !bookingData.checkOut)) ||
                    (currentStep === 3 && (!bookingData.fullName || !bookingData.email || !bookingData.phone))
                  }
                  className="bg-gradient-to-r from-green-500 to-yellow-400 text-white"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!bookingData.cardNumber || !bookingData.expiryDate || !bookingData.cvv || !bookingData.cardName}
                  className="bg-gradient-to-r from-green-500 to-yellow-400 text-white"
                >
                  Complete Booking
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;