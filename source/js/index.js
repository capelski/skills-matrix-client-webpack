import js from './utils/js-commons';

js.injectLoader();

import Home from './home/home';
import EmployeesList from './employees/list';
import EmployeeDetails from './employees/details';
import SkillsList from './skills/list';
import SkillDetails from './skills/details';

var views = [
	Home,
	EmployeesList,
	EmployeeDetails,
	SkillsList,
	SkillDetails
];

import createStore from './utils/store';
import defineNavigation from './utils/navigation';

var store = createStore(views);
window.Navigate = defineNavigation(store, views);
