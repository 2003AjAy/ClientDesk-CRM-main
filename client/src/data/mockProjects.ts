import { Project } from '../types/Project';

export const mockProjects: Project[] = [
  {
    id: '1',
    clientName: 'Ajay Yadav',
    email: 'ajay@gmail.com',
    phone: '9876543210',
    projectType: 'E-commerce Website',
    requirements: 'Need an online store for electronics with payment integration, inventory management, and customer accounts.',
    status: 'In Progress',
    createdAt: '2025-01-12',
    progress: 65,
    timeline: [
      { id: '1', title: 'Requirements Received', status: 'completed', date: '2025-01-10', description: 'Initial project requirements gathered' },
      { id: '2', title: 'UI Design Phase', status: 'completed', date: '2025-01-12', description: 'Wireframes and mockups created' },
      { id: '3', title: 'Development Started', status: 'current', date: '2025-01-15', description: 'Backend and frontend development in progress' },
      { id: '4', title: 'Testing', status: 'pending', description: 'Quality assurance and testing phase' },
      { id: '5', title: 'Deployment', status: 'pending', description: 'Production deployment and launch' }
    ],
    notes: [
      {
        id: '1',
        content: 'Initial meeting completed. Discussed requirements and timeline.',
        timestamp: '2025-01-10'
      },
      {
        id: '2',
        content: 'Design phase started. Working on wireframes and user flow.',
        timestamp: '2025-01-12'
      }
    ]
  },
  {
    id: '2',
    clientName: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '9876543211',
    projectType: 'Portfolio Website',
    requirements: 'Modern portfolio website for a graphic designer with gallery showcase and contact form.',
    status: 'Completed',
    createdAt: '2025-01-08',
    progress: 100,
    timeline: [
      { id: '1', title: 'Requirements Received', status: 'completed', date: '2025-01-08' },
      { id: '2', title: 'UI Design Phase', status: 'completed', date: '2025-01-09' },
      { id: '3', title: 'Development Started', status: 'completed', date: '2025-01-10' },
      { id: '4', title: 'Testing', status: 'completed', date: '2025-01-14' },
      { id: '5', title: 'Deployment', status: 'completed', date: '2025-01-15' }
    ],
    notes: [
      {
        id: '3',
        content: 'Project requirements finalized.',
        timestamp: '2025-01-08'
      },
      {
        id: '4',
        content: 'Development completed and deployed.',
        timestamp: '2025-01-15'
      }
    ]
  },
  {
    id: '3',
    clientName: 'Michael Rodriguez',
    email: 'michael.r@business.com',
    phone: '9876543212',
    projectType: 'Business Website',
    requirements: 'Corporate website for consulting firm with service pages, team bios, and blog section.',
    status: 'Pending',
    createdAt: '2025-01-15',
    progress: 10,
    timeline: [
      { id: '1', title: 'Requirements Received', status: 'completed', date: '2025-01-15' },
      { id: '2', title: 'UI Design Phase', status: 'pending' },
      { id: '3', title: 'Development Started', status: 'pending' },
      { id: '4', title: 'Testing', status: 'pending' },
      { id: '5', title: 'Deployment', status: 'pending' }
    ],
    notes: [
      {
        id: '5',
        content: 'Initial inquiry received. Scheduling consultation call.',
        timestamp: '2025-01-15'
      }
    ]
  },
  {
    id: '4',
    clientName: 'Emily Johnson',
    email: 'emily.j@restaurant.com',
    phone: '9876543213',
    projectType: 'Restaurant Website',
    requirements: 'Restaurant website with online menu, reservation system, and location details.',
    status: 'In Progress',
    createdAt: '2025-01-14',
    progress: 45,
    timeline: [
      { id: '1', title: 'Requirements Received', status: 'completed', date: '2025-01-14' },
      { id: '2', title: 'UI Design Phase', status: 'completed', date: '2025-01-15' },
      { id: '3', title: 'Development Started', status: 'current', date: '2025-01-16' },
      { id: '4', title: 'Testing', status: 'pending' },
      { id: '5', title: 'Deployment', status: 'pending' }
    ],
    notes: [
      {
        id: '6',
        content: 'Menu content received from client.',
        timestamp: '2025-01-14'
      },
      {
        id: '7',
        content: 'Working on reservation system integration.',
        timestamp: '2025-01-16'
      }
    ]
  },
  {
    id: '5',
    clientName: 'David Kim',
    email: 'david.kim@tech.com',
    phone: '9876543214',
    projectType: 'SaaS Application',
    requirements: 'Full-stack SaaS application for project management with user authentication and dashboard.',
    status: 'Pending',
    createdAt: '2025-01-16',
    progress: 5,
    timeline: [
      { id: '1', title: 'Requirements Received', status: 'completed', date: '2025-01-16' },
      { id: '2', title: 'UI Design Phase', status: 'pending' },
      { id: '3', title: 'Development Started', status: 'pending' },
      { id: '4', title: 'Testing', status: 'pending' },
      { id: '5', title: 'Deployment', status: 'pending' }
    ],
    notes: [
      {
        id: '8',
        content: 'Complex project requirements under review.',
        timestamp: '2025-01-16'
      }
    ]
  }
];