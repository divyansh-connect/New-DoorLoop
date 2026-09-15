import React, { useState } from 'react';
import { X, Mail, CheckCircle, Wrench, User, Send, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';

interface InboxAddonSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkOrderCreated?: (woData: any) => void;
}

interface EmailItem {
  id: string;
  sender: string;
  email: string;
  subject: string;
  date: string;
  preview: string;
  unit: string;
  property: string;
}

const MOCK_EMAILS: EmailItem[] = [
  {
    id: 'em-1',
    sender: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    subject: 'Urgent: Water leak in Master Bathroom ceiling',
    date: '10 mins ago',
    preview: 'Hi James, water is dripping heavily from the master bathroom ceiling right above the shower. Please send maintenance ASAP!',
    unit: 'Unit 402',
    property: 'Sunset Apartments',
  },
  {
    id: 'em-2',
    sender: 'Robert Chen',
    email: 'robert.chen@example.com',
    subject: 'Question regarding parking permit renewal for October',
    date: '1 hour ago',
    preview: 'Hello management team, I wanted to know if my parking tag #B-14 will automatically renew next month or if I need to submit forms.',
    unit: 'Unit 108',
    property: 'Highland Oaks',
  },
];

export const InboxAddonSimulatorModal: React.FC<InboxAddonSimulatorModalProps> = ({
  isOpen,
  onClose,
  onWorkOrderCreated,
}) => {
  const [provider, setProvider] = useState<'gmail' | 'outlook'>('gmail');
  const [selectedEmail, setSelectedEmail] = useState<EmailItem>(MOCK_EMAILS[0]);
  const [activeTab, setActiveTab] = useState<'details' | 'actions' | 'reply'>('actions');
  const [notification, setNotification] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogToCRM = () => {
    showToast(`Logged email from ${selectedEmail.sender} to Tenant CRM history successfully!`);
  };

  const handleCreateWorkOrder = () => {
    const newWo = {
      id: `WO-${Math.floor(100 + Math.random() * 900)}`,
      title: selectedEmail.subject,
      description: selectedEmail.preview,
      property: selectedEmail.property,
      unit: selectedEmail.unit,
      tenant: selectedEmail.sender,
      priority: 'HIGH',
      status: 'OPEN',
      category: 'Plumbing',
    };
    if (onWorkOrderCreated) {
      onWorkOrderCreated(newWo);
    }
    showToast(`Created Maintenance Work Order #${newWo.id} from email!`);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    showToast(`Reply dispatched to ${selectedEmail.email} via ${provider === 'gmail' ? 'Gmail' : 'Outlook 365'}!`);
    setReplyText('');
  };

  const handleApplyTemplate = (template: string) => {
    if (template === 'maintenance') {
      setReplyText(`Hi ${selectedEmail.sender},\n\nWe have received your request regarding "${selectedEmail.subject}". Our maintenance team has been dispatched and will inspect the unit shortly.\n\nBest regards,\nProperty Management`);
    } else if (template === 'received') {
      setReplyText(`Hi ${selectedEmail.sender},\n\nThank you for reaching out. We have logged your request in our DoorLoop system and will follow up with you within 24 hours.\n\nBest regards,\nDoorLoop CRM System`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-foreground flex flex-col md:flex-row h-[600px]">
        {/* Left Side: Email Inbox Mock */}
        <div className="w-full md:w-1/2 border-r border-border flex flex-col bg-muted/20">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${provider === 'gmail' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">
                  {provider === 'gmail' ? 'Gmail Workspace' : 'Outlook 365'} Simulator
                </h3>
                <p className="text-xs text-muted-foreground">DoorLoop Add-on Side Panel Active</p>
              </div>
            </div>

            {/* Provider Toggle */}
            <div className="flex items-center bg-muted p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setProvider('gmail')}
                className={`px-2.5 py-1 rounded-md transition-all ${provider === 'gmail' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                Gmail
              </button>
              <button
                onClick={() => setProvider('outlook')}
                className={`px-2.5 py-1 rounded-md transition-all ${provider === 'outlook' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                Outlook
              </button>
            </div>
          </div>

          {/* Email List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {MOCK_EMAILS.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedEmail.id === email.id ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-muted/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-foreground">{email.sender}</span>
                  <span className="text-[10px] text-muted-foreground">{email.date}</span>
                </div>
                <h4 className="text-xs font-semibold text-foreground/90 truncate">{email.subject}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{email.preview}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                    {email.property} - {email.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: DoorLoop Add-on Side Panel */}
        <div className="w-full md:w-1/2 flex flex-col bg-card">
          {/* Side Panel Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <div>
                <h4 className="font-bold text-sm text-foreground">DoorLoop CRM Extension</h4>
                <p className="text-[11px] text-muted-foreground">Auto-matched to Tenant CRM Record</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toast Notification */}
          {notification && (
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-500 p-3 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Selected Email Tenant Summary Card */}
          <div className="p-4 bg-muted/30 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                  {selectedEmail.sender[0]}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-foreground">{selectedEmail.sender}</h5>
                  <p className="text-[11px] text-muted-foreground">{selectedEmail.email}</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Active Tenant
              </span>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="flex border-b border-border text-xs font-semibold">
            <button
              onClick={() => setActiveTab('actions')}
              className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
                activeTab === 'actions'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Quick Actions
            </button>
            <button
              onClick={() => setActiveTab('reply')}
              className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
                activeTab === 'reply'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Template Reply
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {activeTab === 'actions' && (
              <div className="space-y-3">
                <div className="p-3 border border-border rounded-xl bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-xs">Log to CRM History</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Save this thread directly into {selectedEmail.sender}'s CRM timeline for future reference.
                  </p>
                  <Button size="sm" variant="outline" onClick={handleLogToCRM} className="w-full text-xs font-semibold">
                    Log Email Thread
                  </Button>
                </div>

                <div className="p-3 border border-primary/30 rounded-xl bg-primary/5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-primary" />
                    <span className="font-bold text-xs">Convert to Maintenance Ticket</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Auto-fill ticket details from this email and route to vendor assignment queue.
                  </p>
                  <Button size="sm" onClick={handleCreateWorkOrder} className="w-full text-xs font-semibold gap-1">
                    <Wrench className="w-3.5 h-3.5" />
                    Create Work Order
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'reply' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyTemplate('maintenance')}
                    className="text-[11px] font-semibold flex-1 py-1"
                  >
                    + Maintenance Template
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApplyTemplate('received')}
                    className="text-[11px] font-semibold flex-1 py-1"
                  >
                    + Received Acknowledgment
                  </Button>
                </div>

                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type or select a template reply..."
                  className="w-full h-32 p-3 text-xs bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
                />

                <Button size="sm" onClick={handleSendReply} className="w-full text-xs font-semibold gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Email Reply
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default InboxAddonSimulatorModal;
