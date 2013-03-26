// Generated by CoffeeScript 1.6.2
(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.TodoCollection = (function(_super) {
    __extends(TodoCollection, _super);

    function TodoCollection() {
      _ref = TodoCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TodoCollection.prototype.localStorage = new Store('todos-knockback');

    TodoCollection.prototype.model = Todo;

    TodoCollection.prototype.completedCount = function() {
      return this.models.reduce((function(prev, cur) {
        return prev + (cur.completed() ? 1 : 0);
      }), 0);
    };

    TodoCollection.prototype.remainingCount = function() {
      return this.models.length - this.completedCount();
    };

    TodoCollection.prototype.completeAll = function(completed) {
      return this.each(function(todo) {
        return todo.completed(completed);
      });
    };

    TodoCollection.prototype.destroyCompleted = function() {
      var completed_tasks, model, _i, _len;

      completed_tasks = this.filter(function(todo) {
        return todo.completed();
      });
      for (_i = 0, _len = completed_tasks.length; _i < _len; _i++) {
        model = completed_tasks[_i];
        model.destroy();
      }
    };

    return TodoCollection;

  })(Backbone.Collection);

}).call(this);
