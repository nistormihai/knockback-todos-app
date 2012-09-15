// Generated by CoffeeScript 1.3.3
(function() {
  var ENTER_KEY;

  ENTER_KEY = 13;

  window.TodoApp = function() {
    var router, tooltip_visible,
      _this = this;
    window.app = this;
    this.collections = {
      todos: new TodoCollection(),
      priorities: new PriorityCollection()
    };
    this.collections.todos.fetch();
    this.settings = new SettingsViewModel([new Backbone.ModelRef(this.collections.priorities, 'high'), new Backbone.ModelRef(this.collections.priorities, 'medium'), new Backbone.ModelRef(this.collections.priorities, 'low')], kb.locale_manager.getLocales());
    this.todos = kb.collectionObservable(this.collections.todos, {
      view_model: TodoViewModel,
      sort_attribute: 'title'
    });
    this.collections.todos.bind('change', function() {
      return _this.todos.notifySubscribers(_this.todos());
    });
    this.tasks_exist = ko.computed(function() {
      return _this.todos().length;
    });
    this.title = ko.observable('');
    this.onAddTodo = function(view_model, event) {
      if (!$.trim(_this.title()) || (event.keyCode !== ENTER_KEY)) {
        return true;
      }
      _this.collections.todos.create({
        title: $.trim(_this.title()),
        priority: _this.settings.default_priority()
      });
      return _this.title('');
    };
    this.all_completed = ko.computed({
      read: function() {
        return !_this.todos.collection().remainingCount();
      },
      write: function(completed) {
        return _this.todos.collection().completeAll(completed);
      }
    });
    this.remaining_text = ko.computed(function() {
      return "<strong>" + (_this.todos.collection().remainingCount()) + "</strong> " + (_this.todos.collection().remainingCount() === 1 ? 'item' : 'items') + " left";
    });
    this.onDestroyCompleted = function() {
      return _this.collections.todos.destroyCompleted();
    };
    router = new Backbone.Router;
    router.route('', null, function() {
      return _this.settings.list_filter_mode('');
    });
    router.route('active', null, function() {
      return _this.settings.list_filter_mode('active');
    });
    router.route('completed', null, function() {
      return _this.settings.list_filter_mode('completed');
    });
    Backbone.history.start();
    this.input_placeholder_text = kb.observable(kb.locale_manager, {
      key: 'placeholder_create'
    });
    this.input_tooltip_text = kb.observable(kb.locale_manager, {
      key: 'tooltip_create'
    });
    this.priority_color = ko.computed(function() {
      return _this.settings.default_priority_color();
    });
    this.tooltip_visible = ko.observable(false);
    tooltip_visible = this.tooltip_visible;
    this.onSelectPriority = function(view_model, event) {
      event.stopPropagation();
      tooltip_visible(false);
      return _this.settings.default_priority(ko.utils.unwrapObservable(_this.priority));
    };
    this.onToggleTooltip = function() {
      return _this.tooltip_visible(!_this.tooltip_visible());
    };
    this.sort_mode = ko.computed(function() {
      var new_mode;
      new_mode = _this.settings.selected_list_sorting();
      switch (new_mode) {
        case 'label_title':
          return _this.todos.sortAttribute('title');
        case 'label_created':
          return _this.todos.sortedIndex(function(models, model) {
            return _.sortedIndex(models, model, function(test) {
              return kb.utils.wrappedModel(test).get('created_at').valueOf();
            });
          });
        case 'label_priority':
          return _this.todos.sortedIndex(function(models, model) {
            return _.sortedIndex(models, model, function(test) {
              return _this.settings.priorityToRank(kb.utils.wrappedModel(test).get('priority'));
            });
          });
      }
    });
    this.complete_all_text = kb.observable(kb.locale_manager, {
      key: 'complete_all'
    });
    this.remaining_text_key = ko.computed(function() {
      if (_this.todos.collection().remainingCount() === 1) {
        return 'remaining_template_s';
      } else {
        return 'remaining_template_pl';
      }
    });
    this.remaining_text = kb.observable(kb.locale_manager, {
      key: this.remaining_text_key,
      args: function() {
        return _this.todos.collection().remainingCount();
      }
    });
    this.clear_text_key = ko.computed(function() {
      if (_this.todos.collection().completedCount() === 0) {
        return null;
      } else {
        if (_this.todos.collection().completedCount() === 1) {
          return 'clear_template_s';
        } else {
          return 'clear_template_pl';
        }
      }
    });
    this.clear_text = kb.observable(kb.locale_manager, {
      key: this.clear_text_key,
      args: function() {
        return _this.todos.collection().completedCount();
      }
    });
    this.instructions_text = kb.observable(kb.locale_manager, {
      key: 'instructions'
    });
    _.delay((function() {
      _this.collections.priorities.fetch({
        success: function(collection) {
          if (!collection.get('high')) {
            collection.create({
              id: 'high',
              color: '#bf30ff'
            });
          }
          if (!collection.get('medium')) {
            collection.create({
              id: 'medium',
              color: '#98acff'
            });
          }
          if (!collection.get('low')) {
            return collection.create({
              id: 'low',
              color: '#38ff6a'
            });
          }
        }
      });
      $('.colorpicker').mColorPicker({
        imageFolder: $.fn.mColorPicker.init.imageFolder
      });
      return $('.colorpicker').bind('colorpicked', function() {
        var model;
        model = _this.collections.priorities.get($(_this).attr('id'));
        if (model) {
          return model.save({
            color: $(_this).val()
          });
        }
      });
    }), 1000);
  };

}).call(this);