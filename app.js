
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

$(document).ready(function () {
    function renderSkills() {
        const programmingList = $('#programming').empty();
        const techList = $('#tech').empty();
        const othersList = $('#others').empty();

        skillsArray.forEach(skill => {
            const skillItem = createSkillElement(skill);

            switch (skill.category) {
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

        $('#skill-search').off('input').on('input', function () {
            const searchTerm = $(this).val().toLowerCase();
            $('.skill-item').each(function () {
                const skillText = $(this).find('.skill-text').text().toLowerCase();
                $(this).toggle(skillText.includes(searchTerm));
            });
        });
    }

    function createSkillElement(skill) {
        const li = $('<li>').addClass('skill-item d-flex justify-content-between align-items-center mb-2').attr('data-id', skill.id);
        const skillText = $('<span>').addClass('skill-text').text(skill.name);
        const buttonsDiv = $('<div>').addClass('buttons');

        const editBtn = $('<button>').addClass('btn btn-sm btn-warning me-2').html('<i class="fas fa-edit"></i>').click(() => startEditingSkill(skill.id));
        const deleteBtn = $('<button>').addClass('btn btn-sm btn-danger').html('<i class="fas fa-trash"></i>').click(() => removeSkill(skill.id));

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

        const newSkill = { id: nextSkillId++, name: name, category: category };
        skillsArray.push(newSkill);
        renderSkills();
        $(`[data-id="${newSkill.id}"]`).hide().fadeIn(500);
        return true;
    }

    function removeSkill(id) {
        const index = skillsArray.findIndex(skill => skill.id === id);
        if (index !== -1) {
            const skillElement = $(`[data-id="${id}"]`);
            skillElement.slideUp(300, function () {
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

    $('#skill-form').submit(function (e) {
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

    $('#skill-input').on('keydown', function (e) {
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

    renderSkills();
});
