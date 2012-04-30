(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  window.Todo = (function() {
    __extends(Todo, Backbone.Model);
    function Todo() {
      Todo.__super__.constructor.apply(this, arguments);
    }
    Todo.prototype.defaults = function() {
      return {
        created_at: new Date()
      };
    };
    Todo.prototype.set = function(attrs) {
      if (attrs && attrs.hasOwnProperty('completed') && _.isString(attrs['completed'])) {
        attrs['completed'] = new Date(attrs['completed']);
      }
      if (attrs && attrs.hasOwnProperty('created_at') && _.isString(attrs['created_at'])) {
        attrs['created_at'] = new Date(attrs['created_at']);
      }
      return Todo.__super__.set.apply(this, arguments);
    };
    Todo.prototype.completed = function(completed) {
      if (arguments.length === 0) {
        return !!this.get('completed');
      }
      return this.save({
        completed: completed ? new Date() : null
      });
    };
    return Todo;
  })();
}).call(this);
