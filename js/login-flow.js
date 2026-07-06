// State Management
let currentUser = null;

// Initialize Database in LocalStorage if empty
function initDB() {
    let usersStr = localStorage.getItem('users');
    let users = usersStr ? JSON.parse(usersStr) : [];
    if (users.length === 0 || !users.find(u => u.email === 'admin@company.com')) {
        const defaultAdmin = {
            user_id: 'U-1',
            name: 'Admin',
            email: 'admin@company.com',
            password: 'Password@123',
            account_type: 'company',
            role: 'admin',
            company_id: 'C-1',
            created_at: new Date().toISOString()
        };
        users = users.filter(u => u.email !== 'admin@company.com');
        users.push(defaultAdmin);
        localStorage.setItem('users', JSON.stringify(users));
    }

    let compsStr = localStorage.getItem('companies');
    let comps = compsStr ? JSON.parse(compsStr) : [];
    if (comps.length === 0 || !comps.find(c => c.company_id === 'C-1')) {
        const defaultCompany = {
            company_id: 'C-1',
            company_name: 'Acme Corp',
            company_code: 'COMP-1234',
            tax_id: '0105550000000',
            created_by: 'U-1',
            created_at: new Date().toISOString()
        };
        comps = comps.filter(c => c.company_id !== 'C-1');
        comps.push(defaultCompany);
        localStorage.setItem('companies', JSON.stringify(comps));
    }
}

initDB();

// DB Helpers
function getUsers() { return JSON.parse(localStorage.getItem('users')); }
function getCompanies() { return JSON.parse(localStorage.getItem('companies')); }
function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}
function saveCompany(company) {
    const companies = getCompanies();
    companies.push(company);
    localStorage.setItem('companies', JSON.stringify(companies));
}
function generateCompanyCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid O, 0, I, 1
    let code = 'COMP-';
    for(let i=0; i<4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Navigation
function showScreen(screenId) {
    document.querySelectorAll('.auth-flow-wrapper .screen').forEach(el => el.classList.remove('active'));
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) targetScreen.classList.add('active');
    
    // Clear forms and feedback when changing screens
    document.querySelectorAll('.auth-flow-wrapper form').forEach(f => f.reset());
    document.querySelectorAll('.auth-flow-wrapper .error-text').forEach(e => e.style.display = 'none');
    
    const feedback = document.getElementById('company-code-feedback');
    if(feedback) {
        feedback.className = 'feedback-text';
        feedback.innerText = '';
        feedback.style.display = 'none';
    }
    
    const btnRegEmp = document.getElementById('btn-reg-emp');
    if(btnRegEmp) btnRegEmp.disabled = true;
    validCompanyId = null;
}

// Register Admin (Create Company)
document.getElementById('form-register-admin').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('reg-admin-name').value;
    const email = document.getElementById('reg-admin-email').value;
    const password = document.getElementById('reg-admin-password').value;
    const companyName = document.getElementById('reg-admin-company-name').value;
    const taxId = document.getElementById('reg-admin-tax-id').value;
    const errEl = document.getElementById('reg-admin-error');

    // Basic Validation
    if(getUsers().find(u => u.email === email)) {
        errEl.innerText = "Email already in use.";
        errEl.style.display = "block";
        return;
    }

    const companyId = 'C-' + Date.now();
    const companyCode = generateCompanyCode();
    const userId = 'U-' + Date.now();

    const newCompany = {
        company_id: companyId,
        company_name: companyName,
        company_code: companyCode,
        tax_id: taxId,
        created_by: userId,
        created_at: new Date().toISOString()
    };

    const newUser = {
        user_id: userId,
        name: name,
        email: email,
        password: password, // In real app, hash this!
        account_type: 'company',
        role: 'admin',
        company_id: companyId,
        created_at: new Date().toISOString()
    };

    saveCompany(newCompany);
    saveUser(newUser);

    // Show Success Screen
    document.getElementById('display-company-code').innerText = companyCode;
    showScreen('screen-success-admin');
    
    // Auto login
    currentUser = newUser;
});

// Real-time Company Code Validation (UX Requirement)
const codeInput = document.getElementById('reg-emp-company-code');
const feedbackEl = document.getElementById('company-code-feedback');
const btnRegEmp = document.getElementById('btn-reg-emp');
let validCompanyId = null;

if (codeInput) {
    codeInput.addEventListener('input', function(e) {
        this.value = this.value.toUpperCase(); // Force uppercase
        const val = this.value.trim();
        
        if(val.length >= 9) { // Because format is COMP-XXXX (9 chars)
            const companies = getCompanies();
            const company = companies.find(c => c.company_code === val);
            
            if(company) {
                feedbackEl.className = 'feedback-text success';
                feedbackEl.innerHTML = `✔️ Found: <strong>${company.company_name}</strong>`;
                btnRegEmp.disabled = false;
                validCompanyId = company.company_id;
            } else {
                feedbackEl.className = 'feedback-text error';
                feedbackEl.innerHTML = `❌ Company not found. Please check the code.`;
                btnRegEmp.disabled = true;
                validCompanyId = null;
            }
        } else {
            feedbackEl.style.display = 'none';
            btnRegEmp.disabled = true;
            validCompanyId = null;
        }
    });
}

// Register Employee (Join Company)
document.getElementById('form-register-employee').addEventListener('submit', function(e) {
    e.preventDefault();
    if(!validCompanyId) return;

    const name = document.getElementById('reg-emp-name').value;
    const email = document.getElementById('reg-emp-email').value;
    const password = document.getElementById('reg-emp-password').value;
    const errEl = document.getElementById('reg-emp-error');

    if(getUsers().find(u => u.email === email)) {
        errEl.innerText = "Email already in use.";
        errEl.style.display = "block";
        return;
    }

    const userId = 'U-' + Date.now();
    const newUser = {
        user_id: userId,
        name: name,
        email: email,
        password: password,
        account_type: 'company',
        role: 'worker', // Mapped to ConWork role (worker instead of employee)
        company_id: validCompanyId,
        created_at: new Date().toISOString()
    };

    saveUser(newUser);
    currentUser = newUser;
    alert("Successfully joined the company!");
    goToDashboard();
});

// Login Flow
document.getElementById('form-login').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');

    const user = getUsers().find(u => u.email === email && u.password === password);
    if(user) {
        currentUser = user;
        goToDashboard();
    } else {
        errEl.innerText = "Invalid email or password.";
        errEl.style.display = "block";
    }
});

// Dashboard Logic -> Integrates with ConWork App
function goToDashboard() {
    if(!currentUser) {
        showScreen('screen-login');
        return;
    }

    // Inject the user data into the ConWork app structure
    if (typeof App !== 'undefined' && App.state) {
        App.state.currentUser = {
            id: currentUser.user_id,
            name: currentUser.name,
            username: currentUser.email.split('@')[0],
            email: currentUser.email,
            role: currentUser.role,
            department: currentUser.role === 'admin' ? 'ผู้บริหาร' : 'พนักงานทั่วไป',
            status: 'online',
            avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser.name) + "&background=random"
        };
        try { sessionStorage.setItem('conwork_user', JSON.stringify(App.state.currentUser)); } catch(e){}
        App.showApp();
    } else {
        // Fallback if app is not loaded yet
        setTimeout(goToDashboard, 100);
    }
}

function logout() {
    currentUser = null;
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    showScreen('screen-login');
}

function copyCode() {
    const code = document.getElementById('display-company-code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        alert("Company Code copied to clipboard!");
    });
}

// Password Visibility Toggle
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Forgot Password Flow
const formForgot = document.getElementById('form-forgot-password');
if(formForgot) {
    formForgot.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        const newPassword = document.getElementById('forgot-password').value;
        const errEl = document.getElementById('forgot-error');
        const successEl = document.getElementById('forgot-success');

        let users = getUsers();
        const userIndex = users.findIndex(u => u.email === email);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            
            errEl.style.display = "none";
            successEl.innerText = "Password reset successfully! You can now sign in.";
            successEl.style.display = "block";
            
            setTimeout(() => {
                showScreen('screen-login');
                successEl.style.display = "none";
                formForgot.reset();
            }, 2000);
        } else {
            successEl.style.display = "none";
            errEl.innerText = "Email not found in the system.";
            errEl.style.display = "block";
        }
    });
}

// Mock Google Login
function loginWithGoogle() {
    const email = prompt("Simulating Google Login...\n\nEnter your Google Email:");
    if (email) {
        const user = getUsers().find(u => u.email === email);
        if (user) {
            currentUser = user;
            alert("Google Login Successful!");
            goToDashboard();
        } else {
            alert("Account not found for this email. Please register first.");
        }
    }
}

// Hook into App.logout to ensure login flow state is also reset
if (typeof App !== 'undefined') {
    const originalLogout = App.logout;
    App.logout = function() {
        if (originalLogout) originalLogout.call(App);
        currentUser = null;
        if (typeof showScreen === 'function') showScreen('screen-login');
    };
}
