document.addEventListener('DOMContentLoaded', function() {
    // Show admin content and hide loading spinner
    setTimeout(function() {
        document.getElementById('loadingSpinner').style.display = 'none';
        document.querySelector('.admin-container').style.display = 'flex';
    }, 1000);
    
    // Sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.sidebar-menu-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        if (button.id !== 'logoutBtn') {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Hide all tab contents
                tabContents.forEach(content => {
                    content.style.display = 'none';
                });
                
                // Remove active class from all tab buttons
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Show selected tab content and add active class to button
                document.getElementById(tabId).style.display = 'block';
                this.classList.add('active');
                
                // Initialize charts if needed when tab is shown
                if (tabId === 'dashboard') {
                    initDashboardCharts();
                } else if (tabId === 'analytics') {
                    initAnalyticsCharts();
                }
            });
        }
    });
    
    // Settings tabs
    const settingsTabButtons = document.querySelectorAll('.settings-tab-btn');
    const settingsTabContents = document.querySelectorAll('.settings-tab-content');
    
    settingsTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-settings-tab') + '-settings';
            
            // Hide all settings tab contents
            settingsTabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all settings tab buttons
            settingsTabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected settings tab content and add active class to button
            document.getElementById(tabId).classList.add('active');
            this.classList.add('active');
        });
    });
    
    // Initialize search functionality
    initSearch();
    
    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Add confirmation dialog
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                // Clear any stored authentication
                localStorage.removeItem('adminToken');
                sessionStorage.removeItem('adminSession');
                
                // Redirect to login page
                window.location.href = 'login.html';
            }
        });
    }
    
    // Initialize form submissions
    initForms();
    
    // Initialize real-time data fetching
    initRealTimeData();
    
    // Initialize charts
    initDashboardCharts();
    
    // Initialize dropdowns
    initDropdowns();
    
    // Initialize file uploads
    initFileUploads();
    
    // Initialize data tables
    initDataTables();
    
    // Initialize user management
    initUserManagement();
    
    // Initialize blog post management
    initBlogManagement();
    
    // Initialize project management
    initProjectManagement();
    
    // Show dashboard by default
    document.querySelector('[data-tab="dashboard"]').click();
});

// Initialize search functionality
function initSearch() {
    const searchInput = document.querySelector('.header-search input');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            const searchTerm = this.value.toLowerCase();
            
            if (e.key === 'Enter' && searchTerm.trim() !== '') {
                performSearch(searchTerm);
            }
        });
    }
}

// Perform search across admin panel
function performSearch(query) {
    // This would typically connect to your backend
    // For now, we'll just search visible content
    
    // Reset any previous search highlights
    const highlightedElements = document.querySelectorAll('.search-highlight');
    highlightedElements.forEach(el => {
        el.classList.remove('search-highlight');
    });
    
    // Search in project names, user names, blog titles, etc.
    const searchableElements = document.querySelectorAll('.tab-content h3, .tab-content h4, .tab-content p');
    let matchCount = 0;
    
    searchableElements.forEach(element => {
        const content = element.textContent.toLowerCase();
        if (content.includes(query)) {
            element.classList.add('search-highlight');
            matchCount++;
        }
    });
    
    // Show search results
    showNotification(`Se encontraron ${matchCount} coincidencias para "${query}"`, 'info');
}

// Initialize all forms in the admin panel
function initForms() {
    // General settings form
    const generalSettingsForm = document.getElementById('generalSettingsForm');
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const settings = Object.fromEntries(formData.entries());
            
            // Save settings (would typically be an API call)
            localStorage.setItem('siteSettings', JSON.stringify(settings));
            
            // Show success message
            showNotification('Configuración guardada correctamente', 'success');
        });
    }
    
    // Appearance settings form
    const appearanceSettingsForm = document.getElementById('appearanceSettingsForm');
    if (appearanceSettingsForm) {
        appearanceSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const settings = Object.fromEntries(formData.entries());
            
            // Save settings (would typically be an API call)
            localStorage.setItem('appearanceSettings', JSON.stringify(settings));
            
            // Show success message
            showNotification('Apariencia actualizada correctamente', 'success');
        });
    }
    
    // Security settings form
    const securitySettingsForm = document.getElementById('securitySettingsForm');
    if (securitySettingsForm) {
        securitySettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get password fields
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords
            if (newPassword !== confirmPassword) {
                showNotification('Las contraseñas no coinciden', 'error');
                return;
            }
            
            if (newPassword && newPassword.length < 8) {
                showNotification('La contraseña debe tener al menos 8 caracteres', 'error');
                return;
            }
            
            // In a real app, you would verify the current password and update to the new one
            // For now, just show success
            showNotification('Configuración de seguridad actualizada', 'success');
            
            // Clear password fields
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        });
    }
    
    // Notifications settings form
    const notificationsSettingsForm = document.getElementById('notificationsSettingsForm');
    if (notificationsSettingsForm) {
        notificationsSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const settings = Object.fromEntries(formData.entries());
            
            // Save settings (would typically be an API call)
            localStorage.setItem('notificationSettings', JSON.stringify(settings));
            
            // Show success message
            showNotification('Preferencias de notificaciones actualizadas', 'success');
        });
    }
    
    // Add new project form
    const newProjectForm = document.getElementById('newProjectForm');
    if (newProjectForm) {
        newProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const projectData = Object.fromEntries(formData.entries());
            
            // Get existing projects or initialize empty array
            let projects = JSON.parse(localStorage.getItem('projects') || '[]');
            
            // Add new project with ID and date
            projectData.id = Date.now();
            projectData.createdAt = new Date().toISOString();
            projectData.status = 'active';
            
            projects.push(projectData);
            
            // Save updated projects
            localStorage.setItem('projects', JSON.stringify(projects));
            
            // Update dashboard data
            updateDashboardData('projects', 1);
            
            // Show success message
            showNotification('Proyecto creado correctamente', 'success');
            
            // Reset form
            this.reset();
            
            // Refresh project list
            loadProjects();
        });
    }
    
    // Add new user form
    const newUserForm = document.getElementById('newUserForm');
    if (newUserForm) {
        newUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const userData = Object.fromEntries(formData.entries());
            
            // Get existing users or initialize empty array
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Add new user with ID and date
            userData.id = Date.now();
            userData.createdAt = new Date().toISOString();
            userData.status = 'active';
            
            users.push(userData);
            
            // Save updated users
            localStorage.setItem('users', JSON.stringify(users));
            
            // Update dashboard data
            updateDashboardData('clients', 1);
            
            // Show success message
            showNotification('Usuario creado correctamente', 'success');
            
            // Reset form
            this.reset();
            
            // Refresh user list
            loadUsers();
        });
    }
    
    // Add new blog post form
    const newBlogPostForm = document.getElementById('newBlogPostForm');
    if (newBlogPostForm) {
        newBlogPostForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const postData = Object.fromEntries(formData.entries());
            
            // Get existing posts or initialize empty array
            let posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
            
            // Add new post with ID and date
            postData.id = Date.now();
            postData.createdAt = new Date().toISOString();
            postData.status = postData.status || 'draft';
            
            posts.push(postData);
            
            // Save updated posts
            localStorage.setItem('blogPosts', JSON.stringify(posts));
            
            // Show success message
            showNotification('Entrada creada correctamente', 'success');
            
            // Reset form
            this.reset();
            
            // Refresh blog post list
            loadBlogPosts();
        });
    }
}

// Initialize real-time data fetching
function initRealTimeData() {
    // In a real application, this would connect to your backend API
    // For now, we'll simulate data loading
    
    // Reset all counters to zero initially
    document.getElementById('projectsCount').textContent = '0';
    document.getElementById('clientsCount').textContent = '0';
    document.getElementById('messagesCount').textContent = '0';
    document.getElementById('visitsCount').textContent = '0';
    
    // Fetch real data (simulated)
    fetchDashboardData();
    
    // Set up periodic refresh
    setInterval(fetchDashboardData, 60000); // Refresh every minute
}

// Fetch dashboard data
function fetchDashboardData() {
    // In a real application, this would be an API call
    // For now, we'll use localStorage to simulate persistent data
    
    // Get or initialize data
    let dashboardData = localStorage.getItem('dashboardData');
    
    if (!dashboardData) {
        // Initialize with sample data if no data exists
        dashboardData = {
            projects: 12,
            clients: 45,
            messages: 8,
            visits: 1254,
            recentActivity: [
                {
                    icon: 'fa-user',
                    description: 'Nuevo cliente registrado: María López',
                    time: 'Hace 2 horas'
                },
                {
                    icon: 'fa-file-alt',
                    description: 'Proyecto actualizado: Rediseño de sitio web',
                    time: 'Hace 4 horas'
                },
                {
                    icon: 'fa-comment',
                    description: 'Nuevo comentario en el blog',
                    time: 'Hace 6 horas'
                },
                {
                    icon: 'fa-shopping-cart',
                    description: 'Nueva venta completada: $1,250',
                    time: 'Hace 1 día'
                }
            ]
        };
        
        // Save initial data
        localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
    } else {
        dashboardData = JSON.parse(dashboardData);
    }
    
    // Update dashboard counters with real data
    document.getElementById('projectsCount').textContent = dashboardData.projects;
    document.getElementById('clientsCount').textContent = dashboardData.clients;
    document.getElementById('messagesCount').textContent = dashboardData.messages;
    document.getElementById('visitsCount').textContent = dashboardData.visits;
    
    // Update notification badges
    const messageBadge = document.querySelector('.header-actions .fa-envelope + .notification-badge');
    if (messageBadge) {
        messageBadge.textContent = dashboardData.messages;
    }
    
    // Update recent activity
    updateRecentActivity(dashboardData.recentActivity);
}

// Update dashboard data
function updateDashboardData(key, increment) {
    let dashboardData = JSON.parse(localStorage.getItem('dashboardData') || '{}');
    
    if (dashboardData[key] !== undefined) {
        dashboardData[key] += increment;
        localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
        
        // Update counter in UI
        const counterElement = document.getElementById(`${key}Count`);
        if (counterElement) {
            counterElement.textContent = dashboardData[key];
        }
    }
}

// Update recent activity section
function updateRecentActivity(activities) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    // Clear existing activities
    activityList.innerHTML = '';
    
    // Add real activities if available
    if (activities && activities.length > 0) {
        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon"><i class="fas ${activity.icon}"></i></div>
                <div class="activity-info">
                    <p>${activity.description}</p>
                    <span>${activity.time}</span>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Set up close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Initialize dashboard charts
function initDashboardCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please include the Chart.js library.');
        return;
    }
    
    // Visitors chart
    const visitorsChart = document.getElementById('visitorsChart');
    if (visitorsChart) {
        const ctx = visitorsChart.getContext('2d');
        
        // Clear any existing chart
        if (visitorsChart.chart) {
            visitorsChart.chart.destroy();
        }
        
        // Create new chart
        visitorsChart.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Visitantes',
                    data: [1500, 1800, 2200, 1900, 2400, 2800, 3200, 3500, 3800, 4100, 4500, 5000],
                    borderColor: '#4e4376',
                    backgroundColor: 'rgba(78, 67, 118, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Traffic sources chart
    const trafficChart = document.getElementById('trafficChart');
    if (trafficChart) {
        const ctx = trafficChart.getContext('2d');
        
        // Clear any existing chart
        if (trafficChart.chart) {
            trafficChart.chart.destroy();
        }
        
        // Create new chart
        trafficChart.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Búsqueda orgánica', 'Redes sociales', 'Referidos', 'Directo'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        '#4e4376',
                        '#2b5876',
                        '#36b9cc',
                        '#1cc88a'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                },
                cutout: '70%'
            }
        });
    }
    
    // Sales chart
    const salesChart = document.getElementById('salesChart');
    if (salesChart) {
        const ctx = salesChart.getContext('2d');
        
        // Clear any existing chart
        if (salesChart.chart) {
            salesChart.chart.destroy();
        }
        
        // Create new chart
        salesChart.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Ventas',
                    data: [12500, 15800, 14200, 16900, 18400, 21800],
                    backgroundColor: '#2b5876',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize analytics charts
function initAnalyticsCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Please include the Chart.js library.');
        return;
    }
    
    // Page views chart
    const pageViewsChart = document.getElementById('pageViewsChart');
    if (pageViewsChart) {
        const ctx = pageViewsChart.getContext('2d');
        
        // Clear any existing chart
        if (pageViewsChart.chart) {
            pageViewsChart.chart.destroy();
        }
        
        // Create new chart
        pageViewsChart.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Esta semana',
                    data: [520, 680, 750, 620, 780, 830, 900],
                    borderColor: '#4e4376',
                    backgroundColor: 'rgba(78, 67, 118, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Semana pasada',
                    data: [480, 620, 680, 580, 740, 780, 850],
                    borderColor: '#2b5876',
                    backgroundColor: 'rgba(43, 88, 118, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // User demographics chart
    const demographicsChart = document.getElementById('demographicsChart');
    if (demographicsChart) {
        const ctx = demographicsChart.getContext('2d');
        
        // Clear any existing chart
        if (demographicsChart.chart) {
            demographicsChart.chart.destroy();
        }
        
        // Create new chart
        demographicsChart.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
                datasets: [{
                    data: [15, 30, 25, 18, 12],
                    backgroundColor: [
                        '#4e4376',
                        '#2b5876',
                        '#36b9cc',
                        '#1cc88a',
                        '#f6c23e'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }
}

// Initialize dropdowns
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('show');
            
            // Close other dropdowns
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== this) {
                    otherToggle.nextElementSibling.classList.remove('show');
                }
            });
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu.show').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    });
}

// Initialize file uploads
function initFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileNameElement = this.nextElementSibling;
            
            if (fileNameElement && this.files.length > 0) {
                fileNameElement.textContent = this.files[0].name;
            }
        });
    });
    
    // File upload form
    const fileUploadForm = document.getElementById('fileUploadForm');
    if (fileUploadForm) {
        fileUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fileInput = this.querySelector('input[type="file"]');
            
            if (fileInput.files.length === 0) {
                showNotification('Por favor selecciona un archivo', 'error');
                return;
            }
            
            // Simulate file upload
            showNotification('Subiendo archivo...', 'info');
            
            setTimeout(() => {
                // Get existing files or initialize empty array
                let files = JSON.parse(localStorage.getItem('files') || '[]');
                
                // Add new file
                const file = {
                    id: Date.now(),
                    name: fileInput.files[0].name,
                    size: fileInput.files[0].size,
                    type: fileInput.files[0].type,
                    uploadedAt: new Date().toISOString()
                };
                
                files.push(file);
                
                // Save updated files
                localStorage.setItem('files', JSON.stringify(files));
                
                // Show success message
                showNotification('Archivo subido correctamente', 'success');
                
                // Reset form
                this.reset();
                
                // Refresh file list
                loadFiles();
            }, 2000);
        });
    }
}

// Initialize data tables
function initDataTables() {
    // Load initial data
    loadProjects();
    loadUsers();
    loadBlogPosts();
    loadFiles();
}

// Load projects
function loadProjects() {
    const projectsList = document.getElementById('projectsList');
    if (!projectsList) return;
    
    // Get projects from localStorage
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    // Clear existing list
    projectsList.innerHTML = '';
    
    // Add projects to list
    if (projects.length === 0) {
        projectsList.innerHTML = '<div class="empty-state">No hay proyectos. Crea uno nuevo para comenzar.</div>';
    } else {
        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-card';
            projectItem.innerHTML = `
                <div class="project-header">
                    <h4>${project.name}</h4>
                    <span class="project-status status-${project.status}">${project.status === 'active' ? 'Activo' : 'Completado'}</span>
                </div>
                <p>${project.description}</p>
                <div class="project-meta">
                    <span><i class="fas fa-calendar"></i> ${new Date(project.createdAt).toLocaleDateString()}</span>
                    <span><i class="fas fa-user"></i> ${project.client}</span>
                </div>
                <div class="project-actions">
                    <button class="btn btn-sm btn-primary" data-project-id="${project.id}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger delete-project" data-project-id="${project.id}"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            `;
            projectsList.appendChild(projectItem);
        });
        
        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-project').forEach(button => {
            button.addEventListener('click', function() {
                const projectId = parseInt(this.getAttribute('data-project-id'));
                
                if (confirm('¿Estás seguro que deseas eliminar este proyecto?')) {
                    deleteProject(projectId);
                }
            });
        });
    }
}

// Delete project
function deleteProject(projectId) {
    // Get projects from localStorage
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    // Filter out the project to delete
    projects = projects.filter(project => project.id !== projectId);
    
    // Save updated projects
    localStorage.setItem('projects', JSON.stringify(projects));
    
    // Update dashboard data
    updateDashboardData('projects', -1);
    
    // Show success message
    showNotification('Proyecto eliminado correctamente', 'success');
    
    // Refresh project list
    loadProjects();
}

// Load users
function loadUsers() {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Clear existing list
    usersList.innerHTML = '';
    
    // Add users to list
    if (users.length === 0) {
        usersList.innerHTML = '<div class="empty-state">No hay usuarios. Crea uno nuevo para comenzar.</div>';
    } else {
        users.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'user-card';
            userItem.innerHTML = `
                <div class="user-avatar">${user.name.charAt(0)}</div>
                <div class="user-details">
                    <h4>${user.name}</h4>
                    <p>${user.email}</p>
                    <small>Registrado: ${new Date(user.createdAt).toLocaleDateString()}</small>
                </div>
                <div class="user-actions">
                    <button class="btn btn-sm btn-primary" data-user-id="${user.id}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger delete-user" data-user-id="${user.id}"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            `;
            usersList.appendChild(userItem);
        });
        
        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-user-id'));
                
                if (confirm('¿Estás seguro que deseas eliminar este usuario?')) {
                    deleteUser(userId);
                }
            });
        });
    }
}

// Delete user
function deleteUser(userId) {
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Filter out the user to delete
    users = users.filter(user => user.id !== userId);
    
    // Save updated users
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update dashboard data
    updateDashboardData('clients', -1);
    
    // Show success message
    showNotification('Usuario eliminado correctamente', 'success');
    
    // Refresh user list
    loadUsers();
}

// Load blog posts
function loadBlogPosts() {
    const blogPostsList = document.getElementById('blogPostsList');
    if (!blogPostsList) return;
    
    // Get blog posts from localStorage
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Clear existing list
    blogPostsList.innerHTML = '';
    
    // Add blog posts to list
    if (posts.length === 0) {
        blogPostsList.innerHTML = '<div class="empty-state">No hay entradas de blog. Crea una nueva para comenzar.</div>';
    } else {
        posts.forEach(post => {
            const postItem = document.createElement('div');
            postItem.className = 'blog-post-card';
            postItem.innerHTML = `
                <div class="blog-post-header">
                    <h4>${post.title}</h4>
                    <span class="blog-post-status status-${post.status}">${post.status === 'published' ? 'Publicado' : 'Borrador'}</span>
                </div>
                <p>${post.excerpt || post.content.substring(0, 150)}...</p>
                <div class="blog-post-meta">
                    <span><i class="fas fa-calendar"></i> ${new Date(post.createdAt).toLocaleDateString()}</span>
                    <span><i class="fas fa-tag"></i> ${post.category || 'Sin categoría'}</span>
                </div>
                <div class="blog-post-actions">
                    <button class="btn btn-sm btn-primary" data-post-id="${post.id}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-danger delete-post" data-post-id="${post.id}"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            `;
            blogPostsList.appendChild(postItem);
        });
        
        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-post').forEach(button => {
            button.addEventListener('click', function() {
                const postId = parseInt(this.getAttribute('data-post-id'));
                
                if (confirm('¿Estás seguro que deseas eliminar esta entrada?')) {
                    deleteBlogPost(postId);
                }
            });
        });
    }
}

// Delete blog post
function deleteBlogPost(postId) {
    // Get blog posts from localStorage
    let posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Filter out the post to delete
    posts = posts.filter(post => post.id !== postId);
    
    // Save updated posts
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    // Show success message
    showNotification('Entrada eliminada correctamente', 'success');
    
    // Refresh blog post list
    loadBlogPosts();
}

// Load files
function loadFiles() {
    const filesList = document.getElementById('filesList');
    if (!filesList) return;
    
    // Get files from localStorage
    const files = JSON.parse(localStorage.getItem('files') || '[]');
    
    // Clear existing list
    filesList.innerHTML = '';
    
    // Add files to list
    if (files.length === 0) {
        filesList.innerHTML = '<div class="empty-state">No hay archivos. Sube uno nuevo para comenzar.</div>';
    } else {
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-card';
            
            // Determine file icon based on type
            let fileIcon = 'fa-file';
            if (file.type.includes('image')) {
                fileIcon = 'fa-file-image';
            } else if (file.type.includes('pdf')) {
                fileIcon = 'fa-file-pdf';
            } else if (file.type.includes('word') || file.type.includes('document')) {
                fileIcon = 'fa-file-word';
            } else if (file.type.includes('excel') || file.type.includes('sheet')) {
                fileIcon = 'fa-file-excel';
            }
            
            // Format file size
            const fileSize = formatFileSize(file.size);
            
            fileItem.innerHTML = `
                <div class="file-icon"><i class="fas ${fileIcon}"></i></div>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>${fileSize}</p>
                    <small>Subido: ${new Date(file.uploadedAt).toLocaleDateString()}</small>
                </div>
                <div class="file-actions">
                    <button class="btn btn-sm btn-primary" data-file-id="${file.id}"><i class="fas fa-download"></i> Descargar</button>
                    <button class="btn btn-sm btn-danger delete-file" data-file-id="${file.id}"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            `;
            filesList.appendChild(fileItem);
        });
        
        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-file').forEach(button => {
            button.addEventListener('click', function() {
                const fileId = parseInt(this.getAttribute('data-file-id'));
                
                if (confirm('¿Estás seguro que deseas eliminar este archivo?')) {
                    deleteFile(fileId);
                }
            });
        });
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Delete file
function deleteFile(fileId) {
    // Get files from localStorage
    let files = JSON.parse(localStorage.getItem('files') || '[]');
    
    // Filter out the file to delete
    files = files.filter(file => file.id !== fileId);
    
    // Save updated files
    localStorage.setItem('files', JSON.stringify(files));
    
    // Show success message
    showNotification('Archivo eliminado correctamente', 'success');
    
    // Refresh file list
    loadFiles();
}

// Initialize user management
function initUserManagement() {
    // User role management
    const roleSelects = document.querySelectorAll('.user-role-select');
    
    roleSelects.forEach(select => {
        select.addEventListener('change', function() {
            const userId = this.getAttribute('data-user-id');
            const newRole = this.value;
            
            // Update user role (would typically be an API call)
            updateUserRole(userId, newRole);
        });
    });
    
    // User status toggles
    const statusToggles = document.querySelectorAll('.user-status-toggle');
    
    statusToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const userId = this.getAttribute('data-user-id');
            const newStatus = this.checked ? 'active' : 'inactive';
            
            // Update user status (would typically be an API call)
            updateUserStatus(userId, newStatus);
        });
    });
}

// Update user role
function updateUserRole(userId, newRole) {
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user and update role
    const userIndex = users.findIndex(user => user.id === parseInt(userId));
    
    if (userIndex !== -1) {
        users[userIndex].role = newRole;
        
        // Save updated users
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        showNotification(`Rol de usuario actualizado a ${newRole}`, 'success');
    }
}

// Update user status
function updateUserStatus(userId, newStatus) {
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user and update status
    const userIndex = users.findIndex(user => user.id === parseInt(userId));
    
    if (userIndex !== -1) {
        users[userIndex].status = newStatus;
        
        // Save updated users
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show success message
        showNotification(`Estado de usuario actualizado a ${newStatus === 'active' ? 'activo' : 'inactivo'}`, 'success');
    }
}

// Initialize blog management
function initBlogManagement() {
    // Blog post editor (if using a WYSIWYG editor like TinyMCE)
    if (typeof tinymce !== 'undefined') {
        tinymce.init({
            selector: '#postContent',
            height: 300,
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; }'
        });
    }
    
    // Blog post status toggles
    const statusToggles = document.querySelectorAll('.post-status-toggle');
    
    statusToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const postId = this.getAttribute('data-post-id');
            const newStatus = this.checked ? 'published' : 'draft';
            
            // Update post status (would typically be an API call)
            updatePostStatus(postId, newStatus);
        });
    });
    
    // Blog categories management
    const addCategoryForm = document.getElementById('addCategoryForm');
    
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const categoryName = document.getElementById('newCategoryName').value;
            
            if (!categoryName.trim()) {
                showNotification('Por favor ingresa un nombre de categoría', 'error');
                return;
            }
            
            // Get existing categories or initialize empty array
            let categories = JSON.parse(localStorage.getItem('blogCategories') || '[]');
            
            // Check if category already exists
            if (categories.includes(categoryName)) {
                showNotification('Esta categoría ya existe', 'error');
                return;
            }
            
            // Add new category
            categories.push(categoryName);
            
            // Save updated categories
            localStorage.setItem('blogCategories', JSON.stringify(categories));
            
            // Show success message
            showNotification('Categoría creada correctamente', 'success');
            
            // Reset form
            this.reset();
            
            // Refresh categories list
            loadBlogCategories();
        });
    }
}

// Update post status
function updatePostStatus(postId, newStatus) {
    // Get blog posts from localStorage
    let posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Find post and update status
    const postIndex = posts.findIndex(post => post.id === parseInt(postId));
    
    if (postIndex !== -1) {
        posts[postIndex].status = newStatus;
        
        // Save updated posts
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        
        // Show success message
        showNotification(`Estado de entrada actualizado a ${newStatus === 'published' ? 'publicado' : 'borrador'}`, 'success');
    }
}

// Load blog categories
function loadBlogCategories() {
    const categoriesList = document.getElementById('categoriesList');
    if (!categoriesList) return;
    
    // Get categories from localStorage
    const categories = JSON.parse(localStorage.getItem('blogCategories') || '[]');
    
    // Clear existing list
    categoriesList.innerHTML = '';
    
    // Add categories to list
    if (categories.length === 0) {
        categoriesList.innerHTML = '<div class="empty-state">No hay categorías. Crea una nueva para comenzar.</div>';
    } else {
        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.innerHTML = `
                <span>${category}</span>
                <button class="btn btn-sm btn-danger delete-category" data-category="${category}"><i class="fas fa-trash"></i></button>
            `;
            categoriesList.appendChild(categoryItem);
        });
        
        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-category').forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                if (confirm('¿Estás seguro que deseas eliminar esta categoría?')) {
                    deleteCategory(category);
                }
            });
        });
    }
}

// Delete category
function deleteCategory(category) {
    // Get categories from localStorage
    let categories = JSON.parse(localStorage.getItem('blogCategories') || '[]');
    
    // Filter out the category to delete
    categories = categories.filter(cat => cat !== category);
    
    // Save updated categories
    localStorage.setItem('blogCategories', JSON.stringify(categories));
    
    // Show success message
    showNotification('Categoría eliminada correctamente', 'success');
    
    // Refresh categories list
    loadBlogCategories();
}

// Initialize project management
function initProjectManagement() {
    // Project status toggles
    const statusToggles = document.querySelectorAll('.project-status-toggle');
    
    statusToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const projectId = this.getAttribute('data-project-id');
            const newStatus = this.checked ? 'active' : 'completed';
            
            // Update project status (would typically be an API call)
            updateProjectStatus(projectId, newStatus);
        });
    });
    
    // Project task management
    const addTaskForm = document.getElementById('addTaskForm');
    
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const projectId = this.getAttribute('data-project-id');
            const taskName = document.getElementById('newTaskName').value;
            
            if (!taskName.trim()) {
                showNotification('Por favor ingresa un nombre de tarea', 'error');
                return;
            }
            
            // Get existing tasks or initialize empty array
            let tasks = JSON.parse(localStorage.getItem(`projectTasks_${projectId}`) || '[]');
            
            // Add new task
            const task = {
                id: Date.now(),
                name: taskName,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            tasks.push(task);
            
            // Save updated tasks
            localStorage.setItem(`projectTasks_${projectId}`, JSON.stringify(tasks));
            
            // Show success message
            showNotification('Tarea creada correctamente', 'success');
            
            // Reset form
            this.reset();
            
            // Refresh tasks list
            loadProjectTasks(projectId);
        });
    }
    
    // Project timeline management
    const addMilestoneForm = document.getElementById('addMilestoneForm');
    
    if (addMilestoneForm) {
        addMilestoneForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const projectId = this.getAttribute('data-project-id');
            const milestoneName = document.getElementById('newMilestoneName').value;
            const milestoneDate = document.getElementById('newMilestoneDate').value;
            
            if (!milestoneName.trim() || !milestoneDate) {
                showNotification('Por favor completa todos los campos', 'error');
                return;
            }
            
            // Get existing milestones or initialize empty array
            let milestones = JSON.parse(localStorage.getItem(`projectMilestones_${projectId}`) || '[]');
            
            // Add new milestone
            const milestone = {
                id: Date.now(),
                name: milestoneName,
                date: milestoneDate,
                completed: false
            };
            
            milestones.push(milestone);
            
            // Save updated milestones
            localStorage.setItem(`projectMilestones_${projectId}`, JSON.stringify(milestones));
            
            // Show success message
            showNotification('Hito creado correctamente', 'success');
            
            // Reset form
            this.reset();
            
            // Refresh milestones list
            loadProjectMilestones(projectId);
        });
    }
}

// Update project status
function updateProjectStatus(projectId, newStatus) {
    // Get projects from localStorage
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    // Find project and update status
    const projectIndex = projects.findIndex(project => project.id === parseInt(projectId));
    
    if (projectIndex !== -1) {
        projects[projectIndex].status = newStatus;
        
        // Save updated projects
        localStorage.setItem('projects', JSON.stringify(projects));
        
        // Show success message
        showNotification(`Estado de proyecto actualizado a ${newStatus === 'active' ? 'activo' : 'completado'}`, 'success');
    }
}

// Load project tasks
function loadProjectTasks(projectId) {
    const tasksList = document.getElementById(`tasksList_${projectId}`);
    if (!tasksList) return;
    
    // Get tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem(`projectTasks_${projectId}`) || '[]');
    
    // Clear existing list
    tasksList.innerHTML = '';
    
    // Add tasks to list
    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state">No hay tareas. Crea una nueva para comenzar.</div>';
    } else {
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <div class="task-checkbox">
                    <input type="checkbox" id="task_${task.id}" ${task.completed ? 'checked' : ''} data-task-id="${task.id}" data-project-id="${projectId}">
                    <label for="task_${task.id}">${task.name}</label>
                </div>
                <button class="btn btn-sm btn-danger delete-task" data-task-id="${task.id}" data-project-id="${projectId}"><i class="fas fa-trash"></i></button>
            `;
            tasksList.appendChild(taskItem);
        });
        
        // Add event listeners for checkboxes
        tasksList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const taskId = parseInt(this.getAttribute('data-task-id'));
                const projectId = this.getAttribute('data-project-id');
                const completed = this.checked;
                
                updateTaskStatus(projectId, taskId, completed);
            });
        });
        
        // Add event listeners for delete buttons
        tasksList.querySelectorAll('.delete-task').forEach(button => {
            button.addEventListener('click', function() {
                const taskId = parseInt(this.getAttribute('data-task-id'));
                const projectId = this.getAttribute('data-project-id');
                
                if (confirm('¿Estás seguro que deseas eliminar esta tarea?')) {
                    deleteTask(projectId, taskId);
                }
            });
        });
    }
}

// Update task status
function updateTaskStatus(projectId, taskId, completed) {
    // Get tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem(`projectTasks_${projectId}`) || '[]');
    
    // Find task and update status
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
        
        // Save updated tasks
        localStorage.setItem(`projectTasks_${projectId}`, JSON.stringify(tasks));
        
        // Update task item in UI
        const taskItem = document.querySelector(`#task_${taskId}`).closest('.task-item');
        if (completed) {
            taskItem.classList.add('completed');
        } else {
            taskItem.classList.remove('completed');
        }
    }
}

// Delete task
function deleteTask(projectId, taskId) {
    // Get tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem(`projectTasks_${projectId}`) || '[]');
    
    // Filter out the task to delete
    tasks = tasks.filter(task => task.id !== taskId);
    
    // Save updated tasks
    localStorage.setItem(`projectTasks_${projectId}`, JSON.stringify(tasks));
    
    // Show success message
    showNotification('Tarea eliminada correctamente', 'success');
    
    // Refresh tasks list
    loadProjectTasks(projectId);
}

// Load project milestones
function loadProjectMilestones(projectId) {
    const milestonesList = document.getElementById(`milestonesList_${projectId}`);
    if (!milestonesList) return;
    
    // Get milestones from localStorage
    const milestones = JSON.parse(localStorage.getItem(`projectMilestones_${projectId}`) || '[]');
    
    // Clear existing list
    milestonesList.innerHTML = '';
    
    // Add milestones to list
    if (milestones.length === 0) {
        milestonesList.innerHTML = '<div class="empty-state">No hay hitos. Crea uno nuevo para comenzar.</div>';
    } else {
        // Sort milestones by date
        milestones.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        milestones.forEach(milestone => {
            const milestoneItem = document.createElement('div');
            milestoneItem.className = `milestone-item ${milestone.completed ? 'completed' : ''}`;
            milestoneItem.innerHTML = `
                <div class="milestone-date">${new Date(milestone.date).toLocaleDateString()}</div>
                <div class="milestone-content">
                    <h4>${milestone.name}</h4>
                    <div class="milestone-actions">
                        <button class="btn btn-sm ${milestone.completed ? 'btn-success' : 'btn-primary'} toggle-milestone" data-milestone-id="${milestone.id}" data-project-id="${projectId}">
                            <i class="fas ${milestone.completed ? 'fa-check-circle' : 'fa-circle'}"></i> ${milestone.completed ? 'Completado' : 'Marcar como completado'}
                        </button>
                        <button class="btn btn-sm btn-danger delete-milestone" data-milestone-id="${milestone.id}" data-project-id="${projectId}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            milestonesList.appendChild(milestoneItem);
        });
        
        // Add event listeners for toggle buttons
        milestonesList.querySelectorAll('.toggle-milestone').forEach(button => {
            button.addEventListener('click', function() {
                const milestoneId = parseInt(this.getAttribute('data-milestone-id'));
                const projectId = this.getAttribute('data-project-id');
                
                toggleMilestoneStatus(projectId, milestoneId);
            });
        });
        
        // Add event listeners for delete buttons
        milestonesList.querySelectorAll('.delete-milestone').forEach(button => {
            button.addEventListener('click', function() {
                const milestoneId = parseInt(this.getAttribute('data-milestone-id'));
                const projectId = this.getAttribute('data-project-id');
                
                if (confirm('¿Estás seguro que deseas eliminar este hito?')) {
                    deleteMilestone(projectId, milestoneId);
                }
            });
        });
    }
}

// Toggle milestone status
function toggleMilestoneStatus(projectId, milestoneId) {
    // Get milestones from localStorage
    let milestones = JSON.parse(localStorage.getItem(`projectMilestones_${projectId}`) || '[]');
    
    // Find milestone and toggle status
    const milestoneIndex = milestones.findIndex(milestone => milestone.id === milestoneId);
    
    if (milestoneIndex !== -1) {
        milestones[milestoneIndex].completed = !milestones[milestoneIndex].completed;
        
        // Save updated milestones
        localStorage.setItem(`projectMilestones_${projectId}`, JSON.stringify(milestones));
        
        // Show success message
        showNotification(`Hito marcado como ${milestones[milestoneIndex].completed ? 'completado' : 'pendiente'}`, 'success');
        
        // Refresh milestones list
        loadProjectMilestones(projectId);
    }
}

// Delete milestone
function deleteMilestone(projectId, milestoneId) {
    // Get milestones from localStorage
    let milestones = JSON.parse(localStorage.getItem(`projectMilestones_${projectId}`) || '[]');
    
    // Filter out the milestone to delete
    milestones = milestones.filter(milestone => milestone.id !== milestoneId);
    
    // Save updated milestones
    localStorage.setItem(`projectMilestones_${projectId}`, JSON.stringify(milestones));
    
    // Show success message
    showNotification('Hito eliminado correctamente', 'success');
    
    // Refresh milestones list
    loadProjectMilestones(projectId);
}

// Add event listeners for quick action buttons
document.addEventListener('DOMContentLoaded', function() {
    const quickActionButtons = document.querySelectorAll('.quick-action-btn');
    
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const actionText = this.querySelector('p').textContent;
            
            // Handle different quick actions
            switch(actionText) {
                case 'Nuevo Proyecto':
                    // Switch to projects tab and show form
                    document.querySelector('[data-tab="projects"]').click();
                    showNotification('Formulario de nuevo proyecto abierto', 'info');
                    break;
                    
                case 'Nuevo Usuario':
                    // Switch to users tab and show form
                    document.querySelector('[data-tab="users"]').click();
                    showNotification('Formulario de nuevo usuario abierto', 'info');
                    break;
                    
                case 'Subir Archivo':
                    // Switch to files tab and show upload form
                    document.querySelector('[data-tab="files"]').click();
                    showNotification('Formulario de subida de archivos abierto', 'info');
                    break;
                    
                case 'Nueva Entrada':
                    // Switch to blog tab and show new post form
                    document.querySelector('[data-tab="blog"]').click();
                    showNotification('Formulario de nueva entrada abierto', 'info');
                    break;
                    
                default:
                    showNotification('Acción no implementada', 'error');
            }
        });
    });
});

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    // On small screens, collapse sidebar by default
    if (window.innerWidth < 768 && !sidebar.classList.contains('collapsed')) {
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }
});