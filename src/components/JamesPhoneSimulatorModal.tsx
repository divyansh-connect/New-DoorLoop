import React, { useState } from 'react';
import { X, MessageSquare, Smartphone, ExternalLink, Wrench, Shield, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

interface JamesPhoneSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToWorkOrder?: (ticketId: string) => void;
}

export const JamesPhoneSimulatorModal: React.FC<JamesPhoneSimulatorModalProps> = ({
  isOpen,
  onClose,
  onNavigateToWorkOrder,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  if (!isOpen) return null;

  const mockSMS = {
    id: 'sms-108',
    ticketId: 'WO-108',
    sender: 'Twilio SMS System (+1 800-DOORLOOP)',
    timestamp: 'Just now',
    text: 'ALERT: New Urgent Work Order #WO-108 reported at Sunset Apartments (Unit 402) - "Water Leak in Master Bathroom".',
    deepLinkUrl: 'app.doorloop.com/wo/108',
    ticketDetails: {
      id: 'WO-108',
      title: 'Water Leak in Master Bathroom',
      tenant: 'Sarah Jenkins',
      property: 'Sunset Apartments',
      unit: 'Unit 402',
      priority: 'URGENT / HIGH',
      status: 'OPEN - Pending Dispatch',
      description: 'Water is dripping heavily from ceiling over master bathroom shower. Tenant requested immediate dispatch.',
      createdAt: 'September 15, 2026',
    },
  };

  const handleDeepLinkClick = () => {
    setSelectedTicket(mockSMS.ticketDetails);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border-4 border-slate-800 rounded-[40px] shadow-2xl overflow-hidden text-slate-100 flex flex-col h-[640px]">
        {/* Phone Notch & Top Bar */}
        <div className="bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-medium text-slate-400">
          <span>9:41 AM</span>
          <div className="w-16 h-3 bg-slate-800 rounded-full"></div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5">
              <div className="w-full h-full bg-emerald-400"></div>
            </div>
          </div>
        </div>

        {/* Messaging App Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white">James Phone Simulator</h3>
              <p className="text-[10px] text-slate-400">Twilio SMS Alert Workflow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SMS Screen Body */}
        <div className="flex-1 bg-slate-950 p-4 overflow-y-auto space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-semibold bg-slate-800/80 text-slate-400 px-3 py-1 rounded-full">
              Today 9:41 AM
            </span>
          </div>

          {/* Incoming SMS Bubble */}
          <div className="flex flex-col items-start max-w-[88%] space-y-1">
            <span className="text-[10px] text-slate-400 font-medium pl-1">{mockSMS.sender}</span>
            <div className="bg-slate-800 border border-slate-700/60 rounded-2xl rounded-tl-sm p-3.5 shadow-md space-y-2 text-xs">
              <p className="text-slate-200 leading-relaxed">{mockSMS.text}</p>
              
              {/* Deep Link Button */}
              <button
                onClick={handleDeepLinkClick}
                className="w-full mt-2 bg-primary/20 border border-primary/40 text-primary-foreground hover:bg-primary/30 p-2.5 rounded-xl font-bold flex items-center justify-between text-xs transition-all group"
              >
                <div className="flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary font-mono text-[11px] underline">
                    {mockSMS.deepLinkUrl}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Selected Ticket Preview Card (when deep link tapped) */}
          {selectedTicket && (
            <div className="mt-4 border-2 border-primary bg-slate-900 rounded-2xl p-4 shadow-xl text-xs space-y-3 animate-slide-up">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Deep Link Resolved!</span>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {selectedTicket.id}
                </span>
                <h4 className="font-bold text-sm text-white mt-1">{selectedTicket.title}</h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">TENANT</span>
                  <span className="font-semibold text-slate-200">{selectedTicket.tenant}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PROPERTY</span>
                  <span className="font-semibold text-slate-200">{selectedTicket.property}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PRIORITY</span>
                  <span className="font-bold text-rose-400">{selectedTicket.priority}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">STATUS</span>
                  <span className="font-semibold text-amber-400">{selectedTicket.status}</span>
                </div>
              </div>

              <Button
                size="sm"
                onClick={() => {
                  if (onNavigateToWorkOrder) onNavigateToWorkOrder(selectedTicket.id);
                  onClose();
                }}
                className="w-full text-xs font-bold gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Wrench className="w-3.5 h-3.5" />
                Open Full Work Order Detail Screen
              </Button>
            </div>
          )}
        </div>

        {/* Smartphone Home Bar */}
        <div className="bg-slate-950 p-2 flex justify-center">
          <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
export default JamesPhoneSimulatorModal;
