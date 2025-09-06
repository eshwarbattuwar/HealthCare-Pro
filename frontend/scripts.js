// Global variables
const API_BASE_URL = window.location.origin + '/api';
let currentUser = null;
let editingPatientId = null;
let editingDoctorId = null;

// Utility functions
const showMessage = (message, type = 'info') => {
    const messageContainer = document.getElementById('messageContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    messageContainer.appendChild(messageDiv);
    
    // Show message with animation
    setTimeout(() => messageDiv.classList.add('show'), 100);
    
    // Hide and remove message after 5 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
};

const getToken = () => localStorage.getItem('token');

const setToken = (token) => localStorage.setItem('token', token);

const removeToken = () => localStorage.removeItem('token');

const isAuthenticated = () => !!getToken();

const redirectToLogin = () => {
    removeToken();
    window.location.href = '/';
};

const redirectToDashboard = () => {
    window.location.href = '/dashboard';
};

// API calls
const makeAPICall = async (url, options = {}) => {
    try {
        const token = getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['x-auth-token'] = token;
        }
        
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401) {
                showMessage('Your session has expired. Please login again.', 'error');
                setTimeout(redirectToLogin, 2000);
                return null;
            }
            throw new Error(data.message || 'API call failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showMessage(error.message, 'error');
        return null;
    }
};

// Authentication functions
const register = async (userData) => {
    const response = await makeAPICall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
    
    if (response) {
        setToken(response.token);
        currentUser = response.user;
        showMessage(response.message, 'success');
        setTimeout(redirectToDashboard, 2000);
    }
};

const login = async (credentials) => {
    const response = await makeAPICall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
    
    if (response) {
        setToken(response.token);
        currentUser = response.user;
        showMessage(response.message, 'success');
        setTimeout(redirectToDashboard, 2000);
    }
};

const logout = () => {
    removeToken();
    currentUser = null;
    showMessage('Logged out successfully', 'success');
    setTimeout(redirectToLogin, 1000);
};

// Patient functions
const loadPatients = async () => {
    const response = await makeAPICall('/patients');
    if (response) {
        displayPatients(response.patients);
    }
};

const createPatient = async (patientData) => {
    const response = await makeAPICall('/patients', {
        method: 'POST',
        body: JSON.stringify(patientData)
    });
    
    if (response) {
        showMessage(response.message, 'success');
        closeModal('patientModal');
        loadPatients();
    }
};

const updatePatient = async (id, patientData) => {
    const response = await makeAPICall(`/patients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patientData)
    });
    
    if (response) {
        showMessage(response.message, 'success');
        closeModal('patientModal');
        loadPatients();
    }
};

const deletePatient = async (id) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    
    const response = await makeAPICall(`/patients/${id}`, {
        method: 'DELETE'
    });
    
    if (response) {
        showMessage(response.message, 'success');
        loadPatients();
        loadMappings(); // Refresh mappings as they might be affected
    }
};

const displayPatients = (patients) => {
    const patientList = document.getElementById('patientList');
    
    if (patients.length === 0) {
        patientList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-injured" style="font-size: 48px; color: var(--gray-300); margin-bottom: 16px;"></i>
                <h3>No patients found</h3>
                <p>Start by adding your first patient to the system</p>
            </div>
        `;
        return;
    }
    
    patientList.innerHTML = patients.map(patient => `
        <div class="data-card fade-in">
            <div class="card-header">
                <div>
                    <div class="card-title">
                        <i class="fas fa-user-injured" style="color: var(--secondary-color); margin-right: 8px;"></i>
                        ${patient.name}
                    </div>
                    <div class="card-info">
                        <i class="fas fa-birthday-cake" style="margin-right: 4px;"></i>
                        Age: ${patient.age} | 
                        <i class="fas fa-notes-medical" style="margin-left: 8px; margin-right: 4px;"></i>
                        ${patient.disease}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="editPatient(${patient.id})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn btn-danger" onclick="deletePatient(${patient.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
};

// Doctor functions
const loadDoctors = async () => {
    console.log('Loading doctors...');
    const response = await makeAPICall('/doctors');
    console.log('Doctors response:', response);
    if (response) {
        displayDoctors(response.doctors);
    }
};

const createDoctor = async (doctorData) => {
    const response = await makeAPICall('/doctors', {
        method: 'POST',
        body: JSON.stringify(doctorData)
    });
    
    if (response) {
        showMessage(response.message, 'success');
        closeModal('doctorModal');
        loadDoctors();
        loadMappingOptions(); // Refresh dropdown options
    }
};

const updateDoctor = async (id, doctorData) => {
    const response = await makeAPICall(`/doctors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(doctorData)
    });
    
    if (response) {
        showMessage(response.message, 'success');
        closeModal('doctorModal');
        loadDoctors();
        loadMappingOptions(); // Refresh dropdown options
    }
};

const deleteDoctor = async (id) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    
    const response = await makeAPICall(`/doctors/${id}`, {
        method: 'DELETE'
    });
    
    if (response) {
        showMessage(response.message, 'success');
        loadDoctors();
        loadMappings(); // Refresh mappings as they might be affected
        loadMappingOptions(); // Refresh dropdown options
    }
};

const displayDoctors = (doctors) => {
    console.log('Displaying doctors:', doctors);
    const doctorList = document.getElementById('doctorList');
    
    if (doctors.length === 0) {
        console.log('No doctors found, showing empty state');
        doctorList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-md" style="font-size: 48px; color: var(--gray-300); margin-bottom: 16px;"></i>
                <h3>No doctors found</h3>
                <p>Start by adding your first doctor to the system</p>
            </div>
        `;
        return;
    }
    
    doctorList.innerHTML = doctors.map(doctor => `
        <div class="data-card fade-in">
            <div class="card-header">
                <div>
                    <div class="card-title">
                        <i class="fas fa-user-md" style="color: var(--primary-color); margin-right: 8px;"></i>
                        Dr. ${doctor.name}
                    </div>
                    <div class="card-info">
                        <i class="fas fa-stethoscope" style="margin-right: 4px;"></i>
                        ${doctor.specialization}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="editDoctor(${doctor.id})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteDoctor(${doctor.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
};

// Mapping functions
const loadMappings = async () => {
    const response = await makeAPICall('/mappings');
    if (response) {
        displayMappings(response.mappings);
    }
};

const createMapping = async (mappingData) => {
    const response = await makeAPICall('/mappings', {
        method: 'POST',
        body: JSON.stringify(mappingData)
    });
    
    if (response) {
        showMessage(response.message, 'success');
        closeModal('mappingModal');
        loadMappings();
    }
};

const deleteMapping = async (id) => {
    if (!confirm('Are you sure you want to delete this mapping?')) return;
    
    const response = await makeAPICall(`/mappings/${id}`, {
        method: 'DELETE'
    });
    
    if (response) {
        showMessage(response.message, 'success');
        loadMappings();
    }
};

const displayMappings = (mappings) => {
    const mappingList = document.getElementById('mappingList');
    
    if (mappings.length === 0) {
        mappingList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-link" style="font-size: 48px; color: var(--gray-300); margin-bottom: 16px;"></i>
                <h3>No mappings found</h3>
                <p>Start by creating patient-doctor relationships</p>
            </div>
        `;
        return;
    }
    
    mappingList.innerHTML = mappings.map(mapping => `
        <div class="data-card fade-in">
            <div class="card-header">
                <div>
                    <div class="card-title">
                        <i class="fas fa-link" style="color: var(--accent-color); margin-right: 8px;"></i>
                        ${mapping.patient_name} → Dr. ${mapping.doctor_name}
                    </div>
                    <div class="card-info">
                        <i class="fas fa-user-injured" style="margin-right: 4px;"></i>
                        Patient: ${mapping.patient_age} years, ${mapping.patient_disease} | 
                        <i class="fas fa-user-md" style="margin-left: 8px; margin-right: 4px;"></i>
                        ${mapping.doctor_specialization}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-danger" onclick="deleteMapping(${mapping.id})">
                        <i class="fas fa-unlink"></i>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');
};

const loadMappingOptions = async () => {
    const [patientsResponse, doctorsResponse] = await Promise.all([
        makeAPICall('/patients'),
        makeAPICall('/doctors')
    ]);
    
    if (patientsResponse && doctorsResponse) {
        const patientSelect = document.getElementById('mappingPatient');
        const doctorSelect = document.getElementById('mappingDoctor');
        
        // Populate patient options
        patientSelect.innerHTML = '<option value="">Select Patient</option>' +
            patientsResponse.patients.map(patient => 
                `<option value="${patient.id}">${patient.name} (${patient.age}y, ${patient.disease})</option>`
            ).join('');
        
        // Populate doctor options
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>' +
            doctorsResponse.doctors.map(doctor => 
                `<option value="${doctor.id}">Dr. ${doctor.name} (${doctor.specialization})</option>`
            ).join('');
    }
};

// Modal functions
const openModal = (modalId) => {
    document.getElementById(modalId).style.display = 'block';
};

const closeModal = (modalId) => {
    document.getElementById(modalId).style.display = 'none';
    
    // Reset form if exists
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
    
    // Reset editing states
    if (modalId === 'patientModal') {
        editingPatientId = null;
        document.getElementById('patientModalTitle').textContent = 'Add Patient';
    }
    if (modalId === 'doctorModal') {
        editingDoctorId = null;
        document.getElementById('doctorModalTitle').textContent = 'Add Doctor';
    }
};

// Edit functions
const editPatient = async (id) => {
    const response = await makeAPICall(`/patients/${id}`);
    if (response) {
        const patient = response.patient;
        editingPatientId = id;
        
        document.getElementById('patientName').value = patient.name;
        document.getElementById('patientAge').value = patient.age;
        document.getElementById('patientDisease').value = patient.disease;
        document.getElementById('patientModalTitle').textContent = 'Edit Patient';
        
        openModal('patientModal');
    }
};

const editDoctor = async (id) => {
    const response = await makeAPICall(`/doctors/${id}`);
    if (response) {
        const doctor = response.doctor;
        editingDoctorId = id;
        
        document.getElementById('doctorName').value = doctor.name;
        document.getElementById('doctorSpecialization').value = doctor.specialization;
        document.getElementById('doctorModalTitle').textContent = 'Edit Doctor';
        
        openModal('doctorModal');
    }
};

// Tab switching
const switchTab = (tabName) => {
    console.log('Switching to tab:', tabName);
    
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const targetTab = document.getElementById(tabName);
    console.log('Target tab element:', targetTab);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    console.log('Target button element:', targetButton);
    if (targetButton) {
        targetButton.classList.add('active');
    }
    
    // Update page title and show/hide add buttons
    const titles = {
        'patients': 'Patient Management',
        'doctors': 'Doctor Management', 
        'mappings': 'Patient-Doctor Mappings'
    };
    
    document.getElementById('pageTitle').textContent = titles[tabName];
    
    // Hide all add buttons
    document.getElementById('addPatientBtn').style.display = 'none';
    document.getElementById('addDoctorBtn').style.display = 'none';
    document.getElementById('addMappingBtn').style.display = 'none';
    
    // Show relevant add button
    switch (tabName) {
        case 'patients':
            document.getElementById('addPatientBtn').style.display = 'inline-flex';
            loadPatients();
            break;
        case 'doctors':
            document.getElementById('addDoctorBtn').style.display = 'inline-flex';
            loadDoctors();
            break;
        case 'mappings':
            document.getElementById('addMappingBtn').style.display = 'inline-flex';
            loadMappings();
            break;
    }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    
    // Check authentication for protected pages
    if (currentPage === '/dashboard' && !isAuthenticated()) {
        redirectToLogin();
        return;
    }
    
    // Redirect if already authenticated on auth pages
    if ((currentPage === '/' || currentPage === '/register') && isAuthenticated()) {
        redirectToDashboard();
        return;
    }
    
    // Login page
    if (currentPage === '/') {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                if (!email || !password) {
                    showMessage('Please fill in all fields', 'error');
                    return;
                }
                
                await login({ email, password });
            });
        }
    }
    
    // Register page
    if (currentPage === '/register') {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (!name || !email || !password || !confirmPassword) {
                    showMessage('Please fill in all fields', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showMessage('Passwords do not match', 'error');
                    return;
                }
                
                if (password.length < 6) {
                    showMessage('Password must be at least 6 characters long', 'error');
                    return;
                }
                
                await register({ name, email, password });
            });
        }
    }
    
    // Dashboard page
    if (currentPage === '/dashboard') {
        // Set user name
        try {
            const token = getToken();
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                currentUser = payload.user;
                document.getElementById('userName').textContent = `Welcome, ${currentUser.name}`;
            }
        } catch (error) {
            console.error('Error parsing token:', error);
            redirectToLogin();
            return;
        }
        
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', logout);
        
        // Tab buttons
        document.querySelectorAll('.nav-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = btn.getAttribute('data-tab');
                console.log('Tab clicked:', tabName);
                switchTab(tabName);
            });
        });
        
        // Patient modal and form
        document.getElementById('addPatientBtn').addEventListener('click', () => {
            openModal('patientModal');
        });
        
        document.getElementById('patientForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const patientData = {
                name: document.getElementById('patientName').value,
                age: parseInt(document.getElementById('patientAge').value),
                disease: document.getElementById('patientDisease').value
            };
            
            if (editingPatientId) {
                await updatePatient(editingPatientId, patientData);
            } else {
                await createPatient(patientData);
            }
        });
        
        // Doctor modal and form
        document.getElementById('addDoctorBtn').addEventListener('click', () => {
            openModal('doctorModal');
        });
        
        document.getElementById('doctorForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const doctorData = {
                name: document.getElementById('doctorName').value,
                specialization: document.getElementById('doctorSpecialization').value
            };
            
            if (editingDoctorId) {
                await updateDoctor(editingDoctorId, doctorData);
            } else {
                await createDoctor(doctorData);
            }
        });
        
        // Mapping modal and form
        document.getElementById('addMappingBtn').addEventListener('click', async () => {
            await loadMappingOptions();
            openModal('mappingModal');
        });
        
        document.getElementById('mappingForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const mappingData = {
                patient_id: parseInt(document.getElementById('mappingPatient').value),
                doctor_id: parseInt(document.getElementById('mappingDoctor').value)
            };
            
            await createMapping(mappingData);
        });
        
        // Close modal buttons
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    closeModal(modal.id);
                }
            });
        });
        
        // Close modal when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal.id);
                }
            });
        });
        
        // Load initial data
        loadPatients();
        loadDoctors();
    }
});
