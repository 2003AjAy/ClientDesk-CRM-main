export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  source: string;
  targetAudience: string;
  keyFeatures: string;
  requirements: string;
  date: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  source?: string;
  targetAudience?: string;
  keyFeatures?: string;
  requirements?: string;
}

export const PROJECT_TYPES = [
  { value: '', label: 'Select Project Type' },
  { value: 'website', label: 'Website Development' },
  { value: 'mobile-app', label: 'Mobile App Development' },
  { value: 'web-app', label: 'Web Application' },
  { value: 'ecommerce', label: 'E-commerce Platform' },
  { value: 'design', label: 'UI/UX Design' },
  { value: 'consulting', label: 'Technical Consulting' },
  { value: 'maintenance', label: 'Maintenance & Support' },
  { value: 'other', label: 'Other' }
];

export const BUDGET_RANGES = [
  { value: '', label: 'Select Budget Range' },
  { value: 'lt-50k', label: 'Less than ₹50,000' },
  { value: '50k-1L', label: '₹50,000 - ₹1,00,000' },
  { value: '1L-3L', label: '₹1,00,000 - ₹3,00,000' },
  { value: '3L-5L', label: '₹3,00,000 - ₹5,00,000' },
  { value: '5L-plus', label: '₹5,00,000+' }
];

export const TIMELINE_RANGES = [
  { value: '', label: 'Select Timeline' },
  { value: 'asap', label: 'ASAP (< 1 month)' },
  { value: '1-3m', label: '1-3 months' },
  { value: '3-6m', label: '3-6 months' },
  { value: '6m-plus', label: '6+ months' }
];

export const REFERRAL_SOURCES = [
  { value: '', label: 'How did you hear about us?' },
  { value: 'google', label: 'Google Search' },
  { value: 'social', label: 'Social Media' },
  { value: 'referral', label: 'Referral' },
  { value: 'blog', label: 'Blog/Article' },
  { value: 'other', label: 'Other' }
];