import { FormErrors, InquiryFormData } from '../types';

export const validateForm = (data: InquiryFormData): FormErrors => {
  const errors: FormErrors = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Phone validation
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^[\d\s\-\+\(\)]+$/.test(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Project type validation
  if (!data.projectType) {
    errors.projectType = 'Please select a project type';
  }

  // Budget validation
  if (!data.budget) {
    errors.budget = 'Please select a budget range';
  }

  // Timeline validation
  if (!data.timeline) {
    errors.timeline = 'Please select a timeline';
  }

  // Source validation
  if (!data.source) {
    errors.source = 'Please tell us how you heard about us';
  }

  // Requirements validation
  if (!data.requirements.trim()) {
    errors.requirements = 'Project requirements are required';
  } else if (data.requirements.trim().length < 10) {
    errors.requirements = 'Please provide more detailed requirements (at least 10 characters)';
  }

  return errors;
};

export const isValidForm = (errors: FormErrors): boolean => {
  return Object.keys(errors).length === 0;
};