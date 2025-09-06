import { z } from 'zod';

// ... all your other schemas

// Schema for the final confirmation step
export const reviewSchema = z.object({
  confirm: z.boolean().refine(val => val === true, {
    message: "You must confirm the information is correct to submit.",
  }),
});

// Assume your Step 1 schema is here
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full Name is required").refine(name => name.trim().split(' ').length >= 2, "Please enter at least two words"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dob: z.date().refine(date => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return date <= eighteenYearsAgo;
  }, "You must be at least 18 years old"),
  profilePicture: z.any().optional(),
});

// Define the schema for Step 2
export const jobDetailsSchema = z.object({
  department: z.enum(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']),
  positionTitle: z.string().min(3, "Position must be at least 3 characters"),
  startDate: z.date()
    .min(new Date(), "Start Date cannot be in the past.")
    .max(new Date(new Date().setDate(new Date().getDate() + 90)), "Start Date cannot be more than 90 days in the future."),
  jobType: z.enum(['Full-time', 'Part-time', 'Contract']),
  // We'll make salary conditional below
  salary: z.number().optional(),
  hourlyRate: z.number().optional(),
  manager: z.string().optional(), // Or required, based on your preference
});

// Let's handle the complex validation:
const refinedJobDetailsSchema = jobDetailsSchema
  // Rule 1: Conditional Salary Validation
  .superRefine((data, ctx) => {
    if (data.jobType === 'Full-time' && (data.salary === undefined || data.salary < 30000 || data.salary > 200000)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Annual salary must be between $30,000 and $200,000",
        path: ['salary'],
      });
    }
    if (data.jobType === 'Contract' && (data.hourlyRate === undefined || data.hourlyRate < 50 || data.hourlyRate > 150)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hourly rate must be between $50 and $150",
        path: ['hourlyRate'],
      });
    }
  })
  // Rule 2: Weekend Start Date Validation (existing rule)
  .refine((data) => {
    if (data.department === 'HR' || data.department === 'Finance') {
      const day = data.startDate.getDay();
      return day !== 5 && day !== 6; // Friday is 5, Saturday is 6
    }
    return true;
  }, {
    message: "Start date cannot be on a Friday or Saturday for HR/Finance",
    path: ['startDate'],
  });

// Now create the master schema
export const skillsPreferencesSchema = z.object({
  primarySkills: z.array(z.string())
    .min(3, "Please select at least 3 skills."),
  
  // To store experience for each skill, we can use a map
  experience: z.map(z.string(), z.number().min(1, "Experience must be at least 1 year.")),

  preferredHoursStart: z.string().min(1, "Start time is required."),
  preferredHoursEnd: z.string().min(1, "End time is required."),
  
  remoteWorkPreference: z.number().min(0).max(100),
  
  // This field will only appear conditionally, so it's optional in the base schema
  managerApproved: z.boolean().optional(),
  
  extraNotes: z.string().max(500, "Notes must be under 500 characters.").optional(),
})
.refine(data => {
  // Ensure that for every skill selected, a corresponding experience is provided.
  return data.primarySkills.every(skill => data.experience.get(skill) !== undefined && (data.experience.get(skill) || 0) > 0);
}, {
  message: "Please provide years of experience for all selected skills.",
  path: ['experience'], // This error will be associated with the experience fields
})
.superRefine((data, ctx) => {
  // Rule: If remote preference > 50%, "Manager Approved" must be checked (true)
  if (data.remoteWorkPreference > 50 && !data.managerApproved) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Manager approval is required for over 50% remote work.",
      path: ['managerApproved'],
    });
  }
});

// Define the schema for Step 4
export const emergencyContactSchema = z.object({
  contactName: z.string().min(1, "Contact name is required."),
  relationship: z.enum(['Spouse', 'Parent', 'Sibling', 'Friend', 'Other']),
  contactPhone: z.string().regex(/^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/, "Phone number must be in the format +1-123-456-7890"),
  
  // Guardian fields are optional by default
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
});

// Calculate age helper function
const calculateAge = (dob: Date) => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// Rebuild the master schema to apply a final cross-step validation
export const masterFormSchema = z.object({
  ...personalInfoSchema.shape,
  ...refinedJobDetailsSchema.shape,
  ...skillsPreferencesSchema.shape,
  ...emergencyContactSchema.shape,
  ...reviewSchema.shape, // Add the confirmation checkbox
}).superRefine((data, ctx) => {
  // Rule: If age is under 21, guardian info is required.
  const age = calculateAge(data.dob); // Accessing dob from Step 1
  
  if (age < 21) {
    if (!data.guardianName || data.guardianName.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Guardian name is required for employees under 21.",
        path: ['guardianName'], // Attach error to the specific field
      });
    }
    if (!data.guardianPhone || !/^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/.test(data.guardianPhone)) {
       ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A valid guardian phone number is required.",
        path: ['guardianPhone'],
      });
    }
  }
});