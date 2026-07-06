const mockUsers = [
    { id: 1, email: 'admin@company.com', username: 'admin', password: 'Password@123', name: 'Nattapong K.', role: 'admin', department: 'ออกแบบ', avatar: 'https://i.pravatar.cc/150?u=1', status: 'online' },
    { id: 2, email: 'ceo@company.com', username: 'ceo', password: 'Password@123', name: 'Somchai R.', role: 'reviewer2', department: 'ผลิตภัณฑ์', avatar: 'https://i.pravatar.cc/150?u=2', status: 'online' },
    { id: 3, email: 'manager@company.com', username: 'manager', password: 'Password@123', name: 'Patchara P.', role: 'reviewer1', department: 'พัฒนาระบบ', avatar: 'https://i.pravatar.cc/150?u=3', status: 'online' },
    { id: 4, email: 'worker@company.com', username: 'worker', password: 'Password@123', name: 'Kittisak T.', role: 'worker', department: 'พัฒนาระบบ', avatar: 'https://i.pravatar.cc/150?u=4', status: 'offline' },
    { id: 5, email: 'requester@company.com', username: 'requester', password: 'Password@123', name: 'Ning N.', role: 'requester', department: 'การตลาด', avatar: 'https://i.pravatar.cc/150?u=5', status: 'online' }
];

const mockProjects = [
    { id: 'p1', name: 'งานออกแบบ ดีไซน์ [The 31studio]', status: 'completed', tasksTotal: 3, tasksDone: 3, progress: 100, team: [1, 3, 5], managers: [1], comanagers: [3], startDate: '2026-04-01', dueDate: '2026-05-20' },
    { id: 'p2', name: 'งานติดตั้งกล้องวงจรปิด', status: 'todo', tasksTotal: 5, tasksDone: 0, progress: 0, team: [4, 2], managers: [2], comanagers: [4], startDate: '2026-05-10', dueDate: '2026-06-30' },
    { id: 'p3', name: 'โครงการบ้านวิภาวดี [demo]', status: 'in-progress', tasksTotal: 28, tasksDone: 1, progress: 3.57, team: [1, 2, 3, 4, 5], managers: [1, 2], comanagers: [3, 4], startDate: '2026-03-15', dueDate: '2026-08-31' },
    { id: 'p4', name: 'Project A งานดีไซน์', status: 'planned', tasksTotal: 6, tasksDone: 0, progress: 0, team: [1, 3], managers: [3], comanagers: [1], startDate: '2026-06-01', dueDate: '2026-07-15' }
];

const mockTaskSections = [
    { id: 'sec-p1-1', projectId: 'p1', title: 'KR1.1', color: '#1e3a5f', order: 0 },
    { id: 'sec-p2-1', projectId: 'p2', title: 'KR1.1', color: '#1e3a5f', order: 0 },
    { id: 'sec-p3-1', projectId: 'p3', title: 'KR1.1', color: '#1e3a5f', order: 0 },
    { id: 'sec-p3-2', projectId: 'p3', title: 'KR1.2', color: '#1e40af', order: 1 }
];

const mockTasks = [
    { id: 't1', projectId: 'p1', title: 'ออกแบบหน้าโฮมเพจใหม่', status: 'done', assignees: [1], dueDate: '2026-05-20', dueTime: '17:00', sectionId: 'sec-p1-1' },
    {
        id: 't2', projectId: 'p3', title: 'เขียนโค้ดเชื่อมต่อฐานข้อมูล', status: 'in-progress', assignees: [4], dueDate: '2026-06-15', dueTime: '18:00', sectionId: 'sec-p3-1', subtasks: [
            { text: '333333333333', done: false },
            { text: '11111111111', done: false },
            { text: '22222222222', done: false }
        ]
    },
    { id: 't3', projectId: 'p2', title: 'ตรวจสอบความปลอดภัยระบบ', status: 'todo', assignees: [5], dueDate: '2026-06-10', dueTime: '12:00', sectionId: 'sec-p2-1' },
    { id: 't4', projectId: 'p3', title: 'UI Component Library Setup [FM]', status: 'todo', assignees: [3], dueDate: '2026-03-26', dueTime: '17:00', sectionId: 'sec-p3-2' }
];

const mockChats = [
    { id: 'note', name: 'พื้นที่ส่วนตัว (Note)', subtitle: 'จดบันทึกและฝากงานตัวเอง', type: 'personal', icon: 'fa-bookmark', color: 'bg-blue-600', status: 'online', unreadCount: 0 },
    { id: 'sales', name: 'ทีมเซลล์ (Sales)', subtitle: 'ยอดขายเดือนนี้เพิ่ม 20%', type: 'group', icon: 'fa-users', color: 'bg-green-500', status: 'online', unreadCount: 0 },
    { id: 'dev', name: 'ทีม Development', subtitle: 'Sprint review ศุกร์นี้ 14:00', type: 'group', icon: 'fa-code', color: 'bg-purple-600', status: 'offline', unreadCount: 0 },
    { id: 'project-v', name: 'โครงการบ้านวิภาวดี', subtitle: 'แชตกลุ่มโปรเจกต์', type: 'group', icon: 'fa-briefcase', color: 'bg-purple-500', status: 'offline', unreadCount: 0 }
];

const mockMessages = [
    { id: 'm1', chatId: 'note', senderId: 1, text: 'Remember to check the new design.', timestamp: '10:00 AM' }
];

const mockEvents = [
    { id: 'e1', title: 'ประชุมกับลูกค้า', date: '2026-05-15', type: 'project', projectId: 'p1', time: '10:00 - 11:00' },
    { id: 'e2', title: 'ประชุมทีมงาน', date: '2026-05-15', type: 'group', time: '13:00 - 14:00' },
    { id: 'e3', title: 'นำเสนอแบบร่างดีไซน์', date: '2026-05-20', type: 'project', projectId: 'p1', time: '17:00 - 18:00' },
    { id: 'e4', title: 'ตรวจสอบความคืบหน้าโครงการ', date: '2026-05-10', type: 'project', projectId: 'p2', time: '' },
    { id: 'e5', title: 'วางแผนงานไตรมาส 3', date: '2026-06-01', type: 'group', time: '09:00 - 10:30' },
    { id: 'e6', title: 'ส่งมอบงานโครงการบ้านวิภาวดี', date: '2026-08-31', type: 'project', projectId: 'p3', time: '14:00 - 15:00' }
];

const mockNotifications = [];
