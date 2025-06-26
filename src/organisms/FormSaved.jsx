import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/atoms/button';
import { Card, CardContent } from '@/molecules/card';
import { CheckSquare } from 'lucide-react';
import NavBar from "@/organisms/NavBar";

const FormSaved = ({ onCreateAnother }) => {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar/>
      <div className="mt-12 mx-8 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <CheckSquare className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You have successfully built a form</h2>
          <p className="text-gray-600 mb-6">
            Your form has been saved and is ready to use.
          </p>
          <div className="space-y-2">
            <Button onClick={() => navigate('/')} className="w-full">
              Back to Forms
            </Button>
            <Button 
              variant="outline" 
              onClick={onCreateAnother}
              className="w-full"
            >
              Create Another Form
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>    
  );
};

export default FormSaved;