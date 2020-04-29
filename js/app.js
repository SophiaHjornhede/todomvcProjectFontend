(function (Vue) {

		// Creating the vue instance
		window.vm = new Vue({
		// App name
		el: '#toDoapps',
		// Declaring data properties linked with HTML
		data: {
			toDo: JSON.parse(window.localStorage.getItem('toDo') || '[]'),	// reading file to array 
			modifyCondition: null,	// No edit state as default
			viewMode: 'all'   // Setting default filter state as show all
		},

		// Using computed properties for keeping el: cleaner
		computed: {
			/**
			 * A switch for filtering setting the viewMode
			 */
			toDoFilter: function () {
				switch (this.viewMode) {
					// depending on viewMode state return number of object
					
					case 'completed':
						return this.toDo.filter(function (item) {
							return item.checkstate === true})
						break;
					// returning active objects
					case 'active':
						return this.toDo.filter(function (item) {
							return item.checkstate === false})
						break;

					default:
						return this.toDo
						break;
				}
			},

			/**
			 * Returning number of items left to do.
			 */
			itemleft: function () {
				return this.toDoFilter.length;
			},


			/**
			 * filter all todos with false= not finsihed state
			 */
			toggleAllStat: function () {
				return this.toDo.filter(item => item.checkstate === false);
			}
		},

		// Watching toDo array for changes and updates the localstorage.
		// https://travishorn.com/add-localstorage-to-your-vue-app-in-2-lines-of-code-56eb2c9f371b
		watch: {
            toDo: {
                handler(val, absent) {
                    window.localStorage.setItem('toDo', JSON.stringify(val))
				},
				//  Directs Vue to look at all nested properties inside the array.
                deep: true,
            }
        },

		/**
		 * - Vue methods -
		 * Event listeners, which usually change the state/data somehow :)
		 */
		methods: {
			// Tiggers created in index.html
			selectAllFromHTML: function (event) {
				// Reading checkstate for elements and th
				const check = event.target.checked;
				this.toDo.forEach(function (item) {
					item.checkstate = check;
				})
			},

			// Adding toDo element to array with some default settings
			addTodo: function (event) {
				// reading value
				const valueStr = event.target.value;
				// Giving toDo id as the end of list
				var endTodo = this.toDo[this.toDo.length - 1];
				// setting ID depening on list length
				var setid = endTodo ? endTodo.id + 1 : 1;
				// Creating the object with linked properties and push them to the array
				this.toDo.push({
					id: setid,
					toDoText: valueStr,
					checkstate: false
				})
				// Default text set to nothing
				event.target.value = "";
			},

			// Removing element form array with splice
			removeItem: function (array) {
				this.toDo.splice(array, 1);
			},

			
			// Filter for removing all done from array
			removeALLDone: function () {

				this.toDo = this.toDo.filter(function (item) {
					return !item.checkstate
				})
			}

		},
	}	
	
	)

	// function for altering the address in the webbrowser, altering the vm.viewMode hashString
	// https://stackoverflow.com/questions/9235304/how-to-replace-the-location-hash-and-only-keep-the-last-history-entry
	// https://stackoverflow.com/questions/11588482/how-can-i-replace-a-windows-url-hash-with-another-response
	window.onhashchange = function () {
		
		const hashStr = location.hash.replace("#/", "");
		vm.viewMode = hashStr;
	}

})(Vue)