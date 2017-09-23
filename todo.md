- Implement details view
    - Add skills event handlers
    - Navigation

- Replace all the navigation with window.Navigate
- Remove Views folder
- Add a parameter in bindDefaultEventHandlers to choose what event handlers to bind
- Use redux-thunk
? Oops! The view is not available

window.Navigate('employee-details-section', {
	employeeId: 15,
	readOnly: true
});