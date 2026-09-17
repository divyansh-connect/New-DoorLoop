import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Sparkles, Save, CheckCircle2, Edit2, X } from 'lucide-react';
import { useAuthStore } from '../../../store/useStore';
import { clsx } from 'clsx';

export const CompanySettingsPage: React.FC = () => {
  const { user, updateUserCompany } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.companyName || 'Apex Properties Inc.');
  const [address, setAddress] = useState('100 Pine Street, San Francisco, CA');
  const [timezone, setTimezone] = useState('EST');
  const [currency, setCurrency] = useState('USD');
  const [notification, setNotification] = useState<string | null>(null);

  // Queries
  const { data: currentSettings } = useQuery({
    queryKey: ['company-settings-data'],
    queryFn: async () => {
      const res = await api.settings.getGeneral();
      if (res?.companyName) {
        setName(res.companyName);
        updateUserCompany(res.companyName);
      }
      return res;
    },
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: any) => api.settings.updateGeneral(data),
    onSuccess: () => {
      updateUserCompany(name);
      setIsEditing(false);
      setNotification('Company configurations saved and updated globally across the app!');
      setTimeout(() => setNotification(null), 4000);
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ companyName: name, address, timezone, currency });
  };

  const handleCancel = () => {
    setName(user?.companyName || 'Apex Properties Inc.');
    setIsEditing(false);
  };

  const inputMutedClass = clsx(
    'transition-all duration-200',
    !isEditing && 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 pointer-events-none cursor-not-allowed opacity-90 font-medium'
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Profile"
        description="Configure default branding logo assets, regional date format templates, timezone offsets, and currency types."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Company Profile' }]}
      />

      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 max-w-2xl">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* GENERAL CONFIGURATIONS */}
      <div className="bg-card border border-border p-6 rounded-2xl max-w-2xl space-y-6 shadow-sm">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" /> Corporate Settings & Profile
          </h3>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="font-semibold text-xs h-8">
              <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleCancel} className="font-semibold text-xs text-slate-500 h-8">
              <X className="w-3.5 h-3.5 mr-1" /> Cancel
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Company Name</label>
            <Input
              value={name}
              disabled={!isEditing}
              onChange={(e) => setName(e.target.value)}
              className={inputMutedClass}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Corporate Headquarters Address</label>
            <Input
              value={address}
              disabled={!isEditing}
              onChange={(e) => setAddress(e.target.value)}
              className={inputMutedClass}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">System Timezone</label>
            <Select
              value={timezone}
              disabled={!isEditing}
              onChange={(e) => setTimezone(e.target.value)}
              className={inputMutedClass}
            >
              <option value="EST">EST (Eastern Standard Time)</option>
              <option value="PST">PST (Pacific Standard Time)</option>
              <option value="GMT">GMT (Greenwich Mean Time)</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Base Currency</label>
            <Select
              value={currency}
              disabled={!isEditing}
              onChange={(e) => setCurrency(e.target.value)}
              className={inputMutedClass}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </Select>
          </div>
        </div>

        {isEditing && (
          <div className="pt-4 border-t border-border/80 flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 px-5"
            >
              <Save className="w-4 h-4" /> Save Profile Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CompanySettingsPage;
