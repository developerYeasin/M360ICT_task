'use client';

import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { masterFormSchema } from '@/lib/schema';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../../components/ui/form';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import { Slider } from '../../components/ui/slider';
import { skillsByDepartment } from '../../lib/mockData';
import { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';

type Step3Props = {
  form: UseFormReturn<z.infer<typeof masterFormSchema>>;
}

export function Step3({ form }: Step3Props) {
  const { control, watch } = form;
  const department = watch('department');
  const selectedSkills = watch('primarySkills') || [];
  const remotePreference = watch('remoteWorkPreference');

  const availableSkills = useMemo(
    () => skillsByDepartment[department as keyof typeof skillsByDepartment] || [],
    [department]
  );

  return (
    <div className="space-y-8">
      {/* --- DYNAMIC SKILLS CHECKBOXES --- */}
      <FormField
        control={control}
        name="primarySkills"
        render={() => (
          <FormItem>
            <FormLabel>Primary Skills</FormLabel>
            <FormDescription>Select at least 3 skills relevant to the selected department.</FormDescription>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableSkills.map((skill) => (
                <FormField
                  key={skill}
                  control={control}
                  name="primarySkills"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(skill)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, skill])
                                : field.onChange(field.value?.filter((value: string) => value !== skill));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{skill}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* --- DYNAMIC EXPERIENCE INPUTS --- */}
      {selectedSkills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-md font-semibold">Years of Experience</h3>
          {selectedSkills.map((skill: string) => (
            <FormItem key={skill}>
              <FormLabel>{skill}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 5"
                  value={form.watch('experience').get(skill) || ''}
                  onChange={(e) => {
                    const newExperience = new Map(form.watch('experience'));
                    newExperience.set(skill, parseInt(e.target.value, 10) || 0);
                    form.setValue('experience', newExperience, { shouldDirty: true });
                    form.trigger('experience'); // Manually trigger validation for the experience field
                  }}
                  onBlur={() => form.trigger('experience')} // Trigger validation on blur
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          ))}
        </div>
      )}

      {/* --- REMOTE WORK PREFERENCE SLIDER --- */}
      <FormField
        control={control}
        name="remoteWorkPreference"
        defaultValue={0}
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel>Remote Work Preference: {value}%</FormLabel>
            <FormControl>
              <Slider
                min={0}
                max={100}
                step={10}
                defaultValue={[value]}
                onValueChange={(vals) => onChange(vals[0])}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* --- CONDITIONAL MANAGER APPROVAL CHECKBOX --- */}
      {remotePreference > 50 && (
        <FormField
          control={control}
          name="managerApproved"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 bg-yellow-50 border-yellow-200">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div>
                <FormLabel>Manager Approved</FormLabel>
                <FormDescription>Approval is required for this level of remote work.</FormDescription>
              </div>
            </FormItem>
          )}
        />
      )}

       {/* Add Preferred Working Hours and Extra Notes fields here... */}
       <FormField
        control={control}
        name="preferredHoursStart"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Hours Start</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="preferredHoursEnd"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Hours End</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="extraNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Extra Notes</FormLabel>
            <FormControl>
              <Textarea placeholder="Any extra notes..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}