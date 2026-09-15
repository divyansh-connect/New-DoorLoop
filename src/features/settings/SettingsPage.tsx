import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Loader2, Mail, Smartphone, CheckCircle, ExternalLink } from 'lucide-react';
import { InboxAddonSimulatorModal } from '../../components/InboxAddonSimulatorModal';
import { JamesPhoneSimulatorModal } from '../../components/JamesPhoneSimulatorModal';

const settingsSchema = zod.object({
  companyName: zod.string().min(1, 'Company Name is required'),
  contactEmail: zod.string().email('Invalid contact email'),
  currency: zod.string().min(1, 'Currency is required'),
  dateFormat: zod.string().min(1, 'Date Format is required'),
  enableSmsNotifications: zod.boolean(),
  enableEmailNotifications: zod.boolean(),
});

type SettingsFormValues = zod.infer<typeof settingsSchema>;

export const SettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isInboxModalOpen, setIsInboxModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.settings.get(),
  });

  const updateMutation = useMutation({
    mutationFn: (values: SettingsFormValues) => api.settings.update(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSuccessMessage('Settings updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    values: settings, // dynamically load queried data
  });

  const onSubmit = (values: SettingsFormValues) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Settings"
        description="Configure agency rules, branding, default dates, and communications notifications."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Settings' },
        ]}
      />

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-6 animate-fade-in">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 border border-border rounded-2xl shadow-sm text-foreground">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Company Name</label>
            <Input {...register('companyName')} />
            {errors.companyName && <p className="text-rose-500 text-xs">{errors.companyName.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Contact Email</label>
            <Input type="email" {...register('contactEmail')} />
            {errors.contactEmail && <p className="text-rose-500 text-xs">{errors.contactEmail.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">System Currency</label>
            <Select {...register('currency')}>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Date Format</label>
            <Select {...register('dateFormat')}>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </Select>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-sm text-foreground uppercase border-b pb-2">Notifications Setup</h3>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="enableEmail"
              {...register('enableEmailNotifications')}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor="enableEmail" className="text-sm font-semibold cursor-pointer">
              Enable dispatch of automated email receipts to tenants
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="enableSms"
              {...register('enableSmsNotifications')}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor="enableSms" className="text-sm font-semibold cursor-pointer">
              Enable SMS notifications for maintenance work assignments
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Save Settings
          </Button>
        </div>
      </form>

      {/* Integrations Marketplace Section */}
      <div className="mt-10 space-y-6">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Integrations Marketplace</h2>
            <p className="text-xs text-muted-foreground">
              Connect external communication channels, mail clients, and automated SMS deep-linking workflows.
            </p>
          </div>
          <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-full">
            2 Active Integrations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gmail & Outlook Add-on Card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Gmail & Outlook 365 Add-on</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-1">
                    <CheckCircle className="w-3 h-3" /> Active & Connected
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Log incoming emails to Tenant CRM history, convert email threads into Maintenance Work Orders, and dispatch pre-approved reply templates right inside Gmail or Outlook.
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-border/60">
              <span className="text-[11px] font-medium text-muted-foreground">Provider: Google / Microsoft</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInboxModalOpen(true)}
                className="text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Launch Add-on Simulator
              </Button>
            </div>
          </div>

          {/* Twilio SMS Deep Links Card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Twilio SMS Deep-Links</h3>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-1">
                    <CheckCircle className="w-3 h-3" /> Active & Connected
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Send instant Twilio SMS notifications to Property Managers ("Text to James Phone") containing deep link URLs that open target Work Order ticket detail screens instantly.
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-border/60">
              <span className="text-[11px] font-medium text-muted-foreground">Gateway: Twilio API v2</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPhoneModalOpen(true)}
                className="text-xs font-semibold gap-1.5 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
              >
                <Smartphone className="w-3.5 h-3.5" />
                Test James Phone Simulator
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Modals */}
      <InboxAddonSimulatorModal isOpen={isInboxModalOpen} onClose={() => setIsInboxModalOpen(false)} />
      <JamesPhoneSimulatorModal isOpen={isPhoneModalOpen} onClose={() => setIsPhoneModalOpen(false)} />
    </div>
  );
};
export default SettingsPage;
