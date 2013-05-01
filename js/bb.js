(function($){

	var Forecast,
	 Forecasts,	 
	 SearchView,
	 ForecastView,
	 ForecastItemView,
	 forecasts,
	 searchView,
	 forecastView;
	
	// This will pull data from Weather Underground
	// Parse Data so that we can work with it
	//Valdiate our zip code. for sending to Weather Underground
	Forecast = Backbone.Model.extend({
		
		url: function() {
				return 'http://api.wunderground.com/api/7eaec3b21b154448/conditions/q/' + this.get('zip') + '.json';
		},
		parse: function(data, xhr) {
			// Stores the data we want to work with in a more convenient way.
			// Observation becomes an object {};
			var observation = data.current_observation;
			return {
				id: observation.display_location.zip,
				url: observation.icon_url,
				state:observation.display_location.state,
				zip:observation.display_location.zip,
				city: observation.display_location.city ,
				temp: observation.temp_f
			}
		},
		sync: function(method, model, options) {
			options.dataType = 'jsonp';
			return Backbone.sync(method, model, options);
		},

		validate: function(options) {
			// checks for zip which is stored in our options parameter
			// ! is a shortcut for checking if that value exists
			if (!options.zip) {
				return 'Please enter a zip code';
			}
		}
	});

	// Contains a list (or array) of Forecast items
	Forecasts = Backbone.Collection.extend({
		model: Forecast
	});

	SearchView = Backbone.View.extend({
		events: {
			'click #search':'addZip'
		},
		initialize: function() {
			this.collection.on('add', this.clear, this);
		}, 
		addZip: function(e) {
			//prevents form from submitting
			e.preventDefault(); 

			// this instantiates our Forecast Model
			// calls all the methods within Forecast
			this.model = new Forecast();
			
			this.model.on('error', this.toggleError, this);

			if ( this.model.set({ zip: this.$('#zip').val()	}) ) {
				this.collection.add(this.model);
				this.toggleError();
			}
		},
		clear: function() {
			this.$('#zip').val('');
		},
		toggleError: function(model, error) {
			this.$(".alert").text(error).toggle(!!error)
		}
	});

	ForecastView = Backbone.View.extend({
		events: {
			'click .delete': 'destroy'
		},
		initialize: function() {
			this.collection.on('add', this.render, this)
			this.collection.on('remove', this.remove, this);
		},
		render: function(model){
			var view = new ForecastItemView({id: model.get('zip'), model: model});
			this.$('tbody').append(view.el).closest('table').slideDown('slow');
		},
		remove: function(model) {
			$('#' + model.get('zip') ).remove();
			
			//!this.collection.length basically says if collection 
			//is empty, fade out $el, defined below.
			if(!this.collection.length) {
				this.$el.fadeOut('slow');
			}
		},
		destroy: function(e) {
			var id = $(e.currentTarget).closest('tr').attr('id');
			model = this.collection.get(id);

			this.collection.remove(model);
		}
	});

	ForecastItemView = Backbone.View.extend({
		tagName: 'tr',
		template: _.template(  $.trim( $('#forecast-template').html() )   ),
		initialize: function() {
			_.bindAll(this, 'render');
			// fetch cals the forecast.sync
			// pulling our data from WU.
			this.model.fetch({success: this.render})
		},
		render: function(model) {
			var content = this.template( model.toJSON()	);
			this.$el.html(content);
			return this;
		}
	});

	forecasts = new Forecasts();
	searchView = new SearchView({
		el: $('#weather'),
		collection: forecasts 
	});
	
	forecastView = new ForecastView( {
		el: $('#output'),
		collection: forecasts
	});

}(jQuery));