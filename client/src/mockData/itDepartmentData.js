// IT Department Physical Spaces & Test Data

export const IT_ROOMS = [
  { id: 'dept_office', name: 'Department Office', type: 'office', description: 'Station of Department Head, Secretary, and Faculty Instructors' },
  { id: 'lab_42', name: 'LAB 42', type: 'lab', description: 'Computer Lab 42 - Programming & Web Development' },
  { id: 'lab_43', name: 'LAB 43', type: 'lab', description: 'Computer Lab 43 - Cisco & Networking Systems' },
  { id: 'lab_44', name: 'LAB 44', type: 'lab', description: 'Computer Lab 44 - Multimedia & Databases' },
  { id: 'lab_45', name: 'LAB 45', type: 'lab', description: 'Computer Lab 45 - Systems Analysis & IT Capstone' },
  { id: 'room_46', name: 'Room 46', type: 'lecture', description: 'Lecture Hall 46 - Discrete Mathematics & General IT' },
  { id: 'room_47', name: 'Room 47', type: 'lecture', description: 'Lecture Hall 47 - Algorithms & Data Structures' },
  { id: 'room_48', name: 'Room 48', type: 'lecture', description: 'Lecture Hall 48 - Cybersecurity & Ethics' },
  { id: 'room_49', name: 'Room 49', type: 'lecture', description: 'Lecture Hall 49 - Mobile App Development' },
];

export const IT_CATEGORIES = [
  "All Categories",
  "Flash Drives & Storage",
  "Laptops & Tablets",
  "Chargers & Power Cables",
  "Mice, Keyboards & Peripherals",
  "Department IDs & Lanyards",
  "Calculators & Tools",
  "Notebooks & Modules",
  "Personal Belongings"
];

export const INITIAL_IT_ITEMS = [
  {
    id: 1,
    type: "found",
    title: "SanDisk 64GB Ultra Dual USB Drive",
    category: "Flash Drives & Storage",
    description: "Left plugged into Computer Station #12 during Web Development lab.",
    privateDetail: "Root folder has a folder named 'Torres_IT3A_Project' and student ID ends in '8829'.",
    room: "LAB 42",
    holdingLocation: "Department Office - Faculty Desk #3 (Prof. Davis)",
    dateReported: "2026-11-06",
    status: "claim_pending",
    imageUrl: "https://images.unsplash.com/photo-1623880840011-827c813a84ec?auto=format&fit=crop&w=800&q=80",
    finderName: "Prof. Marc Davis (Instructor)"
  },
  {
    id: 2,
    type: "found",
    title: "Logitech MX Anywhere 3 Wireless Mouse (Graphite)",
    category: "Mice, Keyboards & Peripherals",
    description: "Found on the back row table after evening Multimedia class.",
    privateDetail: "Small scratch near the scroll wheel and bottom has a piece of blue masking tape.",
    room: "LAB 44",
    holdingLocation: "Department Office - Student Council Locker",
    dateReported: "2026-11-07",
    status: "in_custody",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    finderName: "Christian Reyes (IT Student Officer)"
  },
  {
    id: 3,
    type: "found",
    title: "Official IT Department ID Badge & Orange Lanyard",
    category: "Department IDs & Lanyards",
    description: "Found under an armchair in Room 46. Turned over directly to the department secretary.",
    privateDetail: "Student ID is '2024-8829', Name: 'Elena Torres', Program: BSIT 3-A.",
    room: "Room 46",
    holdingLocation: "Department Office - Secretary Front Desk",
    dateReported: "2026-11-05",
    status: "claim_pending",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    finderName: "Ms. Karen Diaz (Department Secretary)"
  },
  {
    id: 4,
    type: "lost",
    title: "Apple 67W USB-C Power Adapter & Magsafe Cable",
    category: "Chargers & Power Cables",
    description: "Left plugged into the wall outlet near the Cisco switch racks during Networking Lab.",
    privateDetail: "White charging block has a small green round sticker on the Apple logo.",
    room: "LAB 43",
    holdingLocation: "Not turned in yet",
    dateReported: "2026-11-06",
    status: "open",
    imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    finderName: "Sophia Chen (BSIT 3-A)"
  },
  {
    id: 5,
    type: "found",
    title: "Casio fx-991EX Scientific Calculator",
    category: "Calculators & Tools",
    description: "Found on row 3 desk after Discrete Mathematics class.",
    privateDetail: "Slide cover has a sticker of Python logo and student's initials 'J.R.' engraved on inside cover.",
    room: "Room 47",
    holdingLocation: "Department Office - Safe Cabinet Shelf #1",
    dateReported: "2026-11-04",
    status: "in_custody",
    imageUrl: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80",
    finderName: "Prof. Arthur Pendelton (Instructor)"
  }
];

export const INITIAL_IT_CLAIMS = [
  {
    id: 'claim-101',
    itemId: 1,
    itemTitle: "SanDisk 64GB Ultra Dual USB Drive",
    itemRoom: "LAB 42",
    claimantName: "Elena Torres",
    claimantEmail: "e.torres@student.it.edu",
    claimantStudentId: "2024-8829",
    yearSection: "BSIT 3-A",
    proofDescription: "Root directory contains my Java homework folder 'Torres_IT3A_Project' and student ID ends in '8829'. Also has an ISO file of Ubuntu 22.04.",
    claimCode: "FIT-4201",
    submittedAt: "2026-11-06T14:30:00",
    status: "submitted",
    verifierRole: "Instructor or Student Officer",
    holdingLocation: "Department Office - Faculty Desk #3 (Prof. Davis)"
  },
  {
    id: 'claim-102',
    itemId: 3,
    itemTitle: "Official IT Department ID Badge & Orange Lanyard",
    itemRoom: "Room 46",
    claimantName: "Elena Torres",
    claimantEmail: "e.torres@student.it.edu",
    claimantStudentId: "2024-8829",
    yearSection: "BSIT 3-A",
    proofDescription: "Inside the back of the ID sleeve is a small folded photo sticker of my pet cat.",
    claimCode: "FIT-4602",
    submittedAt: "2026-11-06T16:15:00",
    status: "submitted",
    verifierRole: "Department Secretary or Instructor",
    holdingLocation: "Department Office - Secretary Front Desk"
  }
];
