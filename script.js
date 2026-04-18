// ========================================
// Priyadarshni College Attendance Portal
// COMPLETE FUNCTIONAL JAVASCRIPT
// ========================================

// Sample Students Data
const students = {
    'PCE23CS001': {
        name: 'Prashant Chauhan',
        branch: 'Computer Science',
        semester: 5,
        year: '2023-2027',
        cgpa: 8.23,
        sgpa: 8.45,
        password: 'demo123',
        attendance: {
            overall: 85,
            subjects: [
                { name: 'Data Structures', code: 'CS301', total: 15, present: 13, percentage: 86.67 },
                { name: 'Algorithms', code: 'CS302', total: 12, present: 11, percentage: 91.67 },
                { name: 'DBMS', code: 'CS303', total: 18, present: 14, percentage: 77.78 },
                { name: 'OOPS', code: 'CS304', total: 20, present: 16, percentage: 80.00 }
            ]
        },
        recentAttendance: [
            { date: '2024-02-15', subject: 'Data Structures', status: 'Present' },
            { date: '2024-02-14', subject: 'Algorithms', status: 'Present' },
            { date: '2024-02-13', subject: 'DBMS', status: 'Absent' },
            { date: '2024-02-12', subject: 'OOPS', status: 'Present' }
        ],
        fees: [
            { semester: 4, amount: 45000, status: 'Paid', date: '2024-01-20' },
            { semester: 5, amount: 45000, status: 'Pending', dueDate: '2024-02-15' }
        ]
    },
    'PCE23ME002': {
        name: 'Priya Patel',
        branch: 'Mechanical Engineering',
        semester: 5,
        year: '2023-2027',
        cgpa: 7.89,
        sgpa: 7.65,
        password: 'demo123',
        attendance: {
            overall: 78,
            subjects: [
                { name: 'Thermodynamics', code: 'ME301', total: 14, present: 11, percentage: 78.57 },
                { name: 'Fluid Mechanics', code: 'ME302', total: 16, present: 12, percentage: 75.00 },
                { name: 'Machine Design', code: 'ME303', total: 15, present: 13, percentage: 86.67 }
            ]
        },
        recentAttendance: [
            { date: '2024-02-15', subject: 'Thermodynamics', status: 'Present' },
            { date: '2024-02-14', subject: 'Fluid Mechanics', status: 'Absent' },
            { date: '2024-02-13', subject: 'Machine Design', status: 'Present' }
        ],
        fees: [
            { semester: 4, amount: 42000, status: 'Paid', date: '2024-01-18' },
            { semester: 5, amount: 42000, status: 'Pending', dueDate: '2024-02-20' }
        ]
    }
};

// Global variable
let currentStudent = null;

// 🔥 MAIN FUNCTION - Runs when page loads
document.addEventListener('DOMContentLoaded', function() {
    // LOGIN PAGE
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        setupLoginPage();
    }
    
    // DASHBOARD PAGE
    const dashboard = document.querySelector('.dashboard');
    if (dashboard) {
        setupDashboardPage();
    }
});

// ========================================
// LOGIN PAGE FUNCTIONS
// ========================================
function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const rollNoInput = document.getElementById('rollNo');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        loginStudent();
    });
    
    rollNoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginStudent();
        }
    });
}

function loginStudent() {
    const rollNo = document.getElementById('rollNo').value.trim().toUpperCase();
    const password = document.getElementById('password').value;
    
    if (students[rollNo] && students[rollNo].password === password) {
        localStorage.setItem('currentStudent', rollNo);
        window.location.href = 'dashboard.html';
    } else {
        showAlert('❌ Invalid Roll Number or Password!');
        document.getElementById('rollNo').style.borderColor = '#ff4757';
    }
}

// ========================================
// DASHBOARD PAGE FUNCTIONS
// ========================================
function setupDashboardPage() {
    currentStudent = localStorage.getItem('currentStudent');
    
    if (!currentStudent || !students[currentStudent]) {
        window.location.href = 'index.html';
        return;
    }
    
    const student = students[currentStudent];
    
    // 1. SET STUDENT NAME IN NAVBAR
    document.getElementById('studentName').textContent = student.name;
    
    // 2. LOGOUT BUTTON
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // 3. LOAD ALL SECTIONS
    loadOverview(student);
    loadAttendanceTable(student);
    loadRecentAttendance(student);
    loadRecords(student);
    loadFees(student);
    
    // 4. SIDEBAR BUTTONS (Overview, Attendance, Records, Fees)
    setupSidebarButtons();
    
    // 5. ADD ANIMATIONS
    startAnimations();
}

function logout() {
    localStorage.removeItem('currentStudent');
    window.location.href = 'index.html';
}

// ========================================
// 1. OVERVIEW SECTION
// ========================================
function loadOverview(student) {
    const att = student.attendance;
    const subjects = att.subjects;
    
    // Stats
    document.getElementById('overallAttendance').textContent = att.overall + '%';
    document.getElementById('overallProgress').style.width = att.overall + '%';
    
    const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
    const presentClasses = subjects.reduce((sum, s) => sum + s.present, 0);
    
    document.getElementById('totalClasses').textContent = totalClasses;
    document.getElementById('presentClasses').textContent = presentClasses;
    
    const lowAtt = subjects.filter(s => s.percentage < 75).length;
    document.getElementById('lowAttendance').textContent = lowAtt;
}

// ========================================
// 2. ATTENDANCE TABLE
// ========================================
function loadAttendanceTable(student) {
    const tbody = document.getElementById('attendanceTableBody');
    const subjects = student.attendance.subjects;
    
    tbody.innerHTML = subjects.map(subject => `
        <tr onclick="showSubjectDetails('${subject.code}')">
            <td>
                <div>
                    <strong>${subject.name}</strong><br>
                    <small>${subject.code}</small>
                </div>
            </td>
            <td>${subject.total}</td>
            <td>${subject.present}</td>
            <td>${subject.total - subject.present}</td>
            <td><strong>${subject.percentage.toFixed(1)}%</strong></td>
            <td><span class="status ${subject.percentage >= 75 ? 'good' : 'warning'}">
                ${subject.percentage >= 75 ? '✅ Good' : '⚠️ Improve'}
            </span></td>
        </tr>
    `).join('');
}

// ========================================
// 3. RECENT ATTENDANCE
// ========================================
function loadRecentAttendance(student) {
    const container = document.getElementById('recentAttendance');
    const recent = student.recentAttendance.slice(-5);
    
    container.innerHTML = recent.map(record => `
        <div class="activity-item">
            <div class="activity-date">${formatDate(record.date)}</div>
            <div class="activity-subject">${record.subject}</div>
            <div class="activity-status ${record.status === 'Present' ? 'good' : 'danger'}">
                ${record.status}
            </div>
        </div>
    `).join('');
}

// ========================================
// 4. RECORDS SECTION
// ========================================
function loadRecords(student) {
    document.querySelector('[data-semester]').innerHTML = `
        <h3>Current Semester: ${student.semester}</h3>
        <p>Branch: ${student.branch}</p>
        <p>Year: ${student.year}</p>
    `;
    
    document.querySelector('[data-sgpa]').innerHTML = `
        <h3>SGPA (Last Semester)</h3>
        <div class="grade">${student.sgpa}</div>
    `;
    
    document.querySelector('[data-cgpa]').innerHTML = `
        <h3>CGPA</h3>
        <div class="grade">${student.cgpa}</div>
    `;
}

// ========================================
// 5. FEES SECTION
// ========================================
function loadFees(student) {
    const container = document.querySelector('.fee-cards');
    container.innerHTML = student.fees.map(fee => `
        <div class="fee-card ${fee.status.toLowerCase()}">
            <h3>Semester ${fee.semester}</h3>
            <span class="status">${fee.status}</span>
            ${fee.status === 'Paid' ? 
                `<div class="paid-date">Paid: ${formatDate(fee.date)}</div>` : 
                `<div class="due-date">Due: ${formatDate(fee.dueDate)}</div>`
            }
        </div>
    `).join('');
}

// ========================================
// 6. SIDEBAR BUTTONS FUNCTIONALITY
// ========================================
function setupSidebarButtons() {
    document.querySelectorAll('.sidebar li').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active from all
            document.querySelectorAll('.sidebar li').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.page-content').forEach(c => c.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // Show page
            const pageId = this.getAttribute('data-page');
            document.getElementById(pageId).classList.add('active');
        });
    });
}

// ========================================
// 7. ANIMATIONS & EFFECTS
// ========================================
function startAnimations() {
    // Animate progress bars
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = bar.style.width;
        }, 500);
    });
    
    // Table row hover
    document.querySelectorAll('.attendance-table tr').forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.background = '#e3f2fd';
            this.style.transform = 'scale(1.01)';
        });
        row.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.transform = '';
        });
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'short', year: 'numeric' 
    });
}

function showAlert(message) {
    const alert = document.createElement('div');
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: #ff4757; color: white; 
        padding: 15px 25px; border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000; font-weight: bold;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function showSubjectDetails(subjectCode) {
    alert(`📚 Subject Details for ${subjectCode}\n\nClick "View Detailed Report" for full attendance history!`);
}

// ========================================
// AUTO CSS INJECTION (Add these styles)
// ========================================
const css = document.createElement('style');
css.textContent = `
.activity-list { display: flex; flex-direction: column; gap: 15px; }
.activity-item { 
    display: flex; align-items: center; gap: 20px; 
    padding: 20px; background: white; border-radius: 12px; 
    box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
}
.activity-date { font-weight: 600; color: #4A90E2; min-width: 100px; }
.activity-status { padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.activity-status.good { background: #d4edda; color: #155724; }
.activity-status.danger { background: #f8d7da; color: #721c24; }

.records-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; }
.record-card { background: white; padding: 30px; border-radius: 16px; box-shadow: 0 5px 15px rgba(0,0,0,0.08); text-align: center; }
.grade { font-size: 36px; font-weight: 700; color: #4A90E2; margin-top: 10px; }

.fee-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; }
.fee-card { padding: 30px; border-radius: 16px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.08); }
.fee-card.paid { background: linear-gradient(135deg, #d4edda, #c3e6cb); color: #155724; }
.fee-card.pending { background: linear-gradient(135deg, #fff3cd, #ffeaa7); color: #856404; }
.fee-card .status { display: inline-block; padding: 8px 20px; border-radius: 25px; font-weight: 600; margin: 15px 0; font-size: 14px; }
.paid-date, .due-date { margin-top: 15px; font-size: 14px; font-weight: 500; }

.status.good { background: #d4edda !important; color: #155724 !important; }
.status.warning { background: #fff3cd !important; color: #856404 !important; }

@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

@media (max-width: 768px) {
    .activity-item { flex-direction: column; text-align: center; gap: 10px; }
    .fee-cards { grid-template-columns: 1fr; }
}`;
document.head.appendChild(css);

