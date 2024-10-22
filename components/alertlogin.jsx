import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const LoginNotification = ({ isLoggedIn, username }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 5000); // Hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  if (!show) return null;

  return (
    <Alert className="fixed top-4 right-4 w-72 bg-green-100 border-green-400">
      <AlertTitle className="text-green-800 font-semibold">Welcome!</AlertTitle>
      <AlertDescription className="text-green-700">
        You've successfully logged in, {username}.
      </AlertDescription>
      <X
        className="absolute top-2 right-2 cursor-pointer text-green-600 hover:text-green-800"
        size={18}
        onClick={() => setShow(false)}
      />
    </Alert>
  );
};

export default LoginNotification;