console.log('Hello World!');

let skillsArray = [
    { id: 1, name: 'C', category: 'Programming Languages' },
    { id: 2, name: 'Java', category: 'Programming Languages' },
    { id: 3, name: 'Python', category: 'Programming Languages' },
    { id: 4, name: 'HTML', category: 'Technologies' },
    { id: 5, name: 'CSS', category: 'Technologies' },
    { id: 6, name: 'JavaScript', category: 'Technologies' },
    { id: 7, name: 'Machine Learning', category: 'Technologies' }
];

let nextSkillId = skillsArray.length + 1;
let editingSkillId = null;

const navItems = [
    { id: 'summary', text: 'Summary' },
    { id: 'skills', text: 'Skills' },
    { id: 'projects', text: 'Projects' },
    { id: 'education', text: 'Education' },
    { id: 'contact', text: 'Contact' }
];

const name = "Kalyana Balaji Rajgopal Pabbisetty";

let hasDownloadedResume = false;
let downloadCount = 0;
let alertShown = false;

$(document).ready(function() {

    function showGreeting() {
        let currentHour = new Date().getHours();
        let greeting = "";

        if (currentHour >= 5 && currentHour < 12) {
            greeting = "Good Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            greeting = "Good Afternoon";
        } else {
            greeting = "Good Evening";
        }

        return greeting + ", my name is " + name + "! Welcome to my portfolio!";
    }

    $("#greeting").html(showGreeting());

    function renderNavigation() {
        const navList = $('<ul>').addClass('navbar-nav me-auto mb-2 mb-lg-0');
        
        navItems.forEach(item => {
            const li = $('<li>').addClass('nav-item');
            const link = $('<a>')
                .addClass('nav-link')
                .attr('href', `#${item.id}`)
                .text(item.text)
                .click(function(e) {
                    e.preventDefault();
                    $('html, body').animate({
                        scrollTop: $(`#${item.id}`).offset().top - 70
                    }, 800);
                });
            li.append(link);
            navList.append(li);
        });

        const downloadBtn = $('<li>').addClass('nav-item');
        const downloadLink = $('<a>')
            .addClass('btn btn-primary ms-lg-3')
            .attr({
                'href': 'https://drive.google.com/file/d/12Kp42UZLQ_XR-ckg99_5ejWZaRRUMlht/view?usp=drive_link',
                'target': '_blank'
            })
            .text('Download Resume')
            .click(function() {
                downloadCount++;
                $('#download-count').text(downloadCount);
                if (!alertShown) {
                    alertShown = true;
                    setTimeout(function() {
                        alert("Your resume downloaded successfully!");
                    }, 2000);
                }
            });
        downloadBtn.append(downloadLink);
        navList.append(downloadBtn);

        const downloadCounter = $('<li>').addClass('nav-item ms-3');
        const counterSpan = $('<span>')
            .addClass('text-white')
            .html('DOWNLOADS: <span id="download-count">0</span>'); 
        downloadCounter.append(counterSpan);
        navList.append(downloadCounter);

        $('#navbarNav').html(navList);
    }

    function renderSkills() {
        const programmingList = $('#programming').empty();
        const techList = $('#tech').empty();
        const othersList = $('#others').empty();

        skillsArray.forEach(skill => {
            const skillItem = createSkillElement(skill);
            
            switch(skill.category) {
                case 'Programming Languages':
                    programmingList.append(skillItem);
                    break;
                case 'Technologies':
                    techList.append(skillItem);
                    break;
                default:
                    othersList.append(skillItem);
            }
        });
    }

    function createSkillElement(skill) {
        const li = $('<li>')
            .addClass('skill-item d-flex justify-content-between align-items-center mb-2')
            .attr('data-id', skill.id);
        
        const skillText = $('<span>')
            .addClass('skill-text')
            .text(skill.name);
        
        const buttonsDiv = $('<div>')
            .addClass('buttons');
        
        const editBtn = $('<button>')
            .addClass('btn btn-sm btn-warning me-2')
            .html('<i class="fas fa-edit"></i>')
            .click(() => startEditingSkill(skill.id));
        
        const deleteBtn = $('<button>')
            .addClass('btn btn-sm btn-danger')
            .html('<i class="fas fa-trash"></i>')
            .click(() => removeSkill(skill.id));
        
        buttonsDiv.append(editBtn, deleteBtn);
        li.append(skillText, buttonsDiv);
        
        return li;
    }

    function addSkill(name, category) {
        if (!name.trim()) return false;
        
        if (skillsArray.some(skill => skill.name.toLowerCase() === name.toLowerCase())) {
            alert('This skill already exists!');
            return false;
        }

        const newSkill = {
            id: nextSkillId++,
            name: name,
            category: category
        };

        skillsArray.push(newSkill);
        renderSkills();

        $(`[data-id="${newSkill.id}"]`).hide().fadeIn(500);
        return true;
    }

    function removeSkill(id) {
        const index = skillsArray.findIndex(skill => skill.id === id);
        if (index !== -1) {
            const skillElement = $(`[data-id="${id}"]`);
            skillElement.slideUp(300, function() {
                skillsArray.splice(index, 1);
                renderSkills();
            });
        }
    }

    function startEditingSkill(id) {
        const skill = skillsArray.find(s => s.id === id);
        if (skill) {
            editingSkillId = id;
            $('#skill-input').val(skill.name);
            $('#category-select').val(skill.category);
            $('#skill-submit').text('Update Skill');
        }
    }

    function updateSkill(id, newName, newCategory) {
        const skill = skillsArray.find(s => s.id === id);
        if (skill) {
            skill.name = newName;
            skill.category = newCategory;
            renderSkills();
            $(`[data-id="${id}"]`).hide().fadeIn(500);
        }
    }

    $('#skill-form').submit(function(e) {
        e.preventDefault();
        const skillName = $('#skill-input').val().trim();
        const category = $('#category-select').val();

        if (editingSkillId !== null) {
            updateSkill(editingSkillId, skillName, category);
            editingSkillId = null;
            $('#skill-submit').text('Add Skill');
        } else {
            addSkill(skillName, category);
        }

        $('#skill-input').val('');
    });

    $('#skill-input').on('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            $('#skill-form').submit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            $(this).val('');
            editingSkillId = null;
            $('#skill-submit').text('Add Skill');
        }
    });

    $('#skill-search').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $('.skill-item').show();

        if (searchTerm) {
            $('.skill-item').each(function() {
                const skillText = $(this).find('.skill-text').text().toLowerCase();
                if (!skillText.includes(searchTerm)) {
                    $(this).hide();
                }
            });
        }
    });

    const projects = [
        {
            title: "Portfolio Page (Web Development)",
            description: "Developing my Portfolio Page as part of CS-212 Course.",
            deadline: new Date("2024-12-09"),
            images: [
                "https://kp2469.blob.core.windows.net/images/image5.png",
                "https://kp2469.blob.core.windows.net/images/image6.png"
            ]
        },
        {
            title: "House Price Prediction in Bengaluru",
            description: "An industry-oriented project on predicting house prices using machine learning techniques.",
            deadline: new Date("2023-10-01"),
            images: [
                "https://kp2469.blob.core.windows.net/images/image1.png",
                "https://kp2469.blob.core.windows.net/images/image3.png"
            ]
        },
        {
            title: "Social Media Manager",
            description: "Managed Instagram theme pages, created engaging content, and drove high audience interaction.",
            deadline: new Date("2023-09-15"),
            images: [
                "https://kp2469.blob.core.windows.net/images/image2.png",
                "https://kp2469.blob.core.windows.net/images/image4.png"
            ]
        }
    ];

    function renderProjects(projectsArray) {
        const projectsList = $('#projects-list').empty();
        
        projectsArray.forEach(project => {
            const projectCard = $('<div>').addClass('col-md-6');
            projectCard.html(
                `<div class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${project.title}</h5>
                        <p>${project.description}</p>
                        <div class="image-container">
                            <img src="${project.images[0]}" alt="${project.title} Image 1" class="img-fluid">
                            <img src="${project.images[1]}" alt="${project.title} Image 2" class="project-image">
                        </div>
                        <p>Project Deadline: ${project.deadline.toLocaleDateString()}</p>
                        <p>Status: ${project.deadline > new Date() ? 'Ongoing' : 'Completed'}</p>
                    </div>
                </div>`
            );
            projectsList.append(projectCard);
        });
    }

    $('#sort-projects').click(function() {
        const isAscending = $(this).data('ascending');
        projects.sort((a, b) => {
            return isAscending ? 
                a.deadline - b.deadline : 
                b.deadline - a.deadline;
        });
        $(this).data('ascending', !isAscending);
        $(this).text(`Sort by Deadline (${isAscending ? 'Latest First' : 'Earliest First'})`);
        renderProjects(projects);
    });

    const educationData = [
        { institution: "Northern Arizona University", degree: "Bachelor of Science in Computer Science", year: "2022 - 2026" },
        { institution: "Narayana Junior College", degree: "Senior Secondary Education", year: "2019 - 2021" }
    ];

    const experienceData = [
        { title: "Front Door Volunteer", company: "NAU International Student Orientation", duration: "August 2024" },
        { title: "Legal Assistant", company: "Private Law Firm", duration: "2021 - 2022" },
        { title: "Data Science & Machine Learning Internship", company: "Diginique TechLabs", duration: "October 2022" }
    ];

    function createTable(data, headers) {
        const table = document.createElement('table');
        table.className = 'table table-striped table-bordered';
        
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        data.forEach(item => {
            const row = document.createElement('tr');
            Object.values(item).forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        
        return table;
    }

    document.getElementById('education-table').appendChild(createTable(educationData, ["Institution", "Degree", "Graduation Year"]));
    document.getElementById('experience-table').appendChild(createTable(experienceData, ["Job Title", "Company", "Duration"]));

    renderNavigation();
    renderSkills();
    renderProjects(projects);
});