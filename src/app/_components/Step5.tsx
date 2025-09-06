'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '../../components/ui/form';
import { Checkbox } from '../../components/ui/checkbox';

type Step5Props = {
  form: any;
}

// A simple component to display data neatly
const ReviewItem = ({ label, value }: { label: string; value: any }) => (
  <div className="flex flex-col">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{String(value) || 'N/A'}</dd>
  </div>
);

export function Step5({ form }: Step5Props) {
  const allData = form.getValues();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <ReviewItem label="Full Name" value={allData.fullName} />
          <ReviewItem label="Email" value={allData.email} />
          <ReviewItem label="Phone Number" value={allData.phone} />
          <ReviewItem label="Date of Birth" value={allData.dob?.toLocaleDateString()} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <ReviewItem label="Department" value={allData.department} />
          <ReviewItem label="Position" value={allData.positionTitle} />
          <ReviewItem label="Start Date" value={allData.startDate?.toLocaleDateString()} />
          <ReviewItem label="Job Type" value={allData.jobType} />
          {allData.salary && <ReviewItem label="Salary" value={`$${allData.salary.toLocaleString()}`} />}
          {allData.hourlyRate && <ReviewItem label="Hourly Rate" value={`$${allData.hourlyRate}`} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Skills & Preferences</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <ReviewItem label="Primary Skills" value={allData.primarySkills?.join(', ')} />
          {allData.primarySkills?.map((skill: string) => (
            <ReviewItem key={skill} label={`${skill} Experience`} value={`${allData.experience?.[skill] || 0} years`} />
          ))}
          <ReviewItem label="Preferred Hours" value={`${allData.preferredHoursStart} - ${allData.preferredHoursEnd}`} />
          <ReviewItem label="Remote Work Preference" value={`${allData.remoteWorkPreference}%`} />
          {allData.remoteWorkPreference > 50 && <ReviewItem label="Manager Approved" value={allData.managerApproved ? 'Yes' : 'No'} />}
          {allData.extraNotes && <ReviewItem label="Extra Notes" value={allData.extraNotes} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Emergency Contact</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <ReviewItem label="Contact Name" value={allData.contactName} />
          <ReviewItem label="Relationship" value={allData.relationship} />
          <ReviewItem label="Contact Phone" value={allData.contactPhone} />
          {allData.guardianName && <ReviewItem label="Guardian Name" value={allData.guardianName} />}
          {allData.guardianPhone && <ReviewItem label="Guardian Phone" value={allData.guardianPhone} />}
        </CardContent>
      </Card>
      
      <FormField
        control={form.control}
        name="confirm"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Confirm Information</FormLabel>
              <FormDescription>I confirm that all the information I have entered is correct and accurate.</FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}