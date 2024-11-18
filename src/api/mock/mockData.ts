// Mock Bank Statistics
export const mockBankStatistics = {
  totalAgents: 45,
  activeRequests: 12,
  approvedToday: 5,
  pendingReview: 7,
  recentActivity: [
    {
      id: 1,
      type: 'request_approved',
      content: 'Request #1234 approved',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'agent_added',
      content: 'New agent onboarded',
      timestamp: '3 hours ago'
    },
    {
      id: 3,
      type: 'request_pending',
      content: 'New request submitted',
      timestamp: '4 hours ago'
    }
  ]
};

// Mock Agents
export const mockAgents = [
  {
    id: 'agent1',
    email: 'agent1@example.com',
    firstName: 'John',
    lastName: 'Doe',
    agencyId: 'agency1',
    agencyName: 'Agency One',
    bankId: 'bank1',
    bankName: 'Example Bank',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date(),
    totalRequests: 15,
    pendingRequests: 3
  },
  {
    id: 'agent2',
    email: 'agent2@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    agencyId: 'agency2',
    agencyName: 'Agency Two',
    bankId: 'bank1',
    bankName: 'Example Bank',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date(),
    totalRequests: 8,
    pendingRequests: 1
  }
];

// Mock Banks
export const mockBanks = [
  {
    id: 'bank1',
    name: 'Example Bank',
    registrationNumber: '123456789',
    address: '123 Banking Street, Financial District',
    status: 'active',
    totalAgents: 45,
    totalRequests: 120,
    createdAt: new Date(),
    lastModified: new Date()
  },
  {
    id: 'bank2',
    name: 'Second Bank',
    registrationNumber: '987654321',
    address: '456 Finance Avenue, Business Center',
    status: 'active',
    totalAgents: 32,
    totalRequests: 85,
    createdAt: new Date(),
    lastModified: new Date()
  }
];

// Mock Requests
export const mockRequests = [
  {
    id: 1,
    agentId: 'agent1',
    agentName: 'John Doe',
    agencyName: 'Agency One',
    bankId: 'bank1',
    bankName: 'Example Bank',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    status: 'Pending Review',
    submissionDate: '2024-03-15',
    type: 'Individual',
    companyName: 'Johnson Industries',
    lastModified: '2024-03-15 14:30',
    data: {
      personal: {
        title: 'madame',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah@example.com'
      },
      activity: {
        companyName: 'Johnson Industries',
        legalForm: 'SAS'
      }
    }
  },
  {
    id: 2,
    agentId: 'agent2',
    agentName: 'Jane Smith',
    agencyName: 'Agency Two',
    bankId: 'bank1',
    bankName: 'Example Bank',
    name: 'Michael Brown',
    email: 'michael@example.com',
    status: 'Information Required',
    submissionDate: '2024-03-14',
    type: 'Individual',
    companyName: 'Brown LLC',
    lastModified: '2024-03-14 09:15',
    data: {
      personal: {
        title: 'monsieur',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael@example.com'
      }
    }
  }
];

// Mock Super Admin Statistics
export const mockStatistics = {
  totalBanks: 5,
  totalAgents: 150,
  totalRequests: 450,
  activeRequests: 35,
  recentActivity: [
    {
      id: 1,
      type: 'bank_added',
      content: 'New bank onboarded',
      timestamp: '1 hour ago',
      bankName: 'Example Bank'
    },
    {
      id: 2,
      type: 'agent_added',
      content: 'New agent registered',
      timestamp: '2 hours ago',
      bankName: 'Second Bank'
    },
    {
      id: 3,
      type: 'request_approved',
      content: 'Request #1234 approved',
      timestamp: '3 hours ago',
      bankName: 'Example Bank'
    }
  ],
  bankDistribution: [
    {
      bankId: 'bank1',
      bankName: 'Example Bank',
      agentCount: 45,
      requestCount: 120
    },
    {
      bankId: 'bank2',
      bankName: 'Second Bank',
      agentCount: 32,
      requestCount: 85
    }
  ]
};