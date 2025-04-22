import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import LoadingSpinner from './LoadingSpinner';

interface BusinessPlanGenerationModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

const BusinessPlanGenerationModal: React.FC<BusinessPlanGenerationModalProps> = ({ open, onClose, message }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generating Business Plan</DialogTitle>
          <DialogDescription>
            {message || 'Your business plan will be generated under 5 minutes. Please wait...'}
          </DialogDescription>
        </DialogHeader>
        <LoadingSpinner />
      </DialogContent>
    </Dialog>
  );
};

export default BusinessPlanGenerationModal;
