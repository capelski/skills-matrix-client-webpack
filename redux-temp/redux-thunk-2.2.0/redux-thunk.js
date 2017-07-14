function createThunkMiddleware(extraArgument) {
	return function (store) {
		return function(next) {
			return function(action) {
				if (typeof action === 'function') {
					return action(store.dispatch, store.getState, extraArgument);
				}
				return next(action);
			};
		}
	}
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;