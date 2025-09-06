'use client';

import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { masterFormSchema } from '@/lib/schema';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { mockManagers } from '../../lib/mockData';
import { useMemo } from 'react';
import { FormValues } from '@/lib/types';
import { DatePicker } from './DatePicker';

type Step2Props = {
  form: UseFormReturn<z.infer<typeof masterFormSchema>>;
}

export function Step2({ form }: Step2Props) {
  const { control, watch } = form;
  // Use `watch` to get the current values of department and jobType
  const watchedDepartment = watch('department');
  const watchedJobType = watch('jobType');

  // Filter managers based on the selected department
  const availableManagers = useMemo(
    () => mockManagers.filter(m => m.department === watchedDepartment),
    [watchedDepartment]
  );

  return (
    <div className="space-y-4">
      {/* Department Dropdown */}
      <FormField
        control={control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Department</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Job Type Radio Buttons */}
      <FormField
        control={control}
        name="jobType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Type</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                <FormItem><FormControl><RadioGroupItem value="Full-time" /></FormControl><FormLabel>Full-time</FormLabel></FormItem>
                <FormItem><FormControl><RadioGroupItem value="Part-time" /></FormControl><FormLabel>Part-time</FormLabel></FormItem>
                <FormItem><FormControl><RadioGroupItem value="Contract" /></FormControl><FormLabel>Contract</FormLabel></FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* --- CONDITIONAL SALARY FIELDS --- */}
      {watchedJobType === 'Full-time' && (
        <FormField
          control={control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Salary ($)</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 80000" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {watchedJobType === 'Contract' && (
        <FormField
          control={control}
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hourly Rate ($)</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 75" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* --- DYNAMIC MANAGER DROPDOWN --- */}
      {watchedDepartment && (
        <FormField
          control={control}
          name="manager"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manager</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!availableManagers.length}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a manager" /></SelectTrigger></FormControl>
                <SelectContent>
                  {availableManagers.map(manager => (
                    <SelectItem key={manager.id} value={manager.name}>{manager.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Add Position Title and Start Date fields here... */}
      <FormField
        control={control}
        name="positionTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Position Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Software Engineer" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date</FormLabel>
            <FormControl>
              <DatePicker field={field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}