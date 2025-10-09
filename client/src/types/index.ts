export interface InquiryFormData {
    name: string;
    email: string;
    phone: string;
    projectType: string;
    requirements: string;
    date: string;
  }
  
  export interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    projectType?: string;
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