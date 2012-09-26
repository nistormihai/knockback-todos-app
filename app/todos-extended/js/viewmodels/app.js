// Generated by CoffeeScript 1.3.3
(function() {
  var ENTER_KEY;

  ENTER_KEY = 13;

  window.AppViewModel = function() {
    var filter_fn, router, tooltip_visible,
      _this = this;
    this.collections = {
      todos: new TodoCollection()
    };
    this.collections.todos.fetch();
    this.list_filter_mode = ko.observable('');
    filter_fn = ko.computed(function() {
      switch (_this.list_filter_mode()) {
        case 'active':
          return function(model) {
            return model.completed();
          };
        case 'completed':
          return function(model) {
            return !model.completed();
          };
        default:
          return function() {
            return false;
          };
      }
    });
    this.todos = kb.collectionObservable(this.collections.todos, {
      view_model: TodoViewModel,
      filters: filter_fn,
      sort_attribute: 'title'
    });
    this.todos_changed = kb.triggeredObservable(this.collections.todos, 'change add remove');
    this.tasks_exist = ko.computed(function() {
      _this.todos_changed();
      return !!_this.collections.todos.length;
    });
    this.title = ko.observable('');
    this.onAddTodo = function(view_model, event) {
      if (!$.trim(_this.title()) || (event.keyCode !== ENTER_KEY)) {
        return true;
      }
      _this.collections.todos.create({
        title: $.trim(_this.title()),
        priority: app_settings.default_priority()
      });
      return _this.title('');
    };
    this.remaining_count = ko.computed(function() {
      _this.todos_changed();
      return _this.collections.todos.remainingCount();
    });
    this.completed_count = ko.computed(function() {
      _this.todos_changed();
      return _this.collections.todos.completedCount();
    });
    this.all_completed = ko.computed({
      read: function() {
        return !_this.remaining_count();
      },
      write: function(completed) {
        return _this.collections.todos.completeAll(completed);
      }
    });
    this.remaining_message = ko.computed(function() {
      return "<strong>" + (_this.remaining_count()) + "</strong> " + (_this.remaining_count() === 1 ? 'item' : 'items') + " left";
    });
    this.onDestroyCompleted = function() {
      return _this.collections.todos.destroyCompleted();
    };
    router = new Backbone.Router;
    router.route('', null, function() {
      return _this.list_filter_mode('');
    });
    router.route('active', null, function() {
      return _this.list_filter_mode('active');
    });
    router.route('completed', null, function() {
      return _this.list_filter_mode('completed');
    });
    Backbone.history.start();
    this.priority_color = ko.computed(function() {
      return app_settings.default_priority_color();
    });
    this.tooltip_visible = ko.observable(false);
    tooltip_visible = this.tooltip_visible;
    this.onSelectPriority = function(view_model, event) {
      event.stopPropagation();
      tooltip_visible(false);
      return app_settings.default_priority(ko.utils.unwrapObservable(view_model.priority));
    };
    this.onToggleTooltip = function() {
      return _this.tooltip_visible(!_this.tooltip_visible());
    };
    this.sort_mode = ko.computed(function() {
      var new_mode;
      new_mode = app_settings.selected_list_sorting();
      switch (new_mode) {
        case 'label_title':
          return _this.todos.sortAttribute('title');
        case 'label_created':
          return _this.todos.comparator(function(model_a, model_b) {
            return kb.utils.wrappedModel(model_a).get('created_at').valueOf() - kb.utils.wrappedModel(model_b).get('created_at').valueOf();
          });
        case 'label_priority':
          return _this.todos.comparator(function(model_a, model_b) {
            var delta, rank_a, rank_b;
            rank_a = _.indexOf(['high', 'medium', 'low'], kb.utils.wrappedModel(model_a).get('priority'));
            rank_b = _.indexOf(['high', 'medium', 'low'], kb.utils.wrappedModel(model_b).get('priority'));
            if ((delta = rank_a - rank_b) !== 0) {
              return delta;
            }
            return kb.utils.wrappedModel(model_a).get('created_at').valueOf() - kb.utils.wrappedModel(model_b).get('created_at').valueOf();
          });
      }
    });
    this.remaining_message_key = ko.computed(function() {
      if (_this.remaining_count() === 1) {
        return 'remaining_template_s';
      } else {
        return 'remaining_template_pl';
      }
    });
    this.clear_message_key = ko.computed(function() {
      var count;
      if ((count = _this.completed_count()) === 0) {
        return null;
      } else {
        if (count === 1) {
          return 'clear_template_s';
        } else {
          return 'clear_template_pl';
        }
      }
    });
    this.loc = kb.viewModel(kb.locale_manager, {
      keys: ['complete_all', 'create_placeholder', 'create_tooltip', 'instructions', 'filter_all', 'filter_active', 'filter_completed'],
      mappings: {
        remaining_message: {
          key: this.remaining_message_key,
          args: function() {
            return _this.remaining_count();
          }
        },
        clear_message: {
          key: this.clear_message_key,
          args: function() {
            return _this.completed_count();
          }
        }
      }
    });
  };

}).call(this);