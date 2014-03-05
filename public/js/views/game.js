define([
    'backbone',
    'tmpl/game',
     'game/game'
], function(
    Backbone,
    tmpl,
    Game
){
 
    var View = Backbone.View.extend({
        el: $("#page"),
        template: tmpl,
        initialize: function () {
             
        },
        render: function () {
            this.$el.html(this.template);
            this.game = Game();        
        },
        show: function () {
            this.render();
        },
        hide: function () {
        	this.game = null;
        }
 
    });
 
    return new View();
});