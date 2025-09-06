'use client';

import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { masterFormSchema } from '@/lib/schema';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useMemo } from 'react';
import { FormValues } from '@/lib/types';

// You can move this helper function to a utils file
const calculateAge = (dob: Date | undefined) => {
  if (!dob) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

type Step4Props = {
  form: UseFormReturn<z.infer<typeof masterFormSchema>>;
}

export function Step4({ form }: Step4Props) {
  const { control, watch } = form;
  const dateOfBirth = watch('dob');
  const age = useMemo(() => calculateAge(dateOfBirth), [dateOfBirth]);

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-md">
        <h3 className="text-lg font-semibold mb-2">Emergency Contact</h3>
        <div className="space-y-4">
          {/* Contact Name */}
          <FormField
            control={control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Full Name</FormLabel>
                <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* ... Add Relationship (Select) and Contact Phone (Input) here ... */}
          <FormField
            control={control}
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relationship</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select a relationship" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Sibling">Sibling</SelectItem>
                    <SelectItem value="Friend">Friend</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone Number</FormLabel>
                <FormControl><Input placeholder="+1-123-456-7890" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* --- CONDITIONAL GUARDIAN SECTION --- */}
      {age < 21 && (
        <div className="p-4 border border-blue-200 bg-blue-50 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Guardian Contact (Required for employees under 21)</h3>
          <div className="space-y-4">
            <FormField
              control={control}
              name="guardianName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian Full Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Guardian's Name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="guardianPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guardian Phone Number</FormLabel>
                  <FormControl><Input placeholder="+1-123-456-7890" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}