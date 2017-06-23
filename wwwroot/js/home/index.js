(function() {
    var ajax = window.application.ajax;
    var state = {
        employees: [],
        skills: []
    };
    var htmlNodes = {
        employeesLoader : $('#employees-loader'),
        employeesList: $('#employees-list'),
        employeesKeywords: $('#employees-keywords'),
        skillsLoader : $('#skills-loader'),
        skillsList: $('#skills-list'),
        skillsKeywords: $('#skills-keywords')
    };
    var employeesSearchList = new window.application.SearchList('employees', employeesPromise, {
        elementDrawer: employeeDrawer
    });
    var skillsSearchList = new window.application.SearchList('skills', skillsPromise, {
        elementDrawer: skillDrawer
    });

    employeesSearchList.reload();
    skillsSearchList.reload();

    function employeeDrawer(employee) {
        return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name +
        '</a><span class="badge">' + employee.Skills.length + '</span></li>';
    }

    function employeesPromise(keywords) {
        state.keywords = keywords;
        return ajax.get('/api/employee/getMostSkilled')
        .then(function(employees) {
            state.employees = employees;
            return employees;
        });
    }

    function skillDrawer(skill) {
        return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name +
        '</a><span class="badge">' + skill.Employees.length + '</span></li>';
    }

    function skillsPromise(keywords) {
        state.keywords = keywords;
        return ajax.get('/api/skill/getRearest')
        .then(function(skills) {
            state.skills = skills;
            return skills;
        });
    }
})();
