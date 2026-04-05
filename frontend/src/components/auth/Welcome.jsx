import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { LogOut, Mail, User, CheckCircle, XCircle } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    try {
      const userInfo = JSON.parse(userData);
      setUser(userInfo);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center border-b pb-8">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                {user.avatar && <AvatarImage src={user.avatar} alt={user.fullName} />}
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-3xl font-bold">
              Welcome, {user.fullName}!
            </CardTitle>
            <p className="text-gray-500 mt-2">
              You are now logged in
              {user.provider === 'google' && ' with Google'}
            </p>
            <div className="flex justify-center mt-4">
              {user.isEmailVerified ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" /> Verified
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" /> Unverified
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <h3 className="text-lg font-semibold">Your Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-medium">{user.fullName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">Username</p>
                  <p className="font-medium">@{user.username}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              {user.provider === 'google' && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {/* Use a simple text indicator instead of icon */}
                  <div className="h-5 w-5 flex items-center justify-center text-orange-500 font-bold">G</div>
                  <div>
                    <p className="text-xs text-gray-500">Login Method</p>
                    <p className="font-medium">Google OAuth</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          <Separator />
          
          <CardFooter className="pt-6">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;