'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Import your step components and schemas
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { Step5 } from './Step5'; // Import Step5
import { masterFormSchema } from '@/lib/schema'; // Example schema
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/lib/types';
import { Form } from '../../components/ui/form'; // Import the main Form component

// Combine schemas later, for now just use one
const formSchema = masterFormSchema;

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<z.infer<typeof masterFormSchema>>({
    resolver: zodResolver(masterFormSchema),
    mode: 'onTouched', // Validate fields as the user interacts with them
    defaultValues: {
      // Set initial default values
      fullName: '',
      email: '',
      phone: '',
      dob: undefined,
      profilePicture: undefined,
      department: undefined,
      positionTitle: '',
      startDate: undefined,
      jobType: undefined,
      salary: undefined,
      hourlyRate: undefined,
      manager: '',
      primarySkills: [],
      experience: new Map<string, number>(), // Initialize as a Map
      preferredHoursStart: '',
      preferredHoursEnd: '',
      remoteWorkPreference: 0,
      managerApproved: false,
      extraNotes: '',
      contactName: '',
      relationship: undefined,
      contactPhone: '',
      guardianName: '',
      guardianPhone: '',
      confirm: false, // Add the confirmation checkbox default
    },
  });

  // The function to handle the final submission
  function processForm(data: z.infer<typeof masterFormSchema>) {
    console.log("Form Submitted! All data is valid.");
    console.log(data);
    alert("Onboarding form submitted successfully!");
  }

  const steps = [
    { id: 'Step 1', name: 'Personal Info', component: <Step1 form={form} /> },
    { id: 'Step 2', name: 'Job Details', component: <Step2 form={form} /> },
    { id: 'Step 3', name: 'Skills & Preferences', component: <Step3 form={form} /> },
    { id: 'Step 4', name: 'Emergency Contact', component: <Step4 form={form} /> },
    { id: 'Step 5', name: 'Review & Submit', component: <Step5 form={form} /> }, // Add Step5
  ];

  const next = async () => {
    let result;
    if (currentStep === 0) {
      result = await form.trigger(['fullName', 'email', 'phone', 'dob']);
    } else if (currentStep === 1) {
      result = await form.trigger(['department', 'positionTitle', 'startDate', 'jobType', 'salary', 'hourlyRate', 'manager']);
    } else if (currentStep === 2) {
      result = await form.trigger(['primarySkills', 'experience', 'preferredHoursStart', 'preferredHoursEnd', 'remoteWorkPreference', 'managerApproved', 'extraNotes']);
    } else if (currentStep === 3) {
      result = await form.trigger(['contactName', 'relationship', 'contactPhone', 'guardianName', 'guardianPhone']);
    } else if (currentStep === 4) { // Trigger validation for Step5
      result = await form.trigger(['confirm']);
    }

    if (result) {
        setCurrentStep(prev => prev < steps.length - 1 ? prev + 1 : prev);
    }
  };

  const prev = () => {
    setCurrentStep(prev => prev > 0 ? prev - 1 : prev);
  };

  // Warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (form.formState.isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    };
}, [form.formState.isDirty]);

  return (
    // Use the <Form> wrapper from shadcn/ui and react-hook-form
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
        {/* Progress Indicator */}
        <p>Step {currentStep + 1} of {steps.length}</p>

        {/* Render the current step's component */}
        {steps[currentStep].component}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-5">
          <div className="flex justify-between">
            <button type="button" onClick={prev} disabled={currentStep === 0}>
              Go Back
            </button>
            
            {currentStep < steps.length - 1 && (
              <button type="button" onClick={next}>
                Next Step
              </button>
            )}

            {currentStep === steps.length - 1 && (
              <button type="submit">
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}